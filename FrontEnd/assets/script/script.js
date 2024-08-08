
let works; //variable globale pour stocker les projets
const loginButton = document.getElementById("loginBtn"); // Bouton de connexion
const logoutBtn = document.getElementById("logoutBtn"); // Bouton de déconnexion
const modificationBtn = document.getElementById("modificationBtn"); // Bouton modifier
const containerModal = document.getElementById("containerModal"); //boite de la modale
const modalClose = document.getElementById("modalClose"); //bouton pour fermer la modale 
const galleryModal = document.getElementById("galleryModal"); 
const modalBtn = document.getElementById("modalBtn");
const modalGallery = document.getElementById("modalGallery")
const modalAddWorks = document.getElementById("modalAddWorks");
const modalArrow = document.getElementById("modalArrowLeft");
const modalAddClose = document.getElementById("modalAddClose");
const previewImg = document.getElementById("containerFileImg")
const inputFile = document.getElementById("file");
const labelFile = document.querySelector("#containerFile label");
const modalAddPhoto = document.getElementById("modalAddPhoto");
const modalAddp = document.getElementById("modalAddp");
const modalForm = document.querySelector("#modalAddWorks Form");
const modalAddTitle = document.getElementById("modalAddTitle");
const modalAddCategory = document.getElementById("category");



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
            return data;
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

function displayGalleryModal(){
    if(!galleryModal) return;
    galleryModal.innerHTML = ""

    if (!works || works.length === 0) {
        console.log("Aucun projet à afficher.");
        return;
    }

    works.forEach(project => {
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        const span = document.createElement("span")
        const trash = document.createElement("i")

        trash.classList.add("fa-solid","fa-trash-can")
        trash.id = project.id
        trash.alt = project.title
        img.src = project.imageUrl
        span.appendChild(trash)
        figure.appendChild(span)
        figure.appendChild(img)
        galleryModal.appendChild(figure)
    });
    deleteProject(); // Gère les suppressions de projets
}

// Fonction pour gérer les suppressions de projets
function deleteProject() {
    const trashAll = document.querySelectorAll(".fa-trash-can");

    trashAll.forEach(trash => {
        trash.addEventListener("click", () => {
            const id = trash.id;
            fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })

                .then(response => {
                    if (response.ok) {
                        console.log("Le delete a réussi");
                        return getWorks(); // Recharge les projets après la suppression
                    } else {
                        console.error("Le delete a échoué");
                    }
                })
                .then(() => {
                    displayGalleryModal(); // Met à jour la modale après re-fetch
                })
                .catch(error => console.error("Erreur lors de la suppression:", error));
        });
    });
}

function displayAddModal (){
    modalBtn.addEventListener("click",()=>{
        modalAddWorks.style.display = "flex";
        modalGallery.style.display = "none";
    })
    modalArrow.addEventListener("click",()=>{
        modalAddWorks.style.display = "none";
        modalGallery.style.display = "flex";
    })
    modalAddClose.addEventListener("click",()=>{
        containerModal.style.display = "none";
    })
    
}

displayAddModal();

inputFile.addEventListener("change",()=>{
    const file = inputFile.files[0];
    console.log(file);
    if (file){
        const reader = new FileReader();
        reader.onload = function (e){
           previewImg.src = e.target.result; 
           previewImg.style.display = "flex";
           labelFile.style.display = "none";
           modalAddPhoto.style.display = "none";
           modalAddp.style.display = "none";
        }
        reader.readAsDataURL(file);
    }
})

function displayCategoryModal(){
    const select = document.getElementById("modalCategory");
    const categories = getCategories();
    categories.forEach(category =>{
        const option = document.createElement("option")
        option.value = category.id 
        option.textContent = category.name 
        select.appendChild(option);    
    })
}
displayCategoryModal();

modalForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const formData =  new FormData(modalForm);
    fetch("http://localhost:5678/api/works",{
        method : "POST",
        body:formData
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        console.log('voici la photo ajouté',data)
        displayGalleryModal()
        displayWorks()
    })
})

