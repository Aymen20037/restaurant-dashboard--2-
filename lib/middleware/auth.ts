import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export interface AuthenticatedRequest extends NextApiRequest {
  req: {
    id: string;
    email: string;
    name: string;
    role: string;
    restaurantName: string;
    city : string;
  };
  user?: {
    userId: any;
    userData: any;
    id: string;
    email: string;
    name: string;
    role: string;
    restaurantName: string;
    city: string;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const session = (await getIronSession(req, res, sessionOptions)) as {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        restaurantName: string;
        city:string;
      };
    };

    if (!session.user) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    req.user = {
      userId: session.user.id,
      userData: session.user, 
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      restaurantName: session.user.restaurantName,
      city: session.user.city,
    };

    return handler(req, res);
  };
}

export function withRole(roles: string[]) {
  return (
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
  ) =>
    withAuth(async (req, res) => {
      const role = req.user?.role;
      if (!role || !roles.includes(role)) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      return handler(req, res);
    });
}
