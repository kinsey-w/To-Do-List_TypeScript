import supabase from "./init.js";
// Fonction pour gérer la connexion utilisateur
const signIn = async (email, password) => {
    // Tenter une connexion avec l'email et le mot de passe fournis
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    // Gérer les erreurs de connexion
    if (error) {
        console.error("Échec de la connexion :", error.message);
        return null;
    }
    // Retourner les informations de l'utilisateur et de la session
    const { user, session } = data;
    console.log("Connexion réussie :", { user, session });
    return { user, session };
};
export default signIn;
