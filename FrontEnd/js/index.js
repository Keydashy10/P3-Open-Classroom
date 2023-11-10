function init(){
    const token= localStorage.getItem("token")
    if(token){
        const body = document.querySelector('body')
        body.insertAdjacentHTML('afterbegin', 
        `<div class="mode-edition">
            <i class="fa-regular fa-pen-to-square"></i>Mode édition
         </div>`)

        document.querySelector('header').classList.add('header-connect')
        const tous= document.querySelector('.filters button')
        // On supprime le bouton "tous"
        tous.remove()  
         // on remplace le text "login" par "logout"
        document.getElementById('login').innerHTML = "logout" 
    }
    if(!token){
       getCategories() 
    }
    getWorks()
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
async function getWorks(){
    // Faire appel au backend, sur la bonne URL
    const endpoint = "http://localhost:5678/api/works"

    const req = await fetch(endpoint)
    const datas = await req.json()
    
    const gallery = document.querySelector('.gallery')
    // On parcours les données une a une pour les afficher dans la page
    datas.forEach(data => {
        const figure = `<figure data-category="${data.categoryId}">
                            <img src="${data.imageUrl}" alt="${data.title}">
                            <figcaption>${data.title}</figcaption>
                        </figure>`
        gallery.insertAdjacentHTML("beforeend", figure)
    })

}
