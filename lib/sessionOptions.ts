import { SessionOptions } from "iron-session";

if (!process.env.SESSION_PASSWORD || process.env.SESSION_PASSWORD.length < 32) {
  throw new Error("SESSION_PASSWORD doit être défini et contenir au moins 32 caractères");
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: "droovo_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      restaurantName: string;
      city?: string;
      cuisineIds?: string[]; // facultatif selon besoin
    };
  }
}

