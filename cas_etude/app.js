// TODO : préparer un "composant" boutonPlus
// qui insère des P. en position haute ou basse
// suivant une méta-donnée "position"

var jP = $("<div>").html("Nouveau").addClass('p');
var cross = $("<span>").html('X').addClass('cross').click(function(){
    console.log("test");
    var id = $($(this).siblings()[0]).attr('data-id');
    delParagraph(id);
    $(this).parent().remove();
});
var paragraphItem = $('<div>').css('display', 'inline-block');

var composantBtnP = $("<div>")
  .addClass("btnPlus")
  .data("top", true)
  .append(
    $("<input type='button'/>")
      .val("+")
      .click(function() {
          var ordre =  parseInt($($($('#contenu > div')[0]).children()[0]).attr('data-ordre'));
          var contenu = $(this)
              .next()
              .val();
          $(this)
              .next()
              .val("");
          var jNextP = jP.clone();
          if (contenu) jNextP.html(contenu);
          var paragraphNextP = paragraphItem.clone().append(jNextP).append(cross);
          // var paragraphItem = jNextP.append("<span>x</span>")
          // la zone d'insertion
          // dépend de la méta-donnée "top"
          // portée par le composant
          if (
              $(this)
                  .parent()
                  .data("top")
          )
              $("#contenu").prepend(paragraphNextP);
          else $("#contenu").append(paragraphNextP);

        ordre--;
        addParagraph(ordre, jNextP.html());
      })
  )
  .append($("<input type='text' />"));

var getParagraphs = function() {
  return $.getJSON(
    "http://www.vahlioncopyright.ebm/jquery/paragraphes/data.php?action=getP"
  ).then(data => {
    displayParagraphs(data);
  });
};
var mockParagraphs = function() {
  return JSON.parse(
    '[{"id":"1","contenu":"Nans et Vahlion les plus beaux","ordre":"1"},{"id":"2","contenu":"hello world","ordre":"2"}]'
  );
};
var displayParagraphs = function(data) {
  console.log("récupération des paragraphes de la bdd", data);
  data.paragraphes.forEach(paragraphe => {
    var pItem = paragraphItem.clone();
    var crossItem = cross.clone(true,true);
    var pToDisplay = $("<p>").html(paragraphe.contenu).attr('data-id', paragraphe.id).attr('data-ordre', paragraphe.ordre);
    pItem.append(pToDisplay).append(crossItem);
    $("#contenu").append(pItem);
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

var addParagraph = function(ordre, contenu) {
  $.getJSON(
    `http://www.vahlioncopyright.ebm/jquery/paragraphes/data.php?action=addP&ordre=${ordre}&contenu=${contenu}`
  ).then(data => {
    return data;
  });
}

var delParagraph = function(id) {
    $.getJSON(
        `http://www.vahlioncopyright.ebm/jquery/paragraphes/data.php?action=delP&id=${id}`
    );
}

var updateContent = function(id,contenu) {
    $.getJSON(
        `http://www.vahlioncopyright.ebm/jquery/paragraphes/data.php?action=updateP&id=${id}&contenu=${contenu}`
    );
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
  getParagraphs();
});
// 2)  Passage en mode édition des P. insérés
// clic => le P. se transforme en textarea avec le mm contenu
// "ENTREE" => le textarea redevient un P. avec le mm contenu

// Réagir aux clicks sur les P. (y compris futurs !)
$(document).on("click", "#contenu div>p", function() {
    var id = $(this).attr('data-id');
    // fonction appelee lors d'un clic sur un P
    // dans le div de contenu
    var contenu = $(this).html(); // recup contenu
    var jTa = $("<textarea>")
    .val(contenu)
    .data("contenuInitial", contenu)
    .attr('data-id',id);
    // prépa txtarea
    // AJOUT d'une méta-donnée

    $(this).replaceWith(jTa); // insertion txtarea
    jTa.focus(); // .select();
});

// Réagir aux appuis sur ENTREE dans les txtarea
$(document).on("keydown", "#contenu textarea", function(contexte) {
    var id = $(this).attr('data-id');
    // quelle est la touche appuyée ??
    // en JQuery, tous les gestionnaires d'evenements
    // sont destinataires d'un objet event en param.
    // prop code ascii de la touche : code vaudra "Enter"

    console.log(contexte.which);
    if (contexte.which != 13) return;

    var contenu = $(this).val(); // recup contenu
    if (contenu.length === 0) {
        resetChanges(this);
    }
    var jPar = $("<p>").attr('data-id',id).html(contenu); // prépa P
    $(this).replaceWith(jPar); // insertion P
    updateContent(id,contenu);
});

// 3) "ESC" => toutes les éditions en cours sont annulées
// les contenus des textarea sont restaurés aux valeurs
// initiales - elles avaient été stockées par la méthode .data()
// itérer sur un ensemble : $(sel).each(fonction)

$(document).keyup(function(contexte) {
  if (contexte.which != 27) return;

  // parcours de tous les textarea
  $("#contenu textarea").each(function() {
      resetChanges(this);
  });
});

var resetChanges = function(element){
    var id = $(element).attr('data-id');
    // $(this) dénote le txtarea en cours de parcours
    // permet de récupérer le contenu initial
    var contenu = $(element).data("contenuInitial");
    var jPar = $("<p>").attr('data-id',id).html(contenu); // prépa P
    $(element).replaceWith(jPar); // insertion P
    //Faire l'update de P

}
