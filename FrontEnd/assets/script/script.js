
function getWorks(category = "Tous") {
    //requête GET vers l'api pour récup les données des projets
    fetch("http://localhost:5678/api/works")
        //Transforme la réponse en format JSON
        .then(response => response.json())
        //Manipule les données JSON récupérées
        .then(data => {
            //récup de la classe gallery 
            const gallery = document.getElementById("gallery");
            gallery.innerHTML = ""; // vider la galerie à chaque clique sur un bouton 
            
            let filteredData;
            if (category === "Tous"){
                filteredData = data // si la catégorie est tous, on affiche tous les projets
            } else {
                filteredData = data.filter(project => project.category.name === category); // sinon on affiche les projets de la caté qui correspond au bouton cliqué
            }

            //Parcours chaque projet dans les données récup
            filteredData.forEach(project => {
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

            if (category === "Tous") {
                getCategories(data);
            }
        })

        //Capture et affiche toutes les erreurs lors de la récup des données
        .catch(error => console.error("Erreur lors de la récupération des données:", error));
}

function removeDuplicates(data) {
    return [...new Set(data)];    
}

function getCategories(data){
    const filterMenu = document.getElementById("filter-menu"); //pour récup la classe des filtres
   filterMenu.innerHTML = "";

   const categories = removeDuplicates(data.map(project => project.category.name));
   categories.unshift("Tous");

    categories.forEach(category => {
        const button = document.createElement('button'); //création d'un bouton 
        button.textContent = category; //donne le nom de la caté dans le html "tous""objets" etc, ce qui se trouve dans le set
        button.classList.add('filter-btn'); // ajout de la class filter-btn

        button.addEventListener('click', () =>{
            getWorks(category);
            filterActiveButton(button); //change l'aspect du bouton quand on clique dessus 
        });

        filterMenu.appendChild(button); // ajout du bouton à la classe filter-menu
    });

}

// gère l'apparence visu des boutons
function filterActiveButton(activeButton) { 
    console.log("bouton actif:", activeButton.textContent);

    const buttons = document.querySelectorAll('.filter-btn'); // récup de la classe bouton
    buttons.forEach(button => button.classList.remove('active')); // pour retirer la class active au bouton qu'on a cliqué précedemment comme ça on s'assure qu'il n'y en a qu'un en vert 
    activeButton.classList.add('active'); //on ajoute la classe active au bouton filter-btn
}

getWorks()
