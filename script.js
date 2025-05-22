const gallery = document.querySelector(".gallery");
const isAuthenticated = sessionStorage.getItem("token") !== null;
const baseApiUrl = "http://localhost:5678/api/";

let works = [];

// FONCTION ASYNCHRONE POUR RECCUPPERER TRAVAUX DANS API //
const getWorks = async () => {
  const reponse = await fetch(baseApiUrl + "works"); // fetch réccupère les données de l'API //
  works = await reponse.json(); // convertis la réponse en JSON //
  displayWorks();
  displayWorksModal();
};

// FONCTION POUR AFFICHER LES TRAVAUX //
const displayWorks = () => {
  gallery.innerHTML = "";
  works.forEach((work, i) => {
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;

    const figure = document.createElement("figure");
    figure.appendChild(image);

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
};

//FILTRES CATEGORIES//

let categories = [];

// Fonction asynchrone pour obtenir les catégories dans l'API //
const getCategories = async () => {
  const reponse = await fetch(baseApiUrl + "categories");
  categories = await reponse.json();
  displayCategoriesFilters();
};

// Fonction pour afficher les boutons de filtres de catégories //
const displayCategoriesFilters = () => {
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => filterWorks(category.id));
    document.querySelector(".categories").appendChild(button);
  });
};

// Fonction pour filtrer les travaux en fonction de la catégorie choisie //
function filterWorks(selectedCategory) {
  const filteredWorks = works.filter(
    (work) => work.category.id == selectedCategory
  );
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

// FILTRE "Tous" //
const AllWorks = () => {
  const button = document.createElement("button");
  button.textContent = "Tous";
  button.addEventListener("click", () => {
    gallery.innerHTML = "";
    displayWorks();
  });
  document.querySelector(".categories").appendChild(button);
};
AllWorks();

// AUTHENTIFICATION UTILISATEUR + AFFICHAGE MODE UTILISATEUR //

// Fonction pour reccuperer token + modifier parametres du mode utilisateur //
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-button");
  const editBtn = document.getElementById("modifier-button");
  const editionBar = document.getElementById("bar");

  if (isAuthenticated) {
    loginBtn.textContent = "Log out";
    loginBtn.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      location.reload();
    });

    editBtn.style.display = "block";
    editionBar.style.display = "block";
    document.querySelector(".categories").style.display = "none";
  } else {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});

// MODAL  //
const modal = document.getElementById("editmodal");
const openmodalBtn = document.getElementById("modifier-button");
const closeBtn1 = document.querySelector(".close_1");
const closeBtn2 = document.querySelector(".close_2");
const modalGallery = document.querySelector(".modal-gallery");
const travauxContainer = document.getElementById("travaux-container");

// Bouton ouvrir modal
openmodalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Boutons fermer modal
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

// AFFICHER LES TRAVAUX + ICON MODAL //
const displayWorksModal = () => {
  const modalGalleryContainer = document.querySelector(
    "#modal-gallery-container"
  );
  modalGalleryContainer.innerHTML = "";
  works.forEach((work, i) => {
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;

    const figure = document.createElement("div");
    figure.classList.add("modal-gallery-item");
    figure.appendChild(image);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");

    figure.appendChild(deleteIcon);
    modalGalleryContainer.appendChild(figure);

    // SUPPRIMER UN WORK DANS LE MODAL //

    deleteIcon.addEventListener("click", () => {
      const confirmation = confirm(
        "Voulez-vous vraiment supprimer ce projet ?" // message de confirmation de suppression //
      );

      if (confirmation) {
        const token = sessionStorage.getItem("token"); // récupère le token stocké //

        fetch(`http://localhost:5678/api/works/${work.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              getWorks();
              console.log(`Projet ID ${work.id} supprimé avec succès`);
            } else {
              return response.json().then((data) => {
                console.error("Erreur API :", data);
                alert(
                  "La suppression a échoué : " +
                    (data.message || "Erreur inconnue")
                );
              });
            }
          })
          .catch((error) => {
            console.error("Erreur réseau :", error);
            alert("Erreur lors de la suppression.");
          });
      }
    });
  });
};
getWorks();

//MODAL AJOUTER PHOTO  //

const modalAddPhotoView = document.getElementById("modal-add-photo");
const addPhotoBtn = document.getElementById("add-photo");
const backToGalleryBtn = document.getElementById("back-to-gallery");
const categorySelect = document.getElementById("photo-category");
const modalGalleryContainer = document.getElementById(
  "modal-gallery-container"
);
const modalGalleryView = document.querySelector(".modal-gallery");
const addPhotoForm = document.getElementById("photo-form");
const photoInput = document.getElementById("photo-input");
const photoTitleInput = document.getElementById("photo-title");
const submitButton = document.querySelector(".submit-button");

/* REINITIALISER LE FORMULAIRE */
/* function resetAddPhotoForm() {
  addPhotoForm.reset();
 */
/*  Supprime seulement la prévisualisation de l’image, sans toucher aux icônes/labels */
/*   const previewImage = imageContainer.querySelector("img");
  if (previewImage) {
    previewImage.remove();
  } */

/*  Réinitialise l'état du bouton */
/*   submitButton.disabled = true;
  submitButton.style.backgroundColor = "";
  submitButton.style.color = "";
  submitButton.style.cursor = "default";
}
 */

// Bouton "Ajouter une photo" => changer de vue //
addPhotoBtn.addEventListener("click", () => {
  modalGalleryView.style.display = "none";
  modalAddPhotoView.style.display = "flex";
  loadCategories();
});

// Bouton retour //
backToGalleryBtn.addEventListener("click", () => {
  modalAddPhotoView.style.display = "none";
  modalGalleryView.style.display = "flex";
});

// Charger les catégories depuis l'API //
async function loadCategories() {
  try {
    const response = await fetch(baseApiUrl + "categories");
    if (!response.ok)
      throw new Error("Erreur lors du chargement des catégories");
    const categories = await response.json();

    categorySelect.innerHTML =
      "<option value='0'>Choisir une catégorie</option>"; // vide le select

    categories.forEach((cat) => {
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

// Ajouter une nouvelle photo //
// fonction asyncrone pour reccuperer l'autorisation de l'API //

addPhotoForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // empêche le rechargement de la page

  let formData = new FormData();
  formData.append("image", photoInput.files[0]);
  formData.append("title", photoTitleInput.value);
  formData.append("category", categorySelect.value);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur lors de l'ajout de la photo");
    const newWork = await response.json();
    getWorks();
    modalAddPhotoView.style.display = "none";
    modalGalleryView.style.display = "flex";
  } catch (err) {
    console.error("Erreur:", err);
    alert("Impossible d'ajouter la photo");
  }
});

// Afficher la previsualisation de l'image //

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

    reader.readAsDataURL(file);
  } else {
    alert("L'image doit être au format JPG ou PNG et faire moins de 4 Mo.");
    photoInput.value = "";
  }
});

//Écouteur sur le champ titre
photoTitleInput.addEventListener("input", checkFormCompletion);

// Fonction pour surveiller si le formulaire est complet//
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
    submitButton.style.backgroundColor = "";
    submitButton.style.color = "";
    submitButton.style.cursor = "default";
  }
}

// Activation du bouton submit si tous les champs sont remplis //
addPhotoForm.addEventListener("input", () => {
  const isFormValid =
    photoInput.files.length > 0 &&
    photoTitleInput.value.trim() !== "" &&
    categorySelect.value !== "";
  submitButton.disabled = !isFormValid;
});
