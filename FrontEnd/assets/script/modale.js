// Sélection des éléments de la modale
const containerModal = document.getElementById("containerModal");
const modalClose = document.getElementById("modalClose");
const galleryModal = document.getElementById("galleryModal");
const modalBtn = document.getElementById("modalBtn");
const modalAddWorks = document.getElementById("modalAddWorks");
const modalArrow = document.getElementById("modalArrowLeft");
const modalAddClose = document.getElementById("modalAddClose");
const previewImg = document.getElementById("containerFileImg");
const inputFile = document.getElementById("file");
const labelFile = document.querySelector("#containerFile label");
const modalAddPhoto = document.getElementById("modalAddPhoto");
const modalAddp = document.getElementById("modalAddp");
const modalForm = document.querySelector("#modalAddWorks Form");

// Gestion de l'affichage de la modale
function displayModal() {
    modificationBtn.addEventListener("click", () => {
        console.log("modificationBtn")
        containerModal.style.display = "flex";
    });
    modalClose.addEventListener("click", () => {
        console.log("modalClose")
        containerModal.style.display = "none";
    });
    containerModal.addEventListener("click", (e) => {
        if (e.target.id === "containerModal") {
            containerModal.style.display = "none";
        }
    });
}

displayModal();

// Gestion de l'affichage de la galerie dans la modale
function displayGalleryModal() {
    if (!galleryModal) return;
    galleryModal.innerHTML = "";

    if (!works || works.length === 0) {
        console.log("Aucun projet à afficher.");
        return;
    }

    works.forEach(project => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trash = document.createElement("i");

        trash.classList.add("fa-solid", "fa-trash-can");
        trash.id = project.id;
        trash.alt = project.title;
        img.src = project.imageUrl;
        span.appendChild(trash);
        figure.appendChild(span);
        figure.appendChild(img);
        galleryModal.appendChild(figure);
    });

    deleteProject(); // Gère les suppressions de projets
}

function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (response.ok) {
            console.log(`Le projet avec l'id ${projectId} a été supprimé.`);
            // Mettre à jour la liste des projets et rafraîchir la galerie
            works = works.filter(project => project.id !== projectId);
            displayGalleryModal(); // Recharger la galerie après suppression
        } else {
            console.error("Le delete a échoué");
        }
    })
    .catch(error => console.error("Erreur lors de la suppression:", error));
}


// Autres fonctions liées à la modale (ajout d'un projet, vérification du formulaire, etc.)

function displayAddModal() {
    modalBtn.addEventListener("click", () => {
        modalAddWorks.style.display = "flex";
        modalGallery.style.display = "none";
    });
    modalArrow.addEventListener("click", () => {
        modalAddWorks.style.display = "none";
        modalGallery.style.display = "flex";
    });
    modalAddClose.addEventListener("click", () => {
        containerModal.style.display = "none";
    });
}

displayAddModal();

//Event pour télécharger une image/ajouter un projet dans la modale
inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "flex";
            labelFile.style.display = "none";
            modalAddPhoto.style.display = "none";
            modalAddp.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});


modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(modalForm);
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayGalleryModal(); // Met à jour la galerie après ajout
        displayWorks();
    });
});

function verifFormCompleted() {
    const btnValidForm = document.getElementById("modalAddBtn");
    modalForm.addEventListener("input", () => {
        if (modalAddTitle.value !== "" && modalAddCategory.value !== "" && inputFile.value !== "") {
            btnValidForm.classList.add("valid");
            btnValidForm.disabled = false;
        } else {
            btnValidForm.classList.remove("valid");
            btnValidForm.disabled = true;
        }
    });
}

verifFormCompleted();
