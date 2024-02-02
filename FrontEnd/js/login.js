// Ajouter un eventListener au clic sur le bouton
    const boutonSubmit = document.querySelector('.btn-connexion')

    boutonSubmit.addEventListener('click', async (e) => {
        e.preventDefault();

        // Au clic, on récupère les contenus des deux champs
        const email = document.getElementById('email');
        const mdp= document.getElementById('pass'); 
         // On vérifie que ce n'est PAS vide
        if(!email.value){
            alert("Vous devez renseigner l'email")
            return
        } 

        if(!mdp.value){
            alert("Vous devez renseigner le mot de passe")
            return
        }
        
      
        // On vérifie que le mail est bien un mail
        const Regxp = /[a-zA-Z0-9.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!Regxp.test(email.value)){
            alert('Vous devez renseigner un mail valide')
            return
        }
        // Si tout est bon, on fait une requête AJAX (fetch) au serveur
        
        const token = await login(email.value,mdp.value)

        // Si les données de connexion ne sont pas correctes > Afficher le message d'erreur (mail ou mot de passe incorrects)
        if(token){
            localStorage.setItem("token", token)
            document.location.href = "index.html"
        } else {
            alert('Vous devez renseigner un mail et un mot de passe valide')
        }


       
        // Si les donnée sont correctes, on récupère le token qu'on va stocker (localStorage)
            // > On redirige l'utilisateur sur la page d'accueil

         
            
            // > On remplace le lien "Login" par "Déconnexion"
      
    })
 async function login(email, mdp){
    const endpoint = "http://localhost:5678/api/users/login"

    const req = await fetch(endpoint, {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": mdp
          })
    })
    const data = await req.json()
    return data.token
 }
