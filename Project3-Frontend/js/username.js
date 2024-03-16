/**************************************************************************************************************************************************************************************/
/* SET USERNAME INTO HEADER  */
/**************************************************************************************************************************************************************************************/
/**
 * Sets the username display based on the stored username in local storage.
 * If a username is stored, it will be displayed. Otherwise, a default name will be displayed.
 */
export function setUsername() {
   let storedUsername = sessionStorage.getItem("name");
   if (storedUsername) {
      document.getElementById("usernameDisplay").textContent = storedUsername;
   } else {
      // default (should never ever happen)
      document.getElementById("usernameDisplay").textContent = "Name";
   }
}

/*
Requires: on .html -> both need to be type="module"
<script defer src="homepage.js" type="module"></script>
<script defer src="username.js" type="module"></script>

Requires on *main*.js
import { setUsername } from "./username.js";
...
setUsername();


*/
