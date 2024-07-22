const loginForm = document.getElementById("loginForm"); //récupération du formulaire de connexion


loginForm.addEventListener("submit", (e) => { //écoute l'event submit (quand l'utilisateur submit le formulaire)
    e.preventDefault(); // pour ne pas recharger la page

    //objet avec les données du formulaire
    const loginData ={
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    };

//requête http post
fetch("http://localhost:5678/api/users/login", {
    method: "POST", //envoyer les données
    headers: { "Content-Type" : "application/json" }, //les données sont envoyées en JSON
    body: JSON.stringify(loginData), // convertit loginData en chaine JSON
})
.then(response => response.json()) //convertit la réponse en JSON
.then(data => {
    const messageError = document.getElementById("message"); //récup l'element msg 

    if (data.token) { // vérifie si le serveur a retourné un token, ce qui signifie une connexion réussie
        messageError.textContent = "Connexion réussie!"; // msg de succès
        window.location.replace("index.html"); // redirection de l'utilisateur vers la page d'accueil
    } else {
        messageError.textContent = "Erreur : " + data.message; // si aucun token n'est retourné, on affiche le msg d'erreur retourné par le serveur
    }
})
//capture et affiche les erreurs éventuelles de la requête
.catch(error => {
    console.error("Erreur:", error); //affiche l'erreur dans la console
    messageError.textContent = "Erreur de connexion. Veuillez réessayer."; //msg d'erreur pour l'utilisateur 
});

})
