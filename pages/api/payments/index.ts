import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  restaurantName: string;
  city?: string;
};

async function getSessionUser(req: NextApiRequest, res: NextApiResponse): Promise<SessionUser> {
  const session = await getIronSession<{ user?: SessionUser }>(req, res, sessionOptions);

  if (!session.user) {
    throw new Error("Utilisateur non connecté");
  }

  return session.user;
}

type PaymentResponse = {
  id: string;
  orderId: string;
  client: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  time: string;
  commission: number;
  net: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getSessionUser(req, res);

    if (req.method === "GET") {
      const payments = await prisma.payments.findMany({
        where: { userId: user.id },
        include: {
          orders: {
            select: {
              id: true,
              orderNumber: true,
              customers: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const methodMap: Record<string, string> = {
        CARD: "Carte bancaire",
        PAYPAL: "PayPal",
        CASH: "Espèces",
        BANK_TRANSFER: "Virement",
        STRIPE: "Stripe",
      };

      const statusMap: Record<string, string> = {
        COMPLETED: "Payé",
        PENDING: "En attente",
        REFUNDED: "Remboursé",
        FAILED: "Échoué",
      };

      const formattedPayments: PaymentResponse[] = payments.map((p) => {
        const commissionRate = p.method === "CASH" ? 0 : 0.05;
        const commission = Number(p.amount) * commissionRate;
        const net = Number(p.amount) - commission;

        return {
          id: p.id,
          orderId: p.orders?.orderNumber ?? "N/A",
          client: p.orders?.customers?.name ?? "Inconnu",
          amount: Number(p.amount),
          method: methodMap[p.method] ?? p.method,
          status: statusMap[p.status] ?? p.status,
          date: p.createdAt.toISOString().split("T")[0],
          time: p.createdAt.toISOString().split("T")[1].slice(0, 5),
          commission: Number(commission.toFixed(2)),
          net: Number(net.toFixed(2)),
        };
      });

      return res.status(200).json(formattedPayments);
    }

    if (req.method === "POST") {
      const { paymentId, action } = req.body;

      if (!paymentId || !action) {
        return res.status(400).json({ message: "Paramètres manquants." });
      }

      const paymentToUpdate = await prisma.payments.findUnique({
        where: { id: paymentId },
      });

      if (!paymentToUpdate || paymentToUpdate.userId !== user.id) {
        return res.status(403).json({ message: "Accès refusé à ce paiement." });
      }

      let newStatus: PaymentStatus;

      if (action === "markPaid") newStatus = "COMPLETED";
      else if (action === "cancel") newStatus = "FAILED";
      else return res.status(400).json({ message: "Action invalide." });

      const updatedPayment = await prisma.payments.update({
        where: { id: paymentId },
        data: { status: newStatus },
      });

      return res.status(200).json({ message: "Statut mis à jour avec succès.", payment: updatedPayment });
    }

    return res.status(405).json({ error: "Méthode non autorisée" });
  } catch (error: any) {
    console.error("Erreur API Paiements:", error.message || error);
    if (error.message === "Utilisateur non connecté") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
