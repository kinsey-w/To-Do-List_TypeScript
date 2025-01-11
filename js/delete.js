import supabase from "./init.js";
import user from "./login.js";
// Fonction pour supprimer une tâche (uniquement si elle n'est pas complétée)
const deleteTask = async (taskId) => {
    const userLogged = await user;
    if (!userLogged) {
        console.error("L'utilisateur n'est pas connecté.");
        return false;
    }
    // Vérifier si la tâche est déjà complétée
    const { data: task, error: fetchError } = await supabase
        .from("tasks")
        .select("status")
        .eq("id", taskId)
        .single();
    if (fetchError) {
        console.error(fetchError);
        return false;
    }
    if (task.status === "completed") {
        console.error("Impossible de supprimer les tâches complétées.");
        return false;
    }
    // Supprimer la tâche
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
        console.error(error);
        return false;
    }
    console.log("Tâche supprimée avec succès.");
    return true;
};
export default deleteTask;
