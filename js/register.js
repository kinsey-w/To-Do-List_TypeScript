import supabase from "./init.js";
// Fonction pour gérer l'enregistrement utilisateur
const register = async (email, password) => {
    try {
        // Tenter de créer un nouvel utilisateur avec l'email et le mot de passe fournis
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        // Gérer les erreurs d'enregistrement avec des messages spécifiques
        if (error) {
            if (error.message.includes("Password should be at least 6 characters")) {
                console.error("Erreur : le mot de passe doit comporter au moins 6 caractères.");
                return { success: false, message: "Le mot de passe doit comporter au moins 6 caractères." };
            }
            if (error.message.includes("Invalid email")) {
                console.error("Erreur : l'adresse e-mail est invalide.");
                return { success: false, message: "L'adresse e-mail est invalide." };
            }
            console.error("Erreur lors de l'enregistrement :", error.message);
            return { success: false, message: "Une erreur s'est produite lors de l'enregistrement." };
        }
        console.log("Enregistrement réussi :", data);
        return { success: true, message: "Enregistrement réussi !" }; // Retourner un objet de succès
    }
    catch (err) {
        console.error("Erreur inattendue :", err);
        return { success: false, message: "Une erreur inattendue s'est produite." };
    }
};
export default register;
