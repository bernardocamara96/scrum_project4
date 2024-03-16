/* JavaScript File - all the code that was written goes here  */
/* Switch to strict mode to get more useful errors, when/if you make mistakes. */
"use strict";

import * as language from "./language.js";
import * as username from "./username.js";
import * as theme from "./theme.js";
import * as logout from "./logout.js";
import * as photoUser from "./UserPhoto.js";

const TODO_COLUMN = 100;
const DOING_COLUMN = 200;
const DONE_COLUMN = 300;
const priority_low = 1;
const priority_medium = 2;
const priority_high = 3;

let userList = null;
let categoryList = null;

language.listenerLanguageBtns(); // adds listener to the language buttons
/**************************************************************************************************************************************************************************************/
/* DOMcl sets username, changes theme *** */
/**************************************************************************************************************************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
   username.setUsername(); // set username on loading
   theme.loadTheme(); // loads up the previously set theme
   language.underlineLangFlag();
   logout.clickOnLogout();
   photoUser.loadPhoto();
   createDropListnerForTasks();
   createFilter();
   createDefalutFiltersIfNotExistent();
   switchLoadByFilters();
});

/**************************************************************************************************************************************************************************************/
/* function loadTasks - LOAD ALL TASKS */
/**************************************************************************************************************************************************************************************/

/*function navButtons() {
   document.querySelector("#difSettings-tasks").disabled = false;
   document.querySelector("#difSettings-users").disabled = false;
   document.querySelector("#difSettings-categories").disabled = false;
}*/

function createDefalutFiltersIfNotExistent() {
   const userfilter = sessionStorage.getItem("usernameFilter");
   const categoryFilter = sessionStorage.getItem("categorySelected");
   if (!userfilter) sessionStorage.setItem("usernameFilter", "default");
   if (!categoryFilter) sessionStorage.setItem("categorySelected", "default");
}
function switchLoadByFilters() {
   clearTasks();
   if (
      sessionStorage.getItem("usernameFilter") === "default" &&
      sessionStorage.getItem("categorySelected") === "default"
   ) {
      loadTasks();
   } else if (
      sessionStorage.getItem("usernameFilter") !== "default" &&
      sessionStorage.getItem("categorySelected") === "default"
   ) {
      loadTasksByUser();
   } else if (
      sessionStorage.getItem("usernameFilter") === "default" &&
      sessionStorage.getItem("categorySelected") !== "default"
   ) {
      loadTasksByCategory();
   } else if (
      sessionStorage.getItem("usernameFilter") !== "default" &&
      sessionStorage.getItem("categorySelected") !== "default"
   ) {
      loadTasksByUserAndCategory();
   }
}
function orderTasks(tasks) {
   tasks.sort((a, b) => {
      if (a.priority > b.priority) {
         return -1;
      } else if (a.priority < b.priority) {
         return 1;
      }

      // Handle initial dates
      if (a.startDate == undefined && b.startDate != undefined) {
         return 1;
      } else if (a.startDate != undefined && b.startDate === undefined) {
         return -1;
      } else if (a.startDate != undefined && b.startDate != undefined) {
         if (a.startDate < b.startDate) {
            return -1;
         } else if (a.startDate > b.startDate) {
            return 1;
         }
      }
      // Compare based on closest initial dates

      // Handle end dates
      if (a.endDate == undefined && b.endDate != undefined) {
         return 1;
      } else if (a.endDate != undefined && b.endDate == undefined) {
         return -1;
      } else if (a.endDate != undefined && b.endDate != undefined) {
         if (a.endDate < b.endDate) {
            return -1;
         } else if (a.endDate > b.endDate) {
            return 1;
         }
         // Compare based on closest end dates
      }

      return 0;
   });

   return tasks;
}

async function loadTasks() {
   try {
      const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/task/allnotdeleted", {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      });

      if (response.ok) {
         const tasksFromServer = await response.json(); // Assume que o backend retorna um array de tarefas
         const tasks = orderTasks(tasksFromServer); // Atualiza a variável tasks com os dados recebidos
         tasks.forEach((task) => {
            addTaskToRightList(task); // Adiciona cada tarefa à lista correta na UI
         });
         updateTaskCountView();
         clickOnTaskListner();
      } else if (response.status === 403) {
         alert("You don't have permission to access this page. Please login again.");
         window.location.href = "index.html";
      } else {
         console.error("Falha ao carregar tarefas:", response.statusText);
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar tarefas:", error);
   }
}

async function loadTasksByUser() {
   const filteredUsername = sessionStorage.getItem("usernameFilter");
   try {
      const response = await fetch(
         `http://localhost:8080/tiago-bernardo-proj3/rest/task/allbyuser?username=${filteredUsername}`,
         {
            method: "GET",
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               token: sessionStorage.getItem("token"),
            },
         }
      );

      if (response.ok) {
         const tasksFromServer = await response.json(); // Assume que o backend retorna um array de tarefas
         const tasks = orderTasks(tasksFromServer); // Atualiza a variável tasks com os dados recebidos
         tasks.forEach((task) => {
            addTaskToRightList(task); // Adiciona cada tarefa à lista correta na UI
         });
         updateTaskCountView();
         clickOnTaskListner();
      } else if (response.status === 403) {
         alert("You don't have permission to access this page. Please login again.");
         window.location.href = "index.html";
      } else {
         console.error("Falha ao carregar tarefas:", response.statusText);
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar tarefas:", error);
   }
}
async function loadTasksByCategory() {
   const category_type = sessionStorage.getItem("categorySelected");
   try {
      const response = await fetch(
         `http://localhost:8080/tiago-bernardo-proj3/rest/task/allbycategory?category=${category_type}`,
         {
            method: "GET",
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               token: sessionStorage.getItem("token"),
            },
         }
      );

      if (response.ok) {
         const tasksFromServer = await response.json(); // Assume que o backend retorna um array de tarefas
         const tasks = orderTasks(tasksFromServer); // Atualiza a variável tasks com os dados recebidos
         tasks.forEach((task) => {
            addTaskToRightList(task); // Adiciona cada tarefa à lista correta na UI
         });
         updateTaskCountView();
         clickOnTaskListner();
      } else if (response.status === 403) {
         alert("You don't have permission to access this page. Please login again.");
         window.location.href = "index.html";
      } else {
         console.error("Falha ao carregar tarefas:", response.statusText);
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar tarefas:", error);
   }
}
async function loadTasksByUserAndCategory() {
   const category_type = sessionStorage.getItem("categorySelected");
   const filteredUsername = sessionStorage.getItem("usernameFilter");
   try {
      const response = await fetch(
         `http://localhost:8080/tiago-bernardo-proj3/rest/task/allbyuserandcategory?username=${filteredUsername}&category=${category_type}`,
         {
            method: "GET",
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               token: sessionStorage.getItem("token"),
            },
         }
      );

      if (response.ok) {
         const tasksFromServer = await response.json(); // Assume que o backend retorna um array de tarefas
         const tasks = orderTasks(tasksFromServer); // Atualiza a variável tasks com os dados recebidos
         tasks.forEach((task) => {
            addTaskToRightList(task); // Adiciona cada tarefa à lista correta na UI
         });
         updateTaskCountView();
         clickOnTaskListner();
      } else if (response.status === 403) {
         alert("You don't have permission to access this page. Please login again.");
         window.location.href = "index.html";
      } else {
         console.error("Falha ao carregar tarefas:", response.statusText);
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar tarefas:", error);
   }
}

function clearTasks() {
   // Seleciona todas as listas de tarefas
   const taskLists = document.querySelectorAll(".ul-tasks");
   // Para cada lista, remove todos os itens (tarefas) filhos
   taskLists.forEach((list) => {
      while (list.firstChild) {
         list.removeChild(list.firstChild);
      }
   });
}

/**************************************************************************************************************************************************************************************/
/* function addTaskToRightList - ADD TASKS TO THE RIGHT LIST */
/**************************************************************************************************************************************************************************************/
function addTaskToRightList(task) {
   /* <li> list items */
   const itemList = document.createElement("li"); // Creates a new <li> element
   itemList.setAttribute("data-task-id", task.id);
   itemList.classList.add("task-item");
   itemList.setAttribute("draggable", "true");
   const itemTitle = document.createElement("h3");
   if (task.title.length > 9) {
      itemTitle.textContent = task.title.substring(0, 10) + "..";
   } else itemTitle.textContent = task.title;
   const category_author = document.createElement("div");
   category_author.classList.add("category_author");
   const itemAuthor = document.createElement("span");
   if (task.username_author == "deletedTasks") {
      itemAuthor.textContent = "Delet. User";
   } else itemAuthor.textContent = task.username_author.substring(0, 8);
   itemAuthor.style.marginRight = "30px";

   const itemCategory = document.createElement("span");
   itemCategory.textContent = task.category_type.substring(0, 8);

   const itemDescription = document.createElement("p");
   if (task.description.length > 44) {
      itemDescription.textContent = task.description.substring(0, 40) + "..";
   } else itemDescription.textContent = task.description;

   /* Creating the buttons */
   const nextButton = createNextButton();
   //const delButton = createDelButton(task.id);

   const prevButton = createPrevButton();

   /* Creating the button Listeners */
   createNextBtnListener(nextButton, task);
   createPrevBtnListener(prevButton, task);
   createDragDropListener(itemList, task);

   /* Creating div's */
   const bannerDiv = document.createElement("div");
   bannerDiv.classList.add("banner");
   bannerDiv.appendChild(itemTitle);

   category_author.appendChild(itemAuthor);
   category_author.appendChild(itemCategory);
   bannerDiv.appendChild(category_author);
   const contentDiv = document.createElement("div");
   contentDiv.classList.add("content");
   contentDiv.appendChild(itemDescription);

   /* Append Title and Description to Task */
   itemList.appendChild(bannerDiv);
   itemList.appendChild(contentDiv);
   let priority = Number(task.priority);
   /*Eliminar em baixo quando propriedade for incluida em tarefa*/
   const priorityDiv = document.createElement("div");
   if (priority === priority_low) {
      priorityDiv.classList.add("low-priority");
   } else if (priority === priority_medium) {
      priorityDiv.classList.add("medium-priority");
   } else if (priority === priority_high) {
      priorityDiv.classList.add("high-priority");
   }

   priorityDiv.classList.add("priority-div");
   itemList.appendChild(priorityDiv);

   /* Append Buttons to Task - with contextual relevance logic */
   if (task.status !== DONE_COLUMN) {
      itemList.appendChild(nextButton);
   } //this one is not added in right most column
   addButtons(task, itemList, prevButton);
   /*itemList.appendChild(delButton); // this one is always added
   if (task.status !== TODO_COLUMN) {
      itemList.appendChild(prevButton);
   } //this one is not added in left most column

   /* Add Task to correct List */
   let collumn;
   if (task.status === TODO_COLUMN) collumn = "TODO_COLUMN";
   else if (task.status === DOING_COLUMN) collumn = "DOING_COLUMN";
   else if (task.status === DONE_COLUMN) collumn = "DONE_COLUMN";
   document.getElementById(collumn).appendChild(itemList);
   updateTaskCountView();
}

/**************************************************************************************************************************************************************************************/
/* function createNextButton() - creates and returns the nextButton  */
/**************************************************************************************************************************************************************************************/
function createNextButton() {
   const nextButton = document.createElement("button");
   nextButton.textContent = ">";

   return nextButton;
}
/**************************************************************************************************************************************************************************************/
/* function createDelButton() - creates and returns the delButton  */
/**************************************************************************************************************************************************************************************/
function createDelButton() {
   const delButton = document.createElement("button");
   const delIcon = document.createElement("img");
   delIcon.src = "images/trashCanIcon.png";
   delIcon.alt = "del";
   delButton.appendChild(delIcon);

   return delButton;
}

async function addButtons(task, itemList, prevButton) {
   const taskId = task.id;
   const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/permission/edit/${taskId}`, {
      method: "GET",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });
   if (response.ok) {
      const delButton = createDelButton(task.id);
      createDelBtnListener(delButton, task);
      itemList.appendChild(delButton); // this one is always added
      if (task.status !== TODO_COLUMN) {
         itemList.appendChild(prevButton);
      } //this one is not added in left most column
   } else {
      const errorMessage = await response.text();
      if (errorMessage === "Don't have permission to edit this task") {
         // this one is always added
         if (task.status !== TODO_COLUMN) {
            itemList.appendChild(prevButton);
         } //this one is not added in left most
      } else if (response.status == 403) {
         window.location.href = "index.html";
      }
   }
}
/**************************************************************************************************************************************************************************************/
/* function createPrevButton() - creates and returns the prevButton  */
/**************************************************************************************************************************************************************************************/
function createPrevButton() {
   const prevButton = document.createElement("button");
   prevButton.textContent = "<";

   return prevButton;
}
/**************************************************************************************************************************************************************************************/
/* function createDragDropListener --- 'e',aka, event object -> `dataTransfer` property -> sets the data, of the element being dragged, as the `id` of the `task` object
/**************************************************************************************************************************************************************************************/
function createDragDropListener(itemList, task) {
   itemList.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", task.id);
   });
}
function createDropListnerForTasks() {
   document.querySelectorAll(".ul-tasks").forEach((column) => {
      //faz com que as listas recebam itens
      let status = column.id;
      if (status === "TODO_COLUMN") status = TODO_COLUMN;
      else if (status === "DOING_COLUMN") status = DOING_COLUMN;
      else if (status === "DONE_COLUMN") status = DONE_COLUMN;
      console.log(status);
      column.addEventListener("dragover", function (e) {
         e.preventDefault(); // Permite o drop
      });

      column.addEventListener("drop", function (e) {
         e.preventDefault();
         const taskId = Number(e.dataTransfer.getData("text/plain"));
         // Lógica para mover a tarefa para a coluna atual
         updateTaskStatus(taskId, status);
      });
   });
}

/**************************************************************************************************************************************************************************************/
/* ADD ACTION LISTENERS TO THE EACH TASK ITEM - Only on the task-item excluding buttons 
/**************************************************************************************************************************************************************************************/
function clickOnTaskListner() {
   const tasksContainer = document.querySelector(".mainBoard-tasks-container");

   tasksContainer.addEventListener("click", function (event) {
      // Verificar se o clique foi diretamente num botão
      if (event.target.tagName === "BUTTON" || event.target.tagName === "IMG") {
         return; // Não faz nada se um botão foi clicado, permitindo que o evento do botão seja processado
      }

      let targetElement = event.target;
      //verifica qual o elemento pai que realmente corresponde ao um task-item
      while (targetElement != null && !targetElement.classList.contains("task-item")) {
         targetElement = targetElement.parentElement;
      }
      // Se um task-item for clicado
      if (targetElement && targetElement.classList.contains("task-item")) {
         const taskId = targetElement.getAttribute("data-task-id");
         window.location.href = `edittask.html?taskId=${taskId}`;
      }
   });
}
/**************************************************************************************************************************************************************************************/
/* function createNextBtnListener - CREATES NEXT BUTTON LISTENER AND HANDLES THE LOGIC RESPONSE - moving to NEXT column and saving/updating the display
/**************************************************************************************************************************************************************************************/
function createNextBtnListener(nextButton, task) {
   nextButton.addEventListener("click", function () {
      let nextStatus = ""; // declare variable: var nextStatus is not recommended after IE6, best practice is let keyword
      if (task.status === TODO_COLUMN) {
         nextStatus = DOING_COLUMN;
      } else if (task.status === DOING_COLUMN) {
         nextStatus = DONE_COLUMN;
      } else if (task.status === DONE_COLUMN) {
         nextStatus = DONE_COLUMN;
      }
      moveTaskOnCLick(task, nextStatus);
   });
}
/**************************************************************************************************************************************************************************************/
/* function createDelBtnListener - CREATES DEL BUTTON LISTENER AND HANDLES THE LOGIC RESPONSE - deleting the task if pressed + confirmed
/**************************************************************************************************************************************************************************************/
function createDelBtnListener(delButton, task) {
   delButton.addEventListener("click", function () {
      if (delConfirmation()) {
         // boolean confirm
         delTask(task);
      }
   });
}
/**************************************************************************************************************************************************************************************/
/* function delConfirmation - Delete confirmation small box appears - boolean logic return value
/**************************************************************************************************************************************************************************************/
function delConfirmation() {
   let delConfirmMsg = "Are you sure you want to delete this task?";
   // (alternatives would be: alert ||prompt || modal popup (but those are annoying! please never use those))
   return confirm(delConfirmMsg);
}
/**************************************************************************************************************************************************************************************/
/* function createPrevBtnListener - CREATES PREV BUTTON LISTENER AND HANDLES THE LOGIC RESPONSE - moving to PREVIOUS column and saving/updating the display
/**************************************************************************************************************************************************************************************/
function createPrevBtnListener(nextButton, task) {
   nextButton.addEventListener("click", function () {
      let nextStatus = "";
      if (task.status === DOING_COLUMN) {
         nextStatus = TODO_COLUMN;
      } else if (task.status === DONE_COLUMN) {
         nextStatus = DOING_COLUMN;
      } else if (task.status === TODO_COLUMN) {
         nextStatus = TODO_COLUMN;
      }
      moveTaskOnCLick(task, nextStatus);
   });
}
/**************************************************************************************************************************************************************************************/
/* function delTask(task) - DELETES A TASK PASSED BY ARGUMENT - deletes task and saves/updatesthe display
/**************************************************************************************************************************************************************************************/
async function delTask(task) {
   try {
      const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/deletetemp/${task.id}`, {
         method: "PATCH", // Método HTTP para deleção
         headers: {
            // Assume que a autenticação é feita via cabeçalhos 'username' e 'password'
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      });
      if (response.ok) {
         // Procura o elemento da tarefa no DOM e o remove
         const oldTaskElement = document.querySelector(`[data-task-id="${task.id}"]`);
         if (oldTaskElement) {
            oldTaskElement.remove();
         }
         // Atualiza a lista de tarefas e a visualização // Limpa as tarefas da UI
         await switchLoadByFilters(); // Recarrega as tarefas do backend ou ajuste conforme necessário
         updateTaskCountView();
      } else {
         // Trata erros de resposta não-OK (ex., 401, 403, 404, etc.)
         console.error("Failed to delete task:", response.statusText);
         alert("Failed to delete task. Please try again.");
      }
   } catch (error) {
      // Trata erros de rede ou de comunicação com o servidor
      console.error("Network error when trying to delete task:", error);
      alert("Network error. Please check your connection and try again.");
   }
}

/**************************************************************************************************************************************************************************************/
/* function moveTaskOnCLick(task, nextStatus) - 
/**************************************************************************************************************************************************************************************/
function moveTaskOnCLick(task, nextStatus) {
   const oldTaskElement = document.querySelector(`[data-task-id="${task.id}"]`);
   if (oldTaskElement) {
      oldTaskElement.remove();
   }
   updateTaskStatus(task.id, nextStatus);
}

async function updateTaskStatus(taskId, newStatus) {
   const taskUpdate = { status: newStatus };
   try {
      const response = await fetch(
         `http://localhost:8080/tiago-bernardo-proj3/rest/task/status/${taskId}/${newStatus}`,
         {
            method: "PATCH",
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               token: sessionStorage.getItem("token"),
            },
         }
      );

      if (response.status == 403) {
         window.location.href = "index.html";
      } else if (!response.ok) {
         throw new Error("Failed to update task status");
      }

      // Recarregar ou atualizar a interface do usuário conforme necessário
      clearTasks();
      switchLoadByFilters();
   } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
   }
}

/**************************************************************************************************************************************************************************************/
/* function countTODOTasks() --- /*Contagem de tarefas da COLUNA TODO */
/**************************************************************************************************************************************************************************************/
function countTODOTasks() {
   const taskList = document.getElementById("TODO_COLUMN");
   let nOfTasks = taskList.childElementCount;
   return nOfTasks;
}
/**************************************************************************************************************************************************************************************/
/* function countDOINGTasks() --- /*Contagem de tarefas da COLUNA DOING */
/**************************************************************************************************************************************************************************************/
function countDOINGTasks() {
   const taskList = document.getElementById("DOING_COLUMN");
   let nOfTasks = taskList.childElementCount;
   return nOfTasks;
}
/**************************************************************************************************************************************************************************************/
/* function countDOINGTasks() --- /*Contagem de tarefas da COLUNA DONE */
/**************************************************************************************************************************************************************************************/
function countDONETasks() {
   const taskList = document.getElementById("DONE_COLUMN");
   let nOfTasks = taskList.childElementCount;
   return nOfTasks;
}
/**************************************************************************************************************************************************************************************/
/* function updateTaskCountView() --- calls functions to count tasks for each collumn and places those values in correct place */
/**************************************************************************************************************************************************************************************/
function updateTaskCountView() {
   const todoCount = countTODOTasks();
   const doingCount = countDOINGTasks();
   const doneCount = countDONETasks();
   const totalCount = todoCount + doingCount + doneCount;

   document.getElementById("todo-count").textContent = todoCount;
   document.getElementById("doing-count").textContent = doingCount;
   document.getElementById("done-count").textContent = doneCount;

   updateBarChart(todoCount, doingCount, doneCount, totalCount);
}
/**************************************************************************************************************************************************************************************/
/* function updateBarCharttodo, doing, done, total --- sets the top right element task-bar-char with correct proportions (visually a progress bar) */
/**************************************************************************************************************************************************************************************/
function updateBarChart(todo, doing, done, total) {
   const barChart = document.getElementById("task-bar-chart");
   barChart.innerHTML = ""; // Limpa o conteúdo anterior

   if (total > 0) {
      barChart.appendChild(createBarElement("todo", (todo / total) * 100));
      barChart.appendChild(createBarElement("doing", (doing / total) * 100));
      barChart.appendChild(createBarElement("done", (done / total) * 100));
   }
}
/**************************************************************************************************************************************************************************************/
/* function createBarElement(className, widthPercent) --- creates the progress bar subelement - each subpice used by function updateBarChart
/**************************************************************************************************************************************************************************************/
function createBarElement(className, widthPercent) {
   const bar = document.createElement("div");
   bar.classList.add("task-bar", className);
   bar.id = `${className}-bar`;
   bar.style.width = `${widthPercent}px`;
   bar.style.height = `${20}px`;
   return bar;
}
/**************************************************************************************************************************************************************************************/
/* function Filter --- 
/**************************************************************************************************************************************************************************************/

async function createFilter() {
   try {
      const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/role", {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      })
         .then(function (response) {
            if (response.ok) {
               return response.json();
            } else if (response.status == 403) {
               window.location.href = "index.html";
            } else {
               console.log("Failed to load user role");
               throw new Error("Failed to load user role");
            }
         })
         .then((response) => {
            if (response.role == "productOwner" || response.role == "scrumMaster") {
               createFilterHTML();

               const setPro = document.getElementsByClassName("set-pro");
               for (let i = 0; i < setPro.length; i++) {
                  setPro[i].hidden = false;
               }
            } else if (response.role == "developer") {
               const setPro = document.getElementsByClassName("set-pro");
               for (let i = 0; i < setPro.length; i++) {
                  setPro[i].hidden = true;
               }
            }
         });
   } catch (error) {
      console.error("Failed to load user role");
   }
}

async function createFilterHTML() {
   //Users
   const filterDiv = document.getElementById("filter-dection");
   const userFilter = document.createElement("select");
   userFilter.classList.add("homepage-filters");
   userFilter.id = "user-filter";
   const defaultOptionAllUsers = document.createElement("option");
   defaultOptionAllUsers.value = "default";
   defaultOptionAllUsers.text = "All Users";
   userFilter.appendChild(defaultOptionAllUsers);
   await loadUsers();
   userList.forEach((user) => {
      if (user.username != "deletedTasks") {
         createUsernameFilter(user.username, userFilter);
      }
   });
   filterDiv.appendChild(userFilter);
   document.getElementById("user-filter").value = sessionStorage.getItem("usernameFilter");

   //Category
   const categoryFilter = document.createElement("select");
   categoryFilter.classList.add("homepage-filters");
   categoryFilter.id = "category-filter";
   const defaultOptionCategory = document.createElement("option");
   defaultOptionCategory.value = "default";
   defaultOptionCategory.text = "All Categories";
   categoryFilter.appendChild(defaultOptionCategory);
   await loadCategories();
   categoryList.forEach((category) => {
      tasksByCategory(category.type, categoryFilter);
   });
   filterDiv.appendChild(categoryFilter);
   document.getElementById("category-filter").value = sessionStorage.getItem("categorySelected");

   const filterBtn = document.createElement("button");
   filterBtn.classList.add("btn-filters");
   filterBtn.id = "filter-btn";
   filterBtn.textContent = "Apply Filter";
   filterDiv.appendChild(filterBtn);
   createApplyFilterListener();

   const cleanFilterBtn = document.createElement("button");
   cleanFilterBtn.classList.add("btn-filters");
   cleanFilterBtn.id = "clean-filter-btn";
   cleanFilterBtn.textContent = "Clean Filter";
   filterDiv.appendChild(cleanFilterBtn);
   createCleanFilterListener();
}

function createApplyFilterListener() {
   const applyFilterbtn = document.getElementById("filter-btn");
   applyFilterbtn.addEventListener("click", function () {
      const usernameSelected = document.getElementById("user-filter").value;
      sessionStorage.setItem("usernameFilter", usernameSelected);
      const categorySelected = document.getElementById("category-filter").value;
      sessionStorage.setItem("categorySelected", categorySelected);
      switchLoadByFilters();
   });
}

function createCleanFilterListener() {
   const cleanFilterbtn = document.getElementById("clean-filter-btn");
   cleanFilterbtn.addEventListener("click", function () {
      sessionStorage.setItem("usernameFilter", "default");
      sessionStorage.setItem("categorySelected", "default");
      document.getElementById("user-filter").value = "default";
      document.getElementById("category-filter").value = "default";
      switchLoadByFilters();
   });
}

async function createUsernameFilter(username, userFilter) {
   try {
      const response = await fetch(`http://localhost:8080/tiago-bernardo-proj3/rest/task/tasksnumber/${username}`, {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      });

      if (response.ok) {
         const numberFromServer = await response.json(); // Assume que o backend retorna um array de tarefas
         const number = numberFromServer; // Atualiza a variável tasks com os dados recebidos
         if (number > 0) {
            const newOption = document.createElement("option");
            newOption.value = username;
            newOption.text = username;
            userFilter.appendChild(newOption);
         }
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar tarefas:", error);
   }
}

async function tasksByCategory(categoryType, filter) {
   const response = await fetch(
      `http://localhost:8080/tiago-bernardo-proj3/rest/category/tasksnumber/${categoryType}`,
      {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      }
   );
   if (response.ok) {
      const numberFromServer = await response.json();
      const tasksNumber = numberFromServer;
      if (tasksNumber > 0) {
         const newOption = document.createElement("option");
         newOption.value = categoryType;
         newOption.text = categoryType;
         filter.appendChild(newOption);
      }
   } else {
      console.error("Falha ao carregar Tarefas:", response.statusText);
   }
}

async function loadUsers() {
   const token = sessionStorage.getItem("token");

   // Verificar se o token
   if (!token) {
      console.log("Utilizador não está logado.");
      return; // Ou redirecionar para a página de login
   }

   try {
      const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/all", {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      });

      if (response.ok) {
         const usersFromServer = await response.json(); // Assume que o backend retorna um array de users
         const users = usersFromServer;
         userList = users;
      } else {
         console.error("Falha ao carregar Utilizadores:", response.statusText);
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar Utilizadores:", error);
   }
}

async function loadCategories() {
   try {
      const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/category/all", {
         method: "GET",
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: sessionStorage.getItem("token"),
         },
      });
      if (response.ok) {
         const categoriesFromServer = await response.json();
         const categories = categoriesFromServer;
         categoryList = categories;
      } else if (response.status === 403) {
         window.location.href = "index.html";
      }
   } catch (error) {
      console.error("Erro na rede ao tentar carregar Categorias:", error);
   }
}

/**Search*/ 
document.getElementById('taskSearch').addEventListener('input', function(e) {
   const searchTerm = e.target.value.toLowerCase();
   filterTasksByTitleAndDescription(searchTerm);
});

function filterTasksByTitleAndDescription(searchTerm) {
   const tasks = document.querySelectorAll('.task-item');

   tasks.forEach(task => {
      const title = task.querySelector('h3').textContent.toLowerCase();
      const description = task.querySelector('p').textContent.toLowerCase();
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
         task.style.display = ''; 
      } else {
         task.style.display = 'none'; 
      }
   });
}