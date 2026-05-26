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
            resetFormFields();
            resetFileInput();
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
            displayWorks(works, "gallery"); // Recharger la galerie principale
            displayWorks(works, "galleryModal"); // Recharger la galerie dans la modale
        } else {
            console.error("Le delete a échoué");
        }
    })
    .catch(error => console.error("Erreur lors de la suppression:", error));
}


//gère les boutons de la modale 
function displayAddModal() {
    modalBtn.addEventListener("click", () => {
        modalAddWorks.style.display = "flex";
        modal1.style.display = "none";
    });
    modalArrow.addEventListener("click", () => {
        resetFormFields();
        resetFileInput();
        modalAddWorks.style.display = "none";
        modal1.style.display = "flex";
    });
    modalAddClose.addEventListener("click", () => {
        resetFormFields();
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

//fonction qui fectch les catégories 
function fetchCategories() {
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(data => {
            categories = data;
            populateCategorySelect(categories);
        })
        .catch(error => console.error("Erreur lors de la récupération des catégories:", error));
}

//fonction pour enlever l'aperçu de l'image
function resetFileInput() {
    inputFile.value = ""; // Réinitialise le champ file
    previewImg.src = "";  // Supprime l'aperçu de l'image
    previewImg.style.display = "none"; // Cache l'élément d'aperçu
    labelFile.style.display = "flex"; // Réaffiche le label du fichier
    modalAddPhoto.style.display = "flex"; // Réaffiche l'icône de photo
    modalAddp.style.display = "flex"; // Réaffiche le texte "jpg, png : 4mo max"
}
// Fonction pour réinitialiser les champs du formulaire
function resetFormFields() {
    document.getElementById("title").value = ""; // Réinitialise le titre
    document.getElementById("modalCategory").selectedIndex = 0; // Réinitialise la catégorie à l'option vide
    resetFileInput(); // Réinitialise l'input file et l'aperçu de l'image
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
    const categoryId = formData.get("category"); // Récupérer l'ID de la catégorie
    const categoryName = categories.find(cat => cat.id == categoryId)?.name; // Trouver le nom de la catégorie
    
    console.log(formData);
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
            data.category = { id: categoryId, name: categoryName };
            works.push(data);
            displayWorks(works, "gallery");
            displayWorks(works, "galleryModal");
            resetFileInput();

            // Revenir à la galerie de la modale
            modalAddWorks.style.display = "none"; // Cache le formulaire d'ajout
            modal1.style.display = "flex"; // Affiche la galerie de la modale
        }
    })
    .catch(error => {
        console.error("Erreur lors de l'ajout du projet:", error);
        alert("Une erreur est survenue lors de l'ajout du projet. Veuillez réessayer.");
    });
});

//vérif si tous les champs sont remplis 
function verifFormCompleted() {
    const btnValidForm = document.getElementById("modalAddBtn");
    modalForm.addEventListener("input", () => {
        //si une condition n'est pas vide on passe à la suivante 
        if (title.value !== "" && modalCategory.value !== "" && inputFile.value !== "") {
            btnValidForm.classList.add("valid");
            //si cest  valider on ajoute la class valid donc le bouton vert et on le rend able
            btnValidForm.disabled = false;
        } else {
            //sinon on enleve la class et on disabled donc true 
            btnValidForm.classList.remove("valid");
            btnValidForm.disabled = true;
        }
    });
}

verifFormCompleted();