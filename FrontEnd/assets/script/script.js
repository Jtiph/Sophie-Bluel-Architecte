
let works; //variable globale pour stocker les projets
const loginButton = document.getElementById("loginBtn"); // Bouton de connexion
const logoutBtn = document.getElementById("logoutBtn"); // Bouton de connexion
const modificationBtn = document.getElementById("modificationBtn"); // Bouton modifier
const editBar = document.getElementById('editBar'); // Récupération de la barre

//Fonction pour mettre à jour l'interface utilisateur en fonction du token
function updateUI() {
    const token = window.localStorage.getItem("token");
    if (token) {
        //Si un token est présent,  cacher login, afficher logout
        loginButton.style.display = "none";
        logoutBtn.style.display = "block";
        modificationBtn.style.display = "block"; //affiche le btn de modif si co
        editBar.style.display = 'block'; // Affiche la barre d'édition
    } else {
        //Si aucun token n'est présent, afficher le bouton login, cacher le logout
        loginButton.style.display = "block";
        logoutBtn.style.display = "none";
        modificationBtn.style.display = "none"; //cache le btn de modif si non co
        editBar.style.display = 'none'; // Cache la barre d'édition
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
            return data;
        })

        //Capture et affiche toutes les erreurs lors de la récup des données
        .catch(error => console.error("Erreur lors de la récupération des données:", error));

}

function displayWorks(projects) {
    //récup de la classe gallery 
    const gallery = document.getElementById("gallery");
    const galleryModal = document.getElementById("galleryModal")

    gallery.innerHTML = ""; // vider la galerie à chaque clique sur un bouton 
    galleryModal.innerHTML = ""; // vider la galerie à chaque clique sur un bouton 

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
        figcaption.textContent = project.title + " - " + project.category.name; //titre du projet 

        //Ajoute l'élement img à l'intérieur de figure 
        figure.appendChild(img);
        //Same pour figcaption
        figure.appendChild(figcaption);

        //Ajout de figure dans la galerie
        gallery.appendChild(figure);

        // Clonage de l'élément figure pour l'ajouter à la galerie de la modale
        const figureClone = figure.cloneNode(true);

        // ajout de l'icone de suppresion 
        const trash = document.createElement("i");
        trash.classList.add("fa-solid", "fa-trash-can");
        trash.id = `delete-icon-${project.id}`; // assure que chaque icone de suppression a un identifiant unique

        // Ajouter l'icône de suppression au clone
        figureClone.appendChild(trash);

        // Ajouter un événement de suppression au clone dans la modale
        trash.addEventListener("click", () => {
            deleteProject(project.id);
        });

        // Ajout du clone dans la galerie de la modale
        galleryModal.appendChild(figureClone);
    });
}

//Foncion pour filtrer les projets par catégorie
function filterProjects(category) {
    let filteredProjects;
    if (category === "Tous") {
        filteredProjects = works // si la catégorie est tous, on affiche tous les projets
    } else {
        const categoryId = categories.find(cat => cat.name === category)?.id;
        
        // Filtrer les projets par `categoryId`
        filteredProjects = works.filter(project => project.category.id == categoryId);
    }
    displayWorks(filteredProjects);
}

//Fonction pour supprimer les doublons des catégories 
function removeDuplicates(data) {
    return [...new Set(data)];
}


function getCategories(data) {
    const categories = removeDuplicates(data.map(project => project.category.name));
    categories.unshift("Tous");
    createFilterButtons(categories);
}

function createFilterButtons(categories) {
    const filterMenu = document.getElementById("filter-menu");

    categories.forEach(category => {
        const button = document.createElement('button'); //création d'un bouton 
        button.textContent = category; //donne le nom de la caté dans le html "tous""objets" etc, ce qui se trouve dans le set
        button.classList.add('filter-btn'); // ajout de la class filter-btn

        button.addEventListener('click', () => {
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

}

getWorks();
