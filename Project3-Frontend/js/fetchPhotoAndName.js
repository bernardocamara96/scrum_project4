export async function fetchPhotoNameAndRedirect(username, password) {
   await fetch("http://localhost:8080/tiago-bernardo-proj3/rest/user/getphotoandname", {
      method: "GET",
      headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         token: sessionStorage.getItem("token"),
      },
      credentials: "include",
   })
      .then((response) => response.json())
      .then(function (data) {
         console.log(data);
         sessionStorage.setItem("photoUrl", data.photoUrl);
         sessionStorage.setItem("name", data.name);
         sessionStorage.setItem("role", data.role);
      });
   window.location.href = "homepage.html";
}
