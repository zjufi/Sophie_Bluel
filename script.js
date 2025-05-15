const gallery = document.querySelector(".gallery")

let works = [];

const getWorks = async() => {
const reponse = await fetch('http://localhost:5678/api/works');

works = await reponse.json();
displayWorks();
displayWorksModal();
}

const displayWorks = () => { //afficher les travaux
  gallery.innerHTML = "";
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
};
/* MODAL DISPLAY WORKS */
const displayWorksModal = () => { 
  const modalGalleryContainer = document.querySelector("#modal-gallery-container");
  modalGalleryContainer.innerHTML = ""; 
  works.forEach((work, i ) => {
      const image = document.createElement("img");
      image.src = work.imageUrl;
      image.alt = work.title;

      const figure = document.createElement("div");
      figure.classList.add("modal-gallery-item");
      figure.appendChild(image);
      
      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-solid", "fa-trash-can");
      
      deleteIcon.addEventListener("click", () => { 
        const confirmation = confirm("Voulez-vous vraiment supprimer ce projet ?");

        if (confirmation) {
          const token = sessionStorage.getItem("token"); // récupère le token stocké
      
          fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          })
          .then(response => {
            if (response.ok) {
              figure.remove(); // supprime l’élément visuellement
              console.log(`Projet ID ${work.id} supprimé avec succès`);
            } else {
              return response.json().then(data => {
                console.error("Erreur API :", data);
                alert("La suppression a échoué : " + (data.message || "Erreur inconnue"));
              });
            }
          })
          .catch(error => {
            console.error("Erreur réseau :", error);
            alert("Erreur lors de la suppression.");
          });
        }
      });
      
      figure.appendChild(deleteIcon);
      modalGalleryContainer.appendChild(figure);
  })
};
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
const closeBtn1 = document.querySelector(".close_1");
const closeBtn2 = document.querySelector(".close_2");
const modalGallery = document.querySelector(".modal-gallery");
const travauxContainer = document.getElementById('travaux-container');

// Bouton ouvrir modal
openmodalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Bouton fermer modal

closeBtn1.addEventListener("click", () => {
  modal.style.display = "none";
});

closeBtn2.addEventListener("click", () => {
  modal.style.display = "none";
});



// Bouton fermer modal en cliquant en dehors
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});



/* MODAL ADD PHOTO  */

const modalAddPhotoView = document.getElementById("modal-add-photo");
const addPhotoBtn = document.getElementById("add-photo");
const backToGalleryBtn = document.getElementById("back-to-gallery");
const categorySelect = document.getElementById("photo-category");
const modalGalleryContainer = document.getElementById("modal-gallery-container");
const modalGalleryView = document.querySelector(".modal-gallery");
const addPhotoForm = document.getElementById("photo-form");
const photoInput = document.getElementById("photo-input");
const photoTitleInput = document.getElementById("photo-title");
const submitButton = document.querySelector(".submit-button");



// Bouton "Ajouter une photo" => change de vue
addPhotoBtn.addEventListener("click", () => {
  modalGalleryView.style.display = "none";
  modalAddPhotoView.style.display = "flex";
  loadCategories();
  submitButton.disabled = true; // charge les catégories chaque fois qu'on ouvre le formulaire
});

// Bouton retour
backToGalleryBtn.addEventListener("click", () => {
  modalAddPhotoView.style.display = "none";
  modalGalleryView.style.display = "flex";
});

// Activation du bouton submit si tous les champs sont remplis
addPhotoForm.addEventListener("input", () => {
  const isFormValid = photoInput.files.length > 0 && photoTitleInput.value.trim() !== "" && categorySelect.value !== "";
  submitButton.disabled = !isFormValid;
});

// Charger les catégories depuis l'API
async function loadCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) throw new Error("Erreur lors du chargement des catégories");
    const categories = await response.json();

    categorySelect.innerHTML = ""; // vide le select

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Erreur:", err);
    alert("Impossible de charger les catégories");
  }
}

// Ajouter une nouvelle photo

addPhotoForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // empêche le rechargement de la page

  let formData = new FormData();
  formData.append("image", photoInput.files[0]);
  formData.append("title", photoTitleInput.value);
  formData.append("category", categorySelect.value);


  try {
     const response = await fetch ("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      },
      body: formData
    });

    if (!response.ok) throw new Error("Erreur lors de l'ajout de la photo");

    const newWork = await response.json();
    works.unshift(newWork); // ajoute la nouvelle photo au tableau works
    displayWorks(); // met à jour l'affichage des travaux
    displayWorksModal(); // met à jour l'affichage des travaux dans la modale
    modalAddPhotoView.style.display = "none";
    modalGalleryView.style.display = "flex";
  } catch (err) {
    console.error("Erreur:", err);
    alert("Impossible d'ajouter la photo");
  }
});



 /*    VOIR LA PHOTO SELECTIONNÉE */

// Sélection des éléments
const imageContainer = document.querySelector(".image-container");
const imageIcon = document.getElementById("imageIcon");
const uploadLabel = document.getElementById("uploadLabel");
const uploadInfo = document.querySelector(".upload-info");

// Écouteur sur le champ fichier
photoInput.addEventListener("change", function () {
  const file = photoInput.files[0];

  if (file && file.size <= 4 * 1024 * 1024) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Supprime l'icône et le label si présents
      if (imageIcon) imageIcon.remove();
      if (uploadLabel) uploadLabel.remove();
      if (uploadInfo) uploadInfo.remove();


      // Crée une nouvelle image
      const imgPreview = document.createElement("img");
      imgPreview.src = e.target.result;
      imgPreview.alt = "Aperçu de l'image";
      imgPreview.style.maxHeight = "100%";
      imgPreview.style.maxWidth = "100%";
      imgPreview.style.objectFit = "contain";
      imgPreview.style.margin = "auto";

      imageContainer.prepend(imgPreview);

      checkFormCompletion();
    };

     // Supprime une image déjà affichée s’il y en a une
     const oldImg = imageContainer.querySelector("img");
     if (oldImg) oldImg.remove();


    reader.readAsDataURL(file);
  } else {
    alert("L'image doit être au format JPG ou PNG et faire moins de 4 Mo.");
    photoInput.value = ""; 
  }
});

photoTitleInput.addEventListener("input", checkFormCompletion);

function checkFormCompletion() {
  const file = photoInput.files[0];
  const title = photoTitleInput.value.trim();

  const isValid = file && title.length > 0;

  submitButton.disabled = !isValid;

  if (isValid) {
    submitButton.style.backgroundColor = "#1D6154";
    submitButton.style.color = "";
    submitButton.style.cursor = "pointer";
  } else {
    submitButton.style.backgroundColor = "#";
    submitButton.style.backgroundColor = "";
    submitButton.style.backgroundColor = "";
    submitButton.style.color = "";
    submitButton.style.cursor = "default";
  }
}



