function init(){
    const token= localStorage.getItem("token")
    if(token){
        const body = document.querySelector('body')
        body.insertAdjacentHTML('afterbegin', 
        `<div class="mode-edition">
            <i class="fa-regular fa-pen-to-square"></i>Mode édition
         </div>`)

        const modify = document.querySelector('#portfolio h2')
        modify.insertAdjacentHTML('beforeend',
        `<a  href="#" class="modif">
        <i class="fa-regular fa-pen-to-square"></i> modifier
         </a>
        `)
        const modif = document.querySelector('.modif')
        const modale = document.getElementById('modale')
        modif.addEventListener('click', (e)=>{
                e.preventDefault()
                // On fait un Appel API pour peupler la modale (#modale)
                getWorks(document.getElementById('contenu-modale'), false)
                // Avec le résultat de l'appel API tu ajoutes les travaux à la modale
                // On affiche la modale
                modale.showModal()
        })
        

        // Faire en sorte que si la modale est ouverte, sur l'appuie sur la touche "esc", la modale se ferme
        
        document.querySelector('header').classList.add('header-connect')
        const tous= document.querySelector('.filters button')
        // On supprime le bouton "tous"
        tous.remove()  
         // on remplace le text "login" par "logout"
        document.getElementById('login').innerHTML = "logout" 

        const deco= document.getElementById('login')
        deco.addEventListener('click', (e)=>{
            e.preventDefault()
            localStorage.removeItem("token")
            document.location.reload()
        })
    }
    if(!token){
       getCategories() 
    }
    getWorks(document.querySelector('.gallery'))
}
init()

// Faire appel à mon backend pour récupérer les catégories
async function getCategories() {
    // Faire appel à mon backend, sur la bonne URL
    const endpoint = "http://localhost:5678/api/categories"

    const req = await fetch(endpoint)
    const data = await req.json()

    // Injecter les données sur le front
    // Sélectionner la balise HTML ou on va injecter les données
    const filters = document.querySelector('.filters')

    // Parcours chaque élement et ajoute à filters
    data.forEach(element => {
        const button = `<button data-category="${element.id}">${element.name}</button>`
        filters.insertAdjacentHTML('beforeend', button)
    }); 

    // Sélectionner les boutons et ajouter un écouteur d'évènement
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
        button.addEventListener("click", e => {
            const categoryId = e.target.dataset.category;
            // Sélectionner toutes les figures
            const figures = document.querySelectorAll('.gallery figure')
            // Masquer toutes les figures
            figures.forEach(figure => {
                if(figure.dataset.category == categoryId){
                    figure.style.display = "block"
                } else {
                    figure.style.display = "none"

                }
                
            })

            
        })
    })

}



// Fonction qui permet de récupérer les travaux et les afficher
async function getWorks(element, showCaption = true){
    // Faire appel au backend, sur la bonne URL
    const endpoint = "http://localhost:5678/api/works"

    const req = await fetch(endpoint)
    const datas = await req.json()
    
    // const gallery = document.querySelector('.gallery')
    // On parcours les données une a une pour les afficher dans la page
    showFigure(element, datas, showCaption)

}

function showFigure(element, datas, showCaption = true){

    element.innerHTML = "";

    datas.forEach(data =>{
        var caption = ``;

        if (showCaption) 
            caption = `<figcaption>${data.title}</figcaption>`;

        const figure = `<figure data-category="${data.categoryId}">
        <img src="${data.imageUrl}" alt="${data.title}" `+ caption +`
        </figure>`   

        element.insertAdjacentHTML("beforeend", figure)

    })

 
}
