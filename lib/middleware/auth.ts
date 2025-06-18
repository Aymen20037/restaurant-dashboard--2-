import type { NextApiRequest, NextApiResponse } from "next"
import { verifyToken, extractTokenFromHeader, type JWTPayload } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

export interface AuthenticatedRequest extends NextApiRequest {
  user: JWTPayload & {
    userData: any
  }
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = extractTokenFromHeader(req.headers.authorization)
      const payload = await verifyToken(token)

      // Vérifier que l'utilisateur existe toujours
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      })

      if (!user || !user.isActive) {
        return res.status(401).json({ error: "Utilisateur non trouvé ou inactif" })
      }
      ;(req as AuthenticatedRequest).user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        userData: user,
      }

      return handler(req as AuthenticatedRequest, res)
    } catch (error) {
      return res.status(401).json({ error: "Non autorisé" })
    }
  }
}

export function withRole(roles: string[]) {
  return (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) =>
    withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Accès refusé" })
      }
      return handler(req, res)
    })
}
