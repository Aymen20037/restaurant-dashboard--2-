import { prisma } from "./prisma" // Assurez-vous que vous importez `prisma` correctement
import { SignJWT, jwtVerify } from 'jose'; // Import de 'jose' pour signer et vérifier les JWT

const JWT_SECRET: string = process.env.JWT_SECRET || "XklGSi4lLX6szVBIIDqRRyAmCAtdK8pd"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  [key: string]: any; // Adding an index signature
}

// Vérifier la validité de JWT_SECRET
if (typeof JWT_SECRET !== "string" || JWT_SECRET.trim() === "") {
  throw new Error("JWT_SECRET doit être une chaîne de caractères valide.")
}

// Vérifier la validité de JWT_EXPIRES_IN
const validExpirationValues = ["1h", "2h", "24h", "7d", "30d"]; // Liste des valeurs valides
if (typeof JWT_EXPIRES_IN !== "string" || !validExpirationValues.includes(JWT_EXPIRES_IN)) {
  throw new Error(`JWT_EXPIRES_IN doit être l'une des valeurs suivantes: ${validExpirationValues.join(", ")}`)
}

// Utilisation de l'instance de prisma pour accéder au modèle User
export async function signToken(userId: string): Promise<string> {
  // Rechercher l'utilisateur dans la base de données
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  try {
    // Créer et retourner le token signé avec jose
    const alg = 'HS256'; // Choisir un algorithme de signature (HS256 est couramment utilisé)
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(JWT_EXPIRES_IN) // Définir la durée d'expiration
      .sign(new TextEncoder().encode(JWT_SECRET)) // Encoder le secret en bytes
    return token
  } catch (error) {
    throw new Error("Erreur lors de la génération du token JWT.")
  }
}

// Fonction pour vérifier le token et retourner son payload
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload as JWTPayload
  } catch (error) {
    throw new Error("Token invalide ou expiré.")
  }
}

// Fonction pour extraire le token de l'en-tête Authorization
export function extractTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token manquant ou format incorrect dans l'en-tête.")
  }
  return authHeader.substring(7) // Retirer le préfixe "Bearer "
}
