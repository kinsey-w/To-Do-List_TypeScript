import register from "../js/register.js";
import signIn from "../js/login.js";
import createTask from "../js/insert.js";
import supabase from "../js/init.js";
import updateTask from "../js/update.js";
import deleteTask from "../js/delete.js";

// Références aux éléments HTML
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const taskForm = document.getElementById("task-form");
const tasksList = document.getElementById("tasks-list");
const logoutButton = document.getElementById("logout-button");
const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const tasksSection = document.getElementById("tasks-section");
const addTaskNav = document.getElementById("add-task-nav");

// Création d'une div pour afficher les messages (succès/erreur)
const taskMessage = document.createElement("div");
taskMessage.id = "task-message";
addTaskNav.insertAdjacentElement("afterend", taskMessage);

let userSession = null; // Session utilisateur actuelle

// Fonction pour changer l'interface selon l'état de connexion
function toggleUI(loggedIn) {
  registerSection.style.display = loggedIn ? "none" : "flex";
  loginSection.style.display = loggedIn ? "none" : "flex";
  tasksSection.style.display = loggedIn ? "flex" : "none";
  logoutButton.style.display = loggedIn ? "inline-block" : "none";
  addTaskNav.style.display = loggedIn ? "flex" : "none";
}

// Messages succès / erreur
function displayMessage(message, success = true) {
  taskMessage.textContent = message;
  taskMessage.style.color = success ? "green" : "red";
  taskMessage.style.margin = "10px 0";
  setTimeout(() => {
    taskMessage.textContent = "";
  }, 3000);
}

// Enregistrement utilisateur
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const result = await register(email, password);

  // Afficher un message spécifique selon le résultat
  if (result.success) {
    displayMessage(result.message); // Afficher le message de succès
  } else {
    displayMessage(result.message, false); // Afficher le message d'erreur
  }
});


// Connexion utilisateur
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const result = await signIn(email, password);
  if (result) {
    userSession = result.session; // Stocker la session utilisateur
    toggleUI(true); // Afficher l'interface connectée
    fetchTasks(); // Charger les tâches
  } else {
    displayMessage("Échec de la connexion.", false);
  }
});

// Déconnexion utilisateur
logoutButton.addEventListener("click", () => {
  userSession = null;
  toggleUI(false); // Basculer à l'interface déconnectée
});

// Ajout nouvelle tâche
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const deadline = document.getElementById("task-deadline").value;
  const color = document.getElementById("task-color").value;
  const result = await createTask(title, description, deadline, color);
  if (result) {
    displayMessage("Tâche ajoutée !");
    taskForm.reset(); // Réinitialiser le formulaire
    fetchTasks(); // Rafraîchir les tâches
  } else {
    displayMessage("Échec de l'ajout de la tâche.", false);
  }
});

// Fonction pour formater une date en dd/mm/yyyy
function formatDate(dateString) {
  const date = new Date(dateString); // Convertir la chaîne en objet Date
  const day = String(date.getDate()).padStart(2, "0"); // Jour avec deux chiffres
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Mois (0-11) avec deux chiffres
  const year = date.getFullYear(); // Année
  return `${day}/${month}/${year}`; // Retourner au format dd/mm/yyyy
}

// Fonction pour charger et afficher les tâches
async function fetchTasks() {
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userSession.user.id);

  tasksList.innerHTML = tasks
    .map((task) => {
      const isCompleted = task.status === "completed"; // Vérifier si la tâche est terminée
      const formattedDeadline = formatDate(task.deadline); // Formater la date
      return `
        <div class="task-item" style="background-color:${task.color}">
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p class="task-deadline">Deadline: ${formattedDeadline}</p>
          ${
            !isCompleted
              ? `<div class="task-icons">
                  <i class="icon complete-icon" data-id="${task.id}" title="Mark as complete">✔️</i>
                  <i class="icon delete-icon" data-id="${task.id}" title="Delete">❌</i>
                </div>`
              : '<p class="task-status">Completed</p>'
          }
        </div>
      `;
    })
    .join("");

  attachTaskEventListeners(); 
}

// Fonction icônes des tâches
function attachTaskEventListeners() {
  document.querySelectorAll(".complete-icon").forEach((icon) =>
    icon.addEventListener("click", async (e) => {
      const taskId = e.target.getAttribute("data-id");
      const result = await updateTask(taskId, { status: "completed" });
      if (result) fetchTasks();
    })
  );

  document.querySelectorAll(".delete-icon").forEach((icon) =>
    icon.addEventListener("click", async (e) => {
      const taskId = e.target.getAttribute("data-id");
      const result = await deleteTask(taskId);
      if (result) fetchTasks();
    })
  );
}

// Initialiser l'interface à l'état déconnecté
toggleUI(false);
