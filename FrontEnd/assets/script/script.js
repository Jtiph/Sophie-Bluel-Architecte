//requête GET vers l'api pour récup les données des projets
fetch("http://localhost:5678/api/works")
    //Transforme la réponse en format JSON
    .then(response => response.json())
    //Manipule les données JSON récupérées
    .then(data =>{
        //récup de la classe gallery 
        const gallery = document.querySelector(".gallery");

        //Parcourt chaque projet dans les données récup
        data.forEach(project => {
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
    })

    //Capture et affiche toutes les erreurs lors de la récup des données
    .catch(error => console.error("Erreur lors de la récupération des données:", error));


