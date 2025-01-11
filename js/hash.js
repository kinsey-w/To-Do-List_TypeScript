import { hash } from "bcrypt-ts";
// Fonction pour hasher un mot de passe
export async function hashPassword(plainPassword) {
    try {
        return await hash(plainPassword, 10);
    }
    catch (error) {
        console.error("Erreur lors du hashage du mot de passe:", error);
        throw error;
    }
}
