import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { NextApiRequest, NextApiResponse } from "next";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  restaurantName: string;
  city?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<{ user?: SessionUser }>(req, res, sessionOptions);

  if (!session.user) {
    return res.status(401).json({ valid: false });
  }

  return res.status(200).json({ valid: true });
}
