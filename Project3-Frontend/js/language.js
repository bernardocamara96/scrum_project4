/**************************************************************************************************************************************************************************************/
/* listenerLanguageBtns() -   */
/**************************************************************************************************************************************************************************************/
export function listenerLanguageBtns() {
   const langPT = document.getElementById("langIndexPT");
   const langEN = document.getElementById("langIndexEN");

   if (langPT) {
      langPT.addEventListener("click", () => changeLanguage("pt"));
   }
   if (langEN) {
      langEN.addEventListener("click", () => changeLanguage("en"));
   }
   checkLanguage(); // checks the language setting - needs to be inside a DOMcl to trigger when loaded
   activeLangFlag(); // sets the flag element to active so it can have corresponding CSS applied
   underlineLangFlag();
}
/**************************************************************************************************************************************************************************************/
/* activeLangFlag() = Toggle of active under the FlagElement */
/**************************************************************************************************************************************************************************************/
export function activeLangFlag() {
   if (sessionStorage.getItem("language") === "en") {
      document.getElementById("langIndexEN").classList.add("active");
      document.getElementById("langIndexPT").classList.remove("active");
   }
   if (sessionStorage.getItem("language") === "pt") {
      document.getElementById("langIndexPT").classList.add("active");
      document.getElementById("langIndexEN").classList.remove("active");
   }
}
/**************************************************************************************************************************************************************************************/
/* DEFAULT LANGUAGE = ENGLISH */
/**************************************************************************************************************************************************************************************/
export function checkLanguage() {
   if (sessionStorage.getItem("language") === null) {
      // if it doesn't exist
      let lang = "en"; // set it to English
      sessionStorage.setItem("language", lang); // save it
      console.log("Default language was null. Default language is now set to: " + lang);
   } else {
      // otherwise...
      changeLanguage(sessionStorage.getItem("language")); // call function to changeLanguage (and all the elements which of change)
      console.log("Default language was previously set to: " + sessionStorage.getItem("language") + ".");
   }
}
/**************************************************************************************************************************************************************************************/
/* underlineLangFlag() = Toggle of underline under the FlagElement */
/**************************************************************************************************************************************************************************************/
export function underlineLangFlag() {
   //
   if (sessionStorage.getItem("language") === "en") {
      document.getElementById("langIndexEN").classList.add("underline");
      document.getElementById("langIndexPT").classList.remove("underline");
   }
   if (sessionStorage.getItem("language") === "pt") {
      document.getElementById("langIndexPT").classList.add("underline");
      document.getElementById("langIndexEN").classList.remove("underline");
   }
}
/**************************************************************************************************************************************************************************************/
/* changeLanguage(lang) = Toggle of underline under the FlagElement */
/**************************************************************************************************************************************************************************************/
export function changeLanguage(lang) {
   if (lang) {
      // set no local storage.............. gravar lá
      sessionStorage.setItem("language", lang); // saves data into sessionStorage
   }

   for (let key in languageContent[lang]) {
      //console.log(" key: "+key);
      if (document.getElementById(key) === null) {
         continue;
      } else if (isTextAreaElement(key)) {
         // for textArea in retrospective and input fields in login/settings, etc
         document.getElementById(key).placeholder = languageContent[lang][key];
         document.getElementById(key).textContent = "";
      } else if (isInputAndDotValue(key)) {
         if (isInputButton(key)) {
            // inputs buttons
            document.getElementById(key).value = languageContent[lang][key];
         } else {
            // inputs other fields
            document.getElementById(key).placeholder = languageContent[lang][key];
            document.getElementById(key).textContent = "";
         }
      } else {
         document.getElementById(key).innerHTML = languageContent[lang][key];
      }
   }
   activeLangFlag();
}
/**************************************************************************************************************************************************************************************/
/* function isTextAreaElement(key) - specific case
/**************************************************************************************************************************************************************************************/
export function isTextAreaElement(key) {
   if (document.getElementById(key).tagName.toLowerCase() === "textarea") return true;
   return false;
}
/**************************************************************************************************************************************************************************************/
/* function isInputButton(key) - true/false verification here: specific case buttons, listed here
/**************************************************************************************************************************************************************************************/
export function isInputButton(key) {
   // buttons
   if (key === "login" || key === "input-save-retro" || key === "deleteBtn" || key === "save-task") return true;
   return false;
}
/**************************************************************************************************************************************************************************************/
/* function isInputAndDotValue(key) - very specific case for input element in edittask.html
/**************************************************************************************************************************************************************************************/
export function isInputAndDotValue(key) {
   if (document.getElementById(key).tagName.toLowerCase() === "input" && document.getElementById(key).value !== null)
      return true;
   return false;
}
/**************************************************************************************************************************************************************************************/
/* LANGUAGE SETTINGS */
/* Content switching according to */
/**************************************************************************************************************************************************************************************/
export let languageContent = {
   en: {
      // index.html
      "member-login-banner": "Member Login",
      "username-label": "Username",
      username: "Enter your username",
      "password-label": "Password",
      password: "Enter your password",
      login: "Login",
      contact: "Contact information's:",
      infosContact: "You can reach us at our headquarters during workdays from 09:30 to 17:30",
      adressTitle: "Address",
      phoneNumberTitle: "Phone Number:",
      "text-about1":
         "AntNest is the driving force behind agile transformation in your team. Our software solutions are designed to optimize workflow processes, championing Agile and Scrum methodologies. With an intuitive interface and collaborative tools, we facilitate project management, enabling teams of any size to achieve their goals with greater efficiency and effectiveness. At the heart of AntNest lies a commitment to continuous innovation and supporting teams on their journey towards operational excellence. Join us on the path to transforming the way work is done, making each project an opportunity to learn, grow, and succeed together.",
      // pretty much "all"
      "nav-home": "Homepage",
      "nav-retro": "Retrospective",
      "nav-sett": "Settings",
      "nav-copy": "Copyright",
      "nav-exit": "Logout",
      theme: "Theme",
      // settings.html
      "dark-theme": "Dark",
      "light-theme": "Light",
      langEN: "English",
      langPT: "Portuguese",
      "delete-text": "Account Deletion",
      "message-request": "Please enter password to confirm deletion:",
      passwordInput: "Password",
      deleteBtn: "Delete",

      // edittask.html
      "task-viewer": "Task Viewer",

      "add-task": "Add Task",
      "label-title": "Title",
      "label-description": "Description",
      "save-task": "Save Task",
      "cancel-edit": "Back",
      // retrospective.html
      "hist-retro": "Historic Retrospectives",
      "add-retro": "Add Retrospective",
      "label-date-retro": "Date",
      "label-pres-retro": "Present Members",
      "pres-TA-retro": "Insert present members",
      "label-comment-retro": "Comments",
      "comment-retro": "Insert positive aspects, chalanges and suggestions for improvement",
      "input-save-retro": "Save Retrospective",
      // homepage.html
      "create-project": "Create Project",
      "select-project": "Select Project",
      "manage-backlog": "Backlog Manager",
      "select-sprint": "Sprint Selector",
      "project-settings": "Project Settings",
      "col-todo-text": "TO DO",
      "add-task-btn": "Add Task",
      "col-doing-text": "DOING",
      "col-done-text": "DONE",
      "project-name": "Project: Name",
      "sprint-name": "Sprint: Name",
      "sprint-progress": "Progress:",
   },
   pt: {
      // index.html
      "member-login-banner": "Acesso de membro",
      "username-label": "Nome de utilizador",
      username: "Insira o nome de utilizador",
      "password-label": "Palavra-passe",
      password: "Insira a palavra-passe",
      login: "Entrar",
      contact: "Informações de contacto:",
      infosContact: "Pode contactar-nos na nossa sede durante os dias úteis das 09:30 às 17:30",
      adressTitle: "Morada",
      phoneNumberTitle: "Número de telefone:",
      "text-about1":
         "A AntNest é a força motriz por detrás da transformação ágil na sua equipa. As nossas soluções de software são desenhadas para otimizar os processos de trabalho, fomentando as metodologias Agile e Scrum. Com uma interface intuitiva e ferramentas colaborativas, facilitamos a gestão de projetos, permitindo que equipas de qualquer dimensão alcancem os seus objetivos com maior eficiência e eficácia. No coração da AntNest, está o compromisso com a inovação contínua e o apoio à evolução das equipas rumo à excelência operacional. Junte-se a nós na jornada para transformar a forma como o trabalho é realizado, tornando cada projeto uma oportunidade para aprender, crescer e ter sucesso em conjunto.",
      // pretty much "all"
      "nav-home": "Início",
      "nav-retro": "Retrospetiva",
      "nav-sett": "Definições",
      "nav-copy": "Direitos de autor",
      "nav-exit": "Sair",
      theme: "Tema",
      //settings.html
      "dark-theme": "Escuro",
      "light-theme": "Claro",
      lang: "Língua",
      langEN: "Inglês",
      langPT: "Português",
      "delete-text": "Eliminar a conta",
      "message-request": "Por favor, introduza a palavra-passe para confirmar a eliminação:",
      passwordInput: "Palavra-passe",
      deleteBtn: "Eliminar",
      // edittask.html
      "task-viewer": "Visualizador de Tarefas",

      "add-task": "Adicionar Tarefa",
      "label-title": "Título",
      "label-description": "Descrição",
      "save-task": "Salvar Tarefa",
      "cancel-edit": "Retroceder",
      // retrospective.html
      "hist-retro": "Retrospectivas históricas",
      "add-retro": "Adicionar Retrospetiva",
      "label-date-retro": "Data",
      "label-pres-retro": "Membros presentes",
      "pres-TA-retro": "Inserir membros presentes",
      "label-comment-retro": "Comentários",
      "comment-retro": "Inserir aspectos positivos, alterações e sugestões de melhoria",
      "input-save-retro": "Guardar Retrospetiva",
      // homepage.html
      "create-project": "Criar projeto",
      "select-project": "Selecionar projeto",
      "manage-backlog": "Gestor de tarefas pendentes",
      "select-sprint": "Seletor de Sprint",
      "project-settings": "Definições do projeto",
      "col-todo-text": "PARA FAZER",
      "add-task-btn": "Adicionar tarefa",
      "col-doing-text": "EM CURSO",
      "col-done-text": "FEITO",
      "project-name": "Projeto: Nome",
      "sprint-name": "Sprint: Nome",
      "sprint-progress": "Progresso:",
   },
};
