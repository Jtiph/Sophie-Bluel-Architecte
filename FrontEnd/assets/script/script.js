
let works; //variable globale pour stocker les projets
const loginButton = document.getElementById("loginBtn"); // Bouton de connexion
const logoutBtn = document.getElementById("logoutBtn"); // Bouton de déconnexion
const modificationBtn = document.getElementById("modificationBtn"); // Bouton modifier
const containerModal = document.getElementById("containerModal"); //boite de la modale
const modalClose = document.getElementById("modalClose");

//Fonction pour mettre à jour l'interface utilisateur en fonction du token
function updateUI() {
    const token = window.localStorage.getItem("token");
    if (token) {
        //Si un token est présent,  cacher login, afficher logout
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
        modificationBtn.style.display = "block"; //affiche le btn de modif si co
    } else {
        //Si aucun token n'est présent, afficher le bouton login, cacher le logout
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
        modificationBtn.style.display = "none"; //cache le btn de modif si non co
    }
}

updateUI();

//fonction pour gérer la déco
function handleLogout() {
    window.localStorage.removeItem("token"); //supprime le token de localStorage
    updateUI(); //met à jour l'interface utilisateur
}

//event de clic sur le bouton de déco
logoutBtn.addEventListener("click", handleLogout); 


function getWorks(category = "Tous") {
    //requête GET vers l'api pour récup les données des projets
    fetch("http://localhost:5678/api/works")
        //Transforme la réponse en format JSON
        .then(response => response.json())
        //Manipule les données JSON récupérées
        .then(data => {
            works = data
            displayWorks(works);
            getCategories(works);
        })

     //Capture et affiche toutes les erreurs lors de la récup des données
     .catch(error => console.error("Erreur lors de la récupération des données:", error));
}

function displayWorks(projects){
      //récup de la classe gallery 
      const gallery = document.getElementById("gallery");
      gallery.innerHTML = ""; // vider la galerie à chaque clique sur un bouton 


            //Parcours chaque projet dans les données récup
            projects.forEach(project => {
                //Création de l'élément figure pour chaque projet
                const figure = document.createElement("figure");

                //Création de l'élement img et affichage
                const img = document.createElement("img");
                img.src = project.imageUrl; //Url de l'image
                img.alt = project.title; //texte alt de l'image

                //Création de l'élement figcaption pour afficher les descriptions sous les projets
                const figcaption = document.createElement("figcaption");
                figcaption.textContent = project.title; //titre du projet 

                //Ajoute l'élement img à l'intérieur de figure 
                figure.appendChild(img);
                //Same pour figcaption
                figure.appendChild(figcaption);

                //Ajout de figure dans la galerie
                gallery.appendChild(figure);

            });

}

//Foncion pour filtrer les projets par catégorie
function filterProjects(category){
    let filteredProjects;
    if (category === "Tous"){
        filteredProjects = works // si la catégorie est tous, on affiche tous les projets
    } else {
        filteredProjects = works.filter(project => project.category.name === category); // sinon on affiche les projets de la caté qui correspond au bouton cliqué
    }
    displayWorks(filteredProjects);
}

//Fonction pour supprimer les doublons des catégories 
function removeDuplicates(data) {
    return [...new Set(data)];    
}


function getCategories(data){
   const categories = removeDuplicates(data.map(project => project.category.name));
   categories.unshift("Tous");
   createFilterButtons(categories);
}

function createFilterButtons(categories){
    const filterMenu = document.getElementById("filter-menu");

    categories.forEach(category => {
        const button = document.createElement('button'); //création d'un bouton 
        button.textContent = category; //donne le nom de la caté dans le html "tous""objets" etc, ce qui se trouve dans le set
        button.classList.add('filter-btn'); // ajout de la class filter-btn

        button.addEventListener('click', () =>{
            filterByCategory(button); //change l'aspect du bouton quand on clique dessus 
            filterProjects(category);
        });

        filterMenu.appendChild(button); // ajout du bouton à la classe filter-menu
    });
}

  
// gère l'apparence visu des boutons
function filterByCategory(activeButton) { 
    console.log("bouton actif:", activeButton.textContent);

    const buttons = document.querySelectorAll('.filter-btn'); // récup de la classe bouton
    buttons.forEach(button => button.classList.remove('current-btn')); // pour retirer la class active au bouton qu'on a cliqué précedemment comme ça on s'assure qu'il n'y en a qu'un en vert 
    activeButton.classList.add('current-btn'); //on ajoute la classe active au bouton filter-btn

    console.log("bouton actif 2", activeButton.textContent);
}

getWorks();

//gestion de l'affichage de la modale 
function displayModal(){
    //ouverture de la modale au clique sur modifier
    modificationBtn.addEventListener("click", ()=>{
        console.log("modificationBtn")
        containerModal.style.display ="flex";
    });
    //fermeture au clique sur la croix 
    modalClose.addEventListener("click", ()=>{
        console.log("modalClose")
        containerModal.style.display ="none";
    });
    //fermeture au clique en dehors/autour de la modale
    containerModal.addEventListener("click", (e)=>{
        if (e.target.id == "containerModal") {
            containerModal.style.display ="none";
            }
    });
}
displayModal();






