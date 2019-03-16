///////////////////////////////////////////////////////////////////////////////////
// Declaration des fonctions qui seront à la base des fonctionalités de nos pages//
//////////////////////////////////////////////////////////////////////////////////

// Fonction qui supprime les P dans la base de donnée
const deleteP = function () {
    $.getJSON("./data.php?action=delP&id=" + this.id);
    this.parentNode.remove();
};

// Fonction qui renvoie un boutton pour supprimer l'article
const createDelete = function (id) {
    let deleteButton = document.createElement("img"); // le boutton est en fait une image
    deleteButton.src = "croix.png";
    deleteButton.classList.add("delete"); // classe inutilisé
    deleteButton.id = id;
    deleteButton.addEventListener("click", deleteP); // supprime le p quand on click
    return deleteButton;
};

// un Div qui contiendra les zones d'éditions
const zoneEdition = document.createElement("div"); // TODO directement l'ajouter dans les fonction qui l'utilise

// Fonction qui revoie une zone de texte pour la modification d'article
const createEdition = function (id, ordre, contenu) {
    let edition = document.createElement("input"); // création d'un input
    edition.setAttribute("type", "textarea");
    edition.ordre = ordre;
    edition.id = id;
    edition.value = contenu; // on garde le contenu pour pas avoir a tout ré ecrire
    return edition
};

// renvoie un div qui contien une croix et un p
const createParagraphe = function (id, ordre, contenu) {
    let paragrapheZone = document.createElement("div");
    let paragraphe = document.createElement("p");
    let deleteButton = createDelete(id);
    paragraphe.classList.add("paragraphe");
    paragraphe.innerHTML = contenu; // on insère le contenu dedans
    paragraphe.ordre = ordre; // on conserve les id des paragraphe
    paragraphe.id = id;

    paragrapheZone.appendChild(deleteButton);
    paragrapheZone.appendChild(paragraphe);

    return paragrapheZone
};

// Renvoi une zone d'input pour l'ajout de nouveaux paragraphe
const createNewParagrapheZone = function () {
    let newParagraphe = document.createElement("input");
    let newParagrapheZone = document.createElement("div");
    newParagraphe.setAttribute("type", "textarea");
    newParagraphe.rows = "4";
    newParagraphe.placeholder = "Nouveau paragraphe";
    newParagrapheZone.appendChild(newParagraphe);
    return newParagrapheZone;
};

// Fonction qui transforme un p en zone d'edition
const editParagraphe = function () {
    let li = this.parentNode.parentNode;
    let zoneEditNow = zoneEdition.cloneNode(true);
    let oldContenu = this.innerHTML;
    let editNow = createEdition(this.id, this.ordre, this.innerHTML);
    zoneEditNow.appendChild(editNow);
    const after = this.parentNode.nextSibling; // récupère l'objet qui est après le div, existe toujours

    // Fonction qui réagira à l'event de validation/annulation dans l'edition des zones de texte
    const validateOrCancel = function (event) {
        if (event.keyCode === 13) {
            let paragrapheNow = createParagraphe(editNow.id, editNow.ordre, editNow.value);
            paragrapheNow.firstChild.nextSibling.addEventListener("dblclick", editParagraphe); // le p
            let after = zoneEditNow.nextSibling;
            li.insertBefore(paragrapheNow, after);
            editNow.remove();
            $.getJSON("./data.php?action=updateP&id=" + editNow.id + "&contenu=" + editNow.value);
        }
        else if (event.keyCode === 27) {
            let paragrapheNow = createParagraphe(editNow.id, editNow.ordre, oldContenu);
            let after = editNow.nextSibling;
            paragrapheNow.firstChild.nextSibling.addEventListener("dblclick", editParagraphe); // le p
            li.insertBefore(paragrapheNow, after);
            editNow.remove();
        }
    };

    editNow.addEventListener("keyup", validateOrCancel);
    li.insertBefore(zoneEditNow, after);
    this.parentNode.remove();
};

// Fonction qui réagira à la validation dans la zone d'ajout de paragraphe
const addParagraphe = function (event) {
    if (event.keyCode === 13) {
        const contenu = this.value; // on récupère le contenu
        const ordre = this.ordre;
        let paragrapheNow = createParagraphe(0, ordre, contenu); //momentannement  un id de 0 en attendant le retour du serveur
        let p = paragrapheNow.firstChild.nextSibling; // le paragraphe créé
        let li = this.parentNode.parentElement; // récupération du parent pour insertion au bon endroit


        $.getJSON("data.php?action=addP&ordre=" + this.ordre + "&contenu=" + contenu, (res => p.id = res.id))
            .then(() => $.getJSON("data.php?action=addPinA&id_article=" + li.id + "&id_paragraphe=" + p.id));

        p.addEventListener("dblclick", editParagraphe);
        li.insertBefore(paragrapheNow, this.parentNode);//insertion avant la zone de texte
        //on reinitialise une nouvelle zone d'edition
        this.value = "";
        this.placeholder = "Nouveau Paragraphe";
        this.ordre += 1;
    }
};

// Fonction de récupération des articles du serveur et ajout sous forme de liste
let fetchParagraphe = function () {
    if (!this.classList.contains("activeArticle")) { // TODO Le mieux serait peut etre de retirer l'evenement lié au fetch ... à voir
        // on retire le statut article actif à l'article actif (s'il existe) pour le remetre sur celui ci
        let activeLi = document.querySelector(".activeArticle");
        if (activeLi) {
            while (activeLi.firstChild.nextSibling) {
                activeLi.removeChild(activeLi.firstChild.nextSibling);
            }
            activeLi.classList.remove("activeArticle");
        }
        this.classList.add("activeArticle");

        let li = this;

        // div qui contiendra l'article
        let article = document.createElement("div");
        article.classList.add("article");

        let newParagrapheZone = createNewParagrapheZone();
        let newParagraphe = newParagrapheZone.firstChild;
        newParagraphe.addEventListener("keyup", addParagraphe);

        // Fonction qui place les p après les li
        const setParagraphe = function ({ paragraphes }) {
            // Aout de tout les p à un article
            for (let i in paragraphes) {
                let paragrapheZone = createParagraphe(paragraphes[i].id, paragraphes[i].ordre, paragraphes[i].contenu);
                li.appendChild(paragrapheZone);
                paragrapheZone.firstChild.nextSibling.addEventListener("dblclick", editParagraphe);
            }
            newParagraphe.ordre = paragraphes.length + 2;
        };

        $.getJSON("data.php?action=getPFromA&article=" + li.id, setParagraphe).done(() => {
            li.appendChild(newParagrapheZone)
        });
    }
};

let liste = document.querySelector(".listArticle");

// Fonction qui permet de récuperer tout les article
const fetchArticle = function (data) {
    for (let i in data.articles) {
        let li = document.createElement("li");
        li.classList.add("title");
        li.id = data.articles[i].id;
        li.addEventListener("click", fetchParagraphe);
        li.innerHTML = data.articles[i].name + "\n";
        liste.appendChild(li);
    }
};

$.getJSON("data.php?action=getA", fetchArticle);
const button = document.querySelector(".submit");

// Fonction pour recreer un article après appui sur le bouton
const createNewArticle = function () {
    const newTitle = document.querySelector(".newTitle");

    const addLitoUl = function (data) {
        let li = document.createElement("li");
        li.classList.add("title");
        li.id = data.id;
        li.addEventListener("click", fetchParagraphe);
        li.innerHTML = newTitle.value + "\n";
        liste.appendChild(li);
    };

    if (newTitle.value !== "") {
        $.getJSON("./data.php?action=addA&name=" + newTitle.value, addLitoUl)
    }
};
button.addEventListener("click", createNewArticle);
