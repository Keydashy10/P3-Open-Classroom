function init() {
  const token = localStorage.getItem("token");
  if (token) {
    const body = document.querySelector("body");
    body.insertAdjacentHTML(
      "afterbegin",
      `<div class="mode-edition">
            <i class="fa-regular fa-pen-to-square"></i>Mode édition
         </div>`
    );

    const modify = document.querySelector("#portfolio h2");
    modify.insertAdjacentHTML(
      "beforeend",
      `<a  href="#" class="modif">
        <i class="fa-regular fa-pen-to-square"></i> modifier
         </a>
        `
    );

    const modif = document.querySelector(".modif");
    const modale = document.getElementById("modale");
    const close1st = document.getElementById("close");
    const addPhoto = document.querySelector(".add-photo");
    const addPhotos = document.getElementById("add-photos");
    const returnHomeModale = document.querySelector("#add-photos i");
    const close2nd = document.getElementById("close2nd");

    modif.addEventListener("click", (e) => {
      e.preventDefault();
      // On fait un Appel API pour peupler la modale (#modale)
      getWorks(document.getElementById("contenu-modale"), false, true);
      // Avec le résultat de l'appel API tu ajoutes les travaux à la modale
      // On affiche la modale
      modale.showModal();
    });

    addPhoto.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(e);
      modale.close();
      addPhotos.showModal();
    });

    returnHomeModale.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(e);
      modale.showModal();
    });
    close1st.addEventListener("click", (e) => {
      e.preventDefault();
      modale.close();
    });
    close2nd.addEventListener("click", (e) => {
      e.preventDefault();
      addPhotos.close();
    });

    // Faire en sorte que si la modale est ouverte, sur l'appuie sur la touche "esc", la modale se ferme

    document.querySelector("header").classList.add("header-connect");
    const tous = document.querySelector(".filters button");
    // On supprime le bouton "tous"
    tous.remove();
    // on remplace le text "login" par "logout"
    document.getElementById("login").innerHTML = "logout";

    const deco = document.getElementById("login");
    deco.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      document.location.reload();
    });
  }
  if (!token) {
    getCategories();
  }
  getWorks(document.querySelector(".gallery"));
}
getCategoriesModale();
init();

// Faire appel à mon backend pour récupérer les catégories
async function getCategories() {
  // Faire appel à mon backend, sur la bonne URL
  const endpoint = "http://localhost:5678/api/categories";

  const req = await fetch(endpoint);
  const data = await req.json();

  // Injecter les données sur le front
  // Sélectionner la balise HTML ou on va injecter les données
  const filters = document.querySelector(".filters");

  // Parcours chaque élement et ajoute à filters
  data.forEach((element) => {
    const button = `<button data-category="${element.id}">${element.name}</button>`;
    filters.insertAdjacentHTML("beforeend", button);
  });

  // Sélectionner les boutons et ajouter un écouteur d'évènement
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const categoryId = e.target.dataset.category;
      // Sélectionner toutes les figures
      const figures = document.querySelectorAll(".gallery figure");
      // Masquer toutes les figures
      figures.forEach((figure) => {
        if (figure.dataset.category == categoryId) {
          figure.style.display = "block";
        } else {
          figure.style.display = "none";
        }

        // Si l'utilisateur à cliqué sur "tous" (catégory 0)
        if(categoryId == 0){
          figure.style.display = "block"
        }

      });
    });
  });
}

// Fonction qui permet de récupérer les travaux et les afficher
async function getWorks(element, showCaption = true, showTrash = false) {
  // Faire appel au backend, sur la bonne URL
  const endpoint = "http://localhost:5678/api/works";

  const req = await fetch(endpoint);
  const datas = await req.json();

  // const gallery = document.querySelector('.gallery')
  // On parcours les données une a une pour les afficher dans la page
  showFigure(element, datas, showCaption, showTrash);
}

function showFigure(element, datas, showCaption = true, showTrash = false) {
  element.innerHTML = "";

  datas.forEach((data) => {
    var caption = ``;

    if (showCaption) caption = `<figcaption>${data.title}</figcaption>`;

    const trash = showTrash
      ? `<span class="trash-bg"><img src="./assets/icons/trash-can-solid.svg" class="trash" data-id="${data.id}" alt="Supprimer" /></span>`
      : "";

    const figure = `<figure delete-id="${data.id}" data-category="${data.categoryId}">
        ${trash}
        <img src="${data.imageUrl}" alt="${data.title}" class="img-trash" />
        ${caption}
        </figure>`;

    element.insertAdjacentHTML("beforeend", figure);
  });

  // Si l'icone de suppression est présente, on y ajoute l'eventlistener pour la suppression
  if (showTrash) {
    const trashes = document.querySelectorAll(".trash");

    trashes.forEach((trash) => {
      trash.addEventListener("click", (e) => {
        // On lance la fonction de suppression en envoyant l'id
        deleteWork(e.target.dataset.id);
      });
    });
  }
}

async function deleteWork(id) {
  // Faire appel au backend, sur la bonne URL
  const endpoint = "http://localhost:5678/api/works/" + id;
  const token = localStorage.getItem("token");

  //  Ajouter le token pour pouvoir faire la suppression (headers, authorization bearer fetch)
  const req = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // On sélectionne tous les éléments avec le delete-id  == id
  const elements = document.querySelectorAll(`[delete-id="${id}"]`);
  // On fait une boucle pour supprimer tous les éléments
  elements.forEach((el) => {
    el.remove();
  });
}
// fonction catégories
async function getCategoriesModale() {
  const endpoint = "http://localhost:5678/api/categories";

  const req = await fetch(endpoint);
  const data = await req.json();

  // Injecter les données sur le front
  // Sélectionner la balise HTML ou on va injecter les données
  const categories = document.querySelector("#category");

  // Parcours chaque élement et ajoute à filters
  data.forEach((element) => {
    const option = `<option value="${element.id}">${element.name}</option>`;
    categories.insertAdjacentHTML("beforeend", option);
  });

  // Preview de l'image à télécharger
  const fileElement = document.querySelector("#new-image");
  const previewElement = document.querySelector("#preview");
  const previewBox = document.querySelector(".preview-box");

  // On ajoute l'écouteur d'évènement au changement d'image
  fileElement.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    previewBox.style.display = "flex";
    previewElement.src = url;

    // On hide les 3 elements
    document.querySelector(".add-button").classList.add("hide");
    document.querySelector(".imgsvg").classList.add("hide");
    document.querySelector(".image-fieldset__span").classList.add("hide");
  });
}

// Ecouteur d'évènement qui capture le clique sur le bouton "Ajouter photo"
const addButton = document.querySelector(".add-button");

addButton.addEventListener("click", (e) => {
  e.preventDefault();

  // On sélectionne l'input file et on simule un clic
  document.querySelector("#new-image").click();
});

// On lance la fonction addWork au click sur le bouton .submitButton
const submitButton = document.querySelector(".submitButton");
submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  // On vérifie si tous les champs sont remplis
  const isEverythingOk = verifierFormulaire()

  if(isEverythingOk){
    addWork();
  }

});

// Fonction addWork
async function addWork() {
  //fonction qui permet de verifier un formulaire.
verifierFormulaire()
  // Si tout est bon > On fait le fetch
  const formAddPhoto = document.querySelector('#formAddPhoto')
  const formData = new FormData(formAddPhoto);
  // On supprime les données originales de l'image
  formData.delete('image')

  const imageInput = document.querySelector('#new-image')
  formData.append('image', imageInput.files[0])


  const fetcher = await fetch(`http://localhost:5678/api/works`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: formData,
  });
  // Si tout est Ok :
    // Mettre à jour la gallery en faisant un append
    
    const data = await fetcher.json();
    const sectionGallery = document.querySelector('.gallery');
    function createProject(data) {
        const projectElement = `
                <figure delete-id="${data.id}" data-category="${data.categoryId}">
                    <img src="${data.imageUrl}" alt="${data.title}">
                    <figcaption>
                    ${data.title}
                    </figcaption>
                </figure>
            `  
        sectionGallery.insertAdjacentHTML('beforeend',projectElement)      
    
    }
      createProject(data)    
    // Quand tu ajoutes une images, tu vas avoir un retour avec l'id de l'image et les données, il faut les récupérer et faire un append

    // Effacer les données du formulaire
    formAddPhoto.reset()
    // Fermer la modale
    document.querySelector('#modale').close()
    document.querySelector('#add-photos').close()
}
function verifierFormulaire() {
  let isEverythingOk = true;
  // Reset des messages d'erreur
  const allErroMessage = document.querySelectorAll('.error')
  allErroMessage.forEach(error => {
    error.remove()
  })

  // Vérifier si une image a été sélectionnée
  if (document.querySelector("#preview").src == "") {
      afficherMessageErreur(".image-fieldset", "Vous devez renseigner l'image");
      isEverythingOk = false
  }

  // Vérifier si un titre a été donné
  if (document.querySelector("#title").value == "") {
      afficherMessageErreur("#title", "Vous devez renseigner le titre");
      isEverythingOk = false

  }

  // Vérifier si une catégorie a été attribuée
  const selectCategories = document.getElementById("category");
  const categorieSelectionnee = selectCategories.value;
  
  if (categorieSelectionnee == "") {
      afficherMessageErreur("#category", "Veuillez renseigner une catégorie");
      console.log("Veuillez sélectionner une catégorie.");
      isEverythingOk = false
  } 
  return isEverythingOk
}

function afficherMessageErreur(selecteur, message) {
  // Afficher un message d'erreur après l'élément spécifié par le sélecteur
  document
      .querySelector(selecteur)
      .insertAdjacentHTML("afterend", `<p class="error">${message}</p>`);
}

