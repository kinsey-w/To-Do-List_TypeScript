import supabase from "./init.js";

// Fonction pour mettre à jour une tâche
const updateTask = async (taskId: string, updates: object) => {
  // Tenter une mise à jour de la tâche avec les données fournies
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId); // Identifier la tâche à mettre à jour

  // Gérer les erreurs potentielles
  if (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error.message);
    return false;
  }

  return true; // Retourner `true` si la tâche a été mise à jour avec succès
};

export default updateTask;
