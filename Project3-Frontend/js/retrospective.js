/* JavaScript File - all the code in the world  */
/* Switch to strict mode to get more useful errors
 when you make mistakes. */
"use strict";

import * as language from "./language.js";
import * as username from "./username.js";
import * as theme from "./theme.js";
import * as logout from "./logout.js";
import * as photoUser from "./UserPhoto.js";

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
   submitActionListner();
   loadRetrospectives();
});
/**************************************************************************************************************************************************************************************/
/* TASK SUBMISSION LISTENER  - For the ADD RETROSPECTIVE FORM*/
/**************************************************************************************************************************************************************************************/
function submitActionListner() {
   var form = document.getElementById("retrospectiveForm"); // obtem o forumulário de criação de uma task!
   form.addEventListener("submit", function (event) {
      //Adiciona actionListner em caso de submissão
      event.preventDefault(); // previne que o formulário seja enviado da forma default
      var date = document.getElementById("date").value; //obtem o titulo da task
      var presentMembers = document.getElementById("pres-TA-retro").value; //obtem a descrição da task
      var comments = document.getElementById("comment-retro").value; //obtem a descrição da task
      if (date && presentMembers && comments) {
         // se o titulo e a descrição não estiverem vazios
         addRetrospective(date, presentMembers, comments); // adiciona uma task com o titulo e a descrição
         clearRetrospectivesList();
         loadRetrospectives();
      }
   });
}
/**************************************************************************************************************************************************************************************/
/* function addRetrospective(date, presentMembers, comments) - // adiciona uma task com o titulo e a descrição */
/**************************************************************************************************************************************************************************************/
function addRetrospective(date, presentMembers, comments) {
   // adiciona uma task com o titulo e a descrição
   let retrospective = {
      // cria um objeto task
      id: getNextRetrospectiveId(),
      date: date,
      presentMembers: presentMembers,
      comments: comments,
   };
   let retrospectives = JSON.parse(sessionStorage.getItem("retrospectives")) || []; // obtem as tasks do sessionStorage
   retrospectives.push(retrospective); // adiciona a task ao array de tasks
   sessionStorage.setItem("retrospectives", JSON.stringify(retrospectives)); // guarda as tasks no sessionStorage
}
/**************************************************************************************************************************************************************************************/
/* function getNextRetrospectiveId() - gets the place where the next one will be inserted */
/**************************************************************************************************************************************************************************************/
function getNextRetrospectiveId() {
   const retrospectives = JSON.parse(sessionStorage.getItem("retrospectives")) || [];
   const maxId = retrospectives.reduce((max, retrospective) => Math.max(max, retrospective.id || 0), 0);
   return maxId + 1;
}
/**************************************************************************************************************************************************************************************/
/* function loadRetrospectives - LOAD ALL Retrospectives */
/**************************************************************************************************************************************************************************************/
function loadRetrospectives() {
   const retrospectives = JSON.parse(sessionStorage.getItem("retrospectives")) || []; // vai buscar as tarefas gravadas anteriormente
   retrospectives.forEach((retrospective) => {
      addRetrospectiveToList(retrospective); // para cada terefa chama ométodo para a adicionar à lista correta
   });
}
/**************************************************************************************************************************************************************************************/
/* function addTaskToRightList - ADD TASKS TO THE RIGHT LIST */
/**************************************************************************************************************************************************************************************/
function addRetrospectiveToList(retrospective) {
   /* <li> list items */
   const itemList = document.createElement("li");
   itemList.setAttribute("retrospective-id", retrospective.id); // Creates a new <li> element
   itemList.classList.add("retrospective-item");
   const itemDate = document.createElement("h3");
   itemDate.textContent = retrospective.date;
   const presentMembers = document.createElement("p");
   presentMembers.textContent = retrospective.presentMembers;
   const comments = document.createElement("p");
   comments.textContent = retrospective.comments;

   /* Append Title and Description to Task */
   itemList.appendChild(itemDate);
   itemList.appendChild(presentMembers);
   itemList.appendChild(comments);
   console.log("taqui");

   /* Add Task to correct List */
   document.getElementById("historic-retrospectives-list").appendChild(itemList);
}
/**************************************************************************************************************************************************************************************/
/* function clearRetrospectivesList() - clears */
/**************************************************************************************************************************************************************************************/
function clearRetrospectivesList() {
   const list = document.getElementById("historic-retrospectives-list");
   while (list.firstChild) {
      list.removeChild(list.firstChild);
   }
}
/**************************************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************************************/
