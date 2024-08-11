const containerModal = document.getElementById("containerModal"); //fond des 2 modales 
const modal1 = document.getElementById("modal1"); //modale galerie photo ou 1ere modale
const modalClose = document.getElementById("modalClose"); // croix pour fermer la 1ere modale
const modalTitle = document.getElementById("modalTitle"); // titre de la 1ere modale
const modalContent = document.getElementById("modalContent"); // div pour contenir la galerie de la modale
const modalBtn = document.getElementById("modalBtn"); //bouton ajouter une photo de la 1ere modale
const modalArrow = document.getElementById("modalArrowLeft");
const modalAddClose = document.getElementById("modalAddClose");
const previewImg = document.getElementById("containerFileImg");
const inputFile = document.getElementById("file");
const labelFile = document.querySelector("#containerFile label");
const modalAddPhoto = document.getElementById("modalAddPhoto");
const modalAddp = document.getElementById("modalAddp");
const modalForm = document.querySelector("#modalAddWorks Form");

function displayModal() {
    modificationBtn.addEventListener("click", () => {
        console.log("modificationBtn")
        containerModal.style.display = "flex";
    });
    modalClose.addEventListener("click", () => {
        console.log("modalClose")
        containerModal.style.display = "none";
    });

    //si on clique en dehors de la modale, containerModal disparait/se ferme
    containerModal.addEventListener("click", (e) => {
        if (e.target.id === "containerModal") {
            containerModal.style.display = "none";
        }
    });
   
}
displayModal();

function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", 
            "Authorization" : `Bearer ${window.localStorage.getItem("token")}` 
        }

    })
    .then(response => {
        if (response.ok) {
            console.log(`Le projet avec l'id ${projectId} a été supprimé.`);
            // Mettre à jour la liste des projets et rafraîchir la galerie
            works = works.filter(project => project.id !== projectId);
            displayGallery(works, "gallery"); // Recharger la galerie principale
            displayGallery(works, "galleryModal"); // Recharger la galerie dans la modale
        } else {
            console.error("Le delete a échoué");
        }
    })
    .catch(error => console.error("Erreur lors de la suppression:", error));
}

function displayAddModal() {
    modalBtn.addEventListener("click", () => {
        modalAddWorks.style.display = "flex";
        modal1.style.display = "none";
    });
    modalArrow.addEventListener("click", () => {
        modalAddWorks.style.display = "none";
        modal1.style.display = "flex";
    });
    modalAddClose.addEventListener("click", () => {
        containerModal.style.display = "none";
    });
}

displayAddModal();

//Event pour télécharger une image/ajouter un projet dans la modale
inputFile.addEventListener("change", () => {
    const file = inputFile.files[0]; // Récupère le premier fichier sélectionné
    if (file) {
        const reader = new FileReader(); // Crée un nouvel objet FileReader
        reader.onload = function (e) { 
            previewImg.src = e.target.result; // Affiche l'aperçu de l'image
            previewImg.style.display = "flex"; // Affiche l'aperçu de l'image
            labelFile.style.display = "none"; // Cache le label après sélection de l'imag
            modalAddPhoto.style.display = "none"; // Cache l'élément d'ajout de photo
            modalAddp.style.display = "none"; // Cache le mini texte 
        };
        reader.readAsDataURL(file); // Lit le fichier et déclenche l'événement onload
    }
});
function fetchCategories() {
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categories => {
            populateCategorySelect(categories);
        })
        .catch(error => console.error("Erreur lors de la récupération des catégories:", error));
}

function populateCategorySelect(categories) {
    const select = document.getElementById("modalCategory");
    select.innerHTML = ""; // Vide le select avant de le remplir

     // Ajout d'une option vide par défaut
     const defaultOption = document.createElement("option");
     defaultOption.value = "";
     defaultOption.selected = true; // La rendre sélectionnée par défaut
     defaultOption.disabled = true; // Empêcher de la sélectionner après coup
     select.appendChild(defaultOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

//chargement de la modale
fetchCategories();

modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(modalForm);
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { 
            "Authorization" : `Bearer ${window.localStorage.getItem("token")}`
        },
        body: formData
        
    })
    .then(response => response.json())
    .then(data => {
        console.log("Projet ajouté:", data);
        if (data.error){
            console.error("Erreur lors de l'ajout du projet:", data.error);
            alert("Erreur lors de l'ajout du projet.");
        } else {
            displayWorks(works, "gallery");
            displayWorks(works, "galleryModal");
        }
    })
    .catch(error => {
        console.error("Erreur lors de l'ajout du projet:", error);
        alert("Une erreur est survenue lors de l'ajout du projet. Veuillez réessayer.");
    });
});

function verifFormCompleted() {
    const btnValidForm = document.getElementById("modalAddBtn");
    modalForm.addEventListener("input", () => {
        if (modalAddTitle.value !== "" && modalCategory.value !== "" && inputFile.value !== "") {
            btnValidForm.classList.add("valid");
            btnValidForm.disabled = false;
        } else {
            btnValidForm.classList.remove("valid");
            btnValidForm.disabled = true;
        }
    });
}

verifFormCompleted();