import { prisma } from "./prisma"; // Assurez-vous que vous importez `prisma` correctement
import { SignJWT, jwtVerify, errors } from "jose"; // Import de 'jose' pour signer et vérifier les JWT

const JWT_SECRET: string = process.env.JWT_SECRET || "HdsS8vbGgcbPDYcDO7NTqLhofuGperYD";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  [key: string]: any; // Ajoute une signature d'index pour plus de flexibilité
}

// Vérifier la validité de JWT_SECRET
if (!JWT_SECRET || JWT_SECRET.trim() === "") {
  throw new Error("JWT_SECRET doit être une chaîne de caractères valide.");
}

// Vérifier la validité de JWT_EXPIRES_IN
const validExpirationValues = ["1h", "2h", "24h", "7d", "30d"]; // Liste des valeurs valides
if (!validExpirationValues.includes(JWT_EXPIRES_IN)) {
  throw new Error(`JWT_EXPIRES_IN doit être l'une des valeurs suivantes: ${validExpirationValues.join(", ")}`);
}

// Fonction pour signer un token JWT
export async function signToken(userId: string): Promise<string> {
  // Rechercher l'utilisateur dans la base de données
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    console.error(`Utilisateur avec l'ID ${userId} non trouvé.`);
    throw new Error("Utilisateur non trouvé");
  }

  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  try {
    // Créer et retourner le token signé avec jose
    const alg = "HS256"; // Choisir un algorithme de signature (HS256 est couramment utilisé)
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(JWT_EXPIRES_IN) // Définir la durée d'expiration
      .sign(new TextEncoder().encode(JWT_SECRET)); // Encoder le secret en bytes
    return token;
  } catch (error) {
    console.error("Erreur lors de la génération du token JWT:", error);
    throw new Error("Erreur lors de la génération du token JWT.");
  }
}

// Fonction pour vérifier un token JWT
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    // Vérification du token avec la bibliothèque 'jose'
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    // Vérifier si le payload contient les données essentielles
    if (!payload.userId || !payload.email || !payload.role) {
      throw new Error("Payload du token malformé.");
    }

    return payload as JWTPayload; // Retourner le payload (contenant les informations utilisateur)
  } catch (error) {
    console.error("Erreur de vérification du token JWT:", error);

    // Gestion des erreurs spécifiques
    if (error instanceof errors.JWTExpired) {
      throw new Error("Token expiré");
    }
    if (error instanceof errors.JWTInvalid) {
      throw new Error("Token invalide");
    }

    // Retourner une erreur générique pour d'autres types d'échecs
    throw new Error("Token invalide ou expiré.");
  }
}

// Fonction pour extraire le token de l'en-tête Authorization
export function extractTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("En-tête Authorization manquant ou mal formé :", authHeader);
    throw new Error("Token manquant ou format incorrect dans l'en-tête Authorization. Attendez un format 'Bearer token'.");
  }
  return authHeader.substring(7); // Retirer le préfixe "Bearer "
}