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
    close1st.addEventListener('click',(e)=>{
      e.preventDefault()
      modale.close()
    })
    close2nd.addEventListener('click',(e)=>{
      e.preventDefault()
      addPhotos.close()
    })
    
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

  datas.forEach(data => {
    var caption = ``;

    if (showCaption) caption = `<figcaption>${data.title}</figcaption>`;

    const trash = showTrash ? `<img src="./assets/images/trash-solid.svg" class="trash" data-id="${data.id}" alt="Supprimer" />` : ''

    const figure =
      `<figure delete-id="${data.id}" data-category="${data.categoryId}">
        ${trash}
        <img src="${data.imageUrl}" alt="${data.title}" class="img-trash" />
        ${caption}
        </figure>`;

    element.insertAdjacentHTML("beforeend", figure);
  });


  // Si l'icone de suppression est présente, on y ajoute l'eventlistener pour la suppression
  if(showTrash){
    const trashes = document.querySelectorAll('.trash')

    trashes.forEach(trash => {
        trash.addEventListener('click', (e) => {
          // On lance la fonction de suppression en envoyant l'id
          deleteWork(e.target.dataset.id)
        })
    })
  }
}


async function deleteWork(id){
   // Faire appel au backend, sur la bonne URL
   const endpoint = "http://localhost:5678/api/works/"+id;

  //  Ajouter le token pour pouvoir faire la suppression (headers, authorization bearer fetch)
   const req = await fetch(endpoint, {
      method: 'DELETE',
   });
   const datas = await req.json();

   // Après la suppression, recharger les images sur la page et dans la modale
    // > Sélectionner le travail avec l'id et faire un .remove()

  // On sélectionne tous les éléments avec le delete-id  == id
  const elements = document.querySelectorAll(`[delete-id="${id}"]`)
  // On fait une boucle pour supprimer tous les éléments
  elements.forEach(el => {
    el.remove()
  })
}

// Fonction addWork
async function addWork(id){

}