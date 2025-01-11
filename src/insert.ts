import supabase from "./init.js";

// Fonction pour créer une nouvelle tâche
const createTask = async (title: string, description: string, deadline: string, color: string) => {
  // Vérifier si l'utilisateur est connecté
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("L'utilisateur n'est pas connecté ou une erreur s'est produite :", userError?.message);
    return false;
  }

  // Insérer une nouvelle tâche dans la base de données
  const { data, error } = await supabase.from("tasks").insert({
    user_id: user.id, // Associer la tâche à l'utilisateur connecté
    title,
    description,
    status: "pending", // Par défaut, le statut est "en attente"
    deadline,
    color,
  });

  // Gérer les erreurs
  if (error) {
    console.error("Erreur lors de la création de la tâche :", error.message);
    return false;
  }

  return true; // Retourner `true` si la tâche a été ajoutée avec succès
};

export default createTask;
