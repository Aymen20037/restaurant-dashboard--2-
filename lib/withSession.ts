import { getIronSession, SessionOptions } from "iron-session";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "./session";

export function withSession(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession(req, res, sessionOptions);
    (req as NextApiRequest & { session: typeof session }).session = session;

    return handler(req, res);
  };
}
