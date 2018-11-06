// TODO : préparer un "composant" boutonPlus
// qui insère des P. en position haute ou basse
// suivant une méta-donnée "position"

var jP = $("<p>").html("Nouveau");

var composantBtnP = $("<div>")
  .addClass("btnPlus")
  .data("top", true)
  .append(
    $("<input type='button'/>")
      .val("+")
      .click(function() {
        displayNewParagraph();
        addParagraph();
      })
  )
  .append($("<input type='text' />"));

var getParagraphs = function() {
  return $.getJSON(
    "http://www.vahlioncopyright.ebm/jquery/cas_etude/data.php?action=getP"
  ).then(data => {
    return data;
  });
};
var mockParagraphs = function() {
  return JSON.parse(
    '[{"id":"1","contenu":"Nans et Vahlion les plus beaux","ordre":"1"},{"id":"2","contenu":"hello world","ordre":"2"}]'
  );
};
var displayParagraphs = function(data) {
  console.log("récupération des paragraphes de la bdd", data);
  data.forEach(paragraph => {
    $("#contenu").append($("<p>").html(paragraph.contenu));
  });
};

var displayNewParagraph = function() {
  var contenu = $(this)
    .next()
    .val();
  $(this)
    .next()
    .val("");
  var jNextP = jP.clone();
  if (contenu) jNextP.html(contenu);

  // la zone d'insertion
  // dépend de la méta-donnée "top"
  // portée par le composant
  if (
    $(this)
      .parent()
      .data("top")
  )
    $("#contenu").prepend(jNextP);
  else $("#contenu").append(jNextP);
};

var addParagraph = function() {
  $.getJSON(
    "http://www.vahlioncopyright.ebm/jquery/cas_etude/data.php?action=getP"
  ).then(data => {
    return data;
  });
}

$(document).ready(function() {
  // traitements d'initialisation

  // 1) ajouter les éléments d'interaction à la page
  // Leur structure : <+><input text>

  $("#contenu")
    .before(composantBtnP.clone(true).addClass("red"))
    .after(
      composantBtnP
        .clone(true)
        .addClass("blue")
        .data("top", false)
    );

  // récupération des paragraphes de la bdd
  displayParagraphs(mockParagraphs());
});
// 2)  Passage en mode édition des P. insérés
// clic => le P. se transforme en textarea avec le mm contenu
// "ENTREE" => le textarea redevient un P. avec le mm contenu

// Réagir aux clicks sur les P. (y compris futurs !)
$(document).on("click", "#contenu p", function() {
  // fonction appelee lors d'un clic sur un P
  // dans le div de contenu
  var contenu = $(this).html(); // recup contenu
  var jTa = $("<textarea>")
    .val(contenu)
    .data("contenuInitial", contenu);
  // prépa txtarea
  // AJOUT d'une méta-donnée

  $(this).replaceWith(jTa); // insertion txtarea
  jTa.focus(); // .select();
});

// Réagir aux appuis sur ENTREE dans les txtarea
$(document).on("keydown", "#contenu textarea", function(contexte) {
  // quelle est la touche appuyée ??
  // en JQuery, tous les gestionnaires d'evenements
  // sont destinataires d'un objet event en param.
  // prop code ascii de la touche : code vaudra "Enter"

  console.log(contexte.which);
  if (contexte.which != 13) return;

  var contenu = $(this).val(); // recup contenu
  var jPar = $("<p>").html(contenu); // prépa P
  $(this).replaceWith(jPar); // insertion P
});

// 3) "ESC" => toutes les éditions en cours sont annulées
// les contenus des textarea sont restaurés aux valeurs
// initiales - elles avaient été stockées par la méthode .data()
// itérer sur un ensemble : $(sel).each(fonction)

$(document).keyup(function(contexte) {
  if (contexte.which != 27) return;

  // parcours de tous les textarea
  $("#contenu textarea").each(function() {
    // $(this) dénote le txtarea en cours de parcours
    // permet de récupérer le contenu initial
    var contenu = $(this).data("contenuInitial");
    var jPar = $("<p>").html(contenu); // prépa P
    $(this).replaceWith(jPar); // insertion P
  });
});

// DEBUG
$(document).on("mouseover", "#contenu *", function() {
  console.log($(this).data());
});
