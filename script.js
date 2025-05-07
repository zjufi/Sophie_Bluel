const gallery = document.querySelector(".gallery")

let works = [];

const getWorks = async() => {
const reponse = await fetch('http://localhost:5678/api/works');

works = await reponse.json();
displayWorks();
}

const displayWorks = () => { //afficher les travaux
    works.forEach((work, i ) => {
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;

        const figure = document.createElement("figure");
        figure.appendChild(image);
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    })
}
;
getWorks();

//FILTRES CATEGORIES//
let categories = [];

const getCategories = async () => {
    const reponse = await fetch('http://localhost:5678/api/categories');
    categories = await reponse.json();
    displayCategoriesFilters();
}

const displayCategoriesFilters = () => {


    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
/*         button.setAttribute("data-id", category.id);  */
        button.addEventListener("click", () => filterWorks(category.id));
        document.querySelector(".categories").appendChild(button);
    })

    const isAuthenticated = sessionStorage.getItem("token") !== null;
    if (isAuthenticated) {
        document.querySelector(".categories").innerHTML = "";
    }
}

function filterWorks(selectedCategory) {
    console.log(selectedCategory);
    /* const selectedCategory = event.target.getAttribute("data-id"); */
    const filteredWorks = works.filter((work) => work.category.id == selectedCategory);
    gallery.innerHTML = "";
    filteredWorks.forEach((filteredWork) => {
        const image = document.createElement("img");
        image.src = filteredWork.imageUrl;
        image.alt = filteredWork.title;
        const figure = document.createElement("figure");
        figure.appendChild(image);
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = filteredWork.title;
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}
getCategories();


const AllWorks = () => {
    const button = document.createElement("button");
    button.textContent = "Tous";
    button.addEventListener("click", () => {
        gallery.innerHTML = "";
        displayWorks(); 
    });
    document.querySelector(".categories").appendChild(button);
}
AllWorks();



// LOGIN BTN & MODIFIER BTN //

 document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-button");
    const editBtn = document.getElementById("modifier-button");
    const editionBar = document.getElementById("bar");
    const isAuthenticated = sessionStorage.getItem("token") !== null;
  
    if (isAuthenticated) {
      loginBtn.textContent = "Log out";
      loginBtn.addEventListener("click", () => {
        sessionStorage.removeItem("token");
        location.reload();
      });

        editBtn.style.display = "block";
      
        editionBar.style.display = "block";


    } else {
      loginBtn.addEventListener("click", () => {
        window.location.href = "login.html";
      });
    }
  });




// MODAL // 
const modal = document.getElementById("editmodal");
const openmodalBtn = document.getElementById("modifier-button");
const closeBtn = document.querySelector(".close");
const modalGallery = document.querySelector(".modal-gallery");
const travauxContainer = document.getElementById('travaux-container');


/* const displayWorksInModal = () => { // Afficher les travaux dans le modal
  travauxContainer.innerHTML = ''; // Efface le contenu précédent
  works.forEach((work) => {
      const image = document.createElement("img");
      image.src = work.imageUrl;
      image.alt = work.title;

      const figure = document.createElement("figure");
      figure.appendChild(image);
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;
      figure.appendChild(figcaption);
      travauxContainer.appendChild(figure); // Ajoute au conteneur du modal
  });
}; */

openmodalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  /* getWorks(); */
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});


window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});



