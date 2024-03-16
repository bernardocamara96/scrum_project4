export function clickOnLogout() {
   const logoutbtn = document.getElementById("nav-exit");
   logoutbtn.addEventListener("click", function (event) {
      const confirmLogout = confirm("Are you sure you want to Logout?");
      if (confirmLogout) {
         const username = sessionStorage.getItem("username");
         logoutFetch();
         logout();
      }
   });
}

function logout() {
   alert("Sucessfull Logout");
   console.log("Logout");
   sessionStorage.clear();
   window.location.href = "index.html";
}

async function logoutFetch() {
   const response = await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/logout", {
      method: "POST",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
   });
}
