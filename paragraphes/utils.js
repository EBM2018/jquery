    // Var globale : DANGEREUX
    var v1_compteur = 0; // globale
    var v1_MAX = 5;

    // BESOIN de variables 'privées' : faire des closures ('fermetures')
    // Tant qu'une référence vers un scope existe dans le navigateur
    // le navigateur "persiste" ce scope (maintient la mémoire accessible)

    // scope : l'ensemble des variables visibles depuis un bloc / une fonction

    function mkScope (param_formel1, param_formel2) {
        var variable_locale;
        // accessible ici : compteur, max (var. globales)
        // param_formel1, param_formel2, variable_locale => var. locales
        // remises à zéro à chaque nouvel appel de la fonction

        var aux = function (pf1, pf2) {
            var vl1;
            // quelles sont les variables visibles depuis l'intérieur de aux ?
            // les var. globales
            // les var. locales de mkScope
            // les var. locales de aux (réinitialisées à chaque appel de aux)
        };

        return aux;
        // tant qu'il existera une référence vers aux accessible dans le code du navigateur
        // le scope de aux restera disponible : Y COMPRIS LES VARIABLES LOCALES DE MKSCOPE !!
    }


    function mkDebug(MAX) {
        var compteur=0;
        return function (s) {
            // si s n'est pas fourni, afficher le compteur
            if (s == undefined) {
                console.log(compteur);
                return;
            }

            // Objectif : afficher s
            // Ne plus afficher après MAX essais
            if (compteur++ < MAX) {
                console.log(s);
            }
        }
    }

    function mkDebugV2(MAX) {
        var compteur=0;
        return {
            print:function(s) {
                if (compteur++ < MAX) {
                    console.log(s);
                }
            },
            reset:function() {compteur=0;},
            resetMax:function(m){MAX=m;},
            getCompteur:function() {console.log(compteur);}
        }; // Objet JSON "Javascript Object Notation"
    }


    function debug(s) {

        // si s n'est pas fourni, afficher le compteur
        if (s == undefined) {
            console.log(v1_compteur);
            return;
        }

        // Objectif : afficher s
        // Ne plus afficher après MAX essais
        if (v1_compteur++ < v1_MAX) {
            console.log(s);
        }
    }


    // Objectif : modifier le contenu d'une balise si paramètre 'contenu' est fourni
    // renvoyer le contenu sinon
    // On distingue deux cas :
    // val() <=> champ de formulaire (input, textarea) => propriété .value
    // html() <=> balise quelconque => propriété .innerHTML

    function html(refOrId,contenu) {
        if (typeof refOrId === "string") {
            refOrId  = document.getElementById(refOrId);
        }

        // contenu est-il fourni ?
        if (contenu != null) {
            // il y a un contenu => On s'en sert pour changer le contenu de la balise
            refOrId.innerHTML = contenu;
        } else {
            // pas de contenu => on renvoie le contenu actuel
            return refOrId.innerHTML;
        }
    }

    // TODO: val doit pouvoir traiter des cases à cocher / bouton radio
    // dans ce cas, contenu doit valoir false ou true
    function val(refOrId,contenu) {
        if (typeof refOrId === "string") {
            refOrId  = document.getElementById(refOrId);
        }

        if (refOrId.type == "checkbox") {
            if (contenu != null) refOrId.checked = contenu;
            else return refOrId.checked;
        } else {
            // contenu est-il fourni ?
            if (contenu != null) {
                // il y a un contenu => On s'en sert pour changer le contenu de la balise
                refOrId.value = contenu;
            } else {
                // pas de contenu => on renvoie le contenu actuel
                return refOrId.value;
            }
        }
    }

    /*
    * en js & php:
    * 0 == false est vrai : on compare un entier et un booléen
    * la valeur "booléenne" de 0 est "false"
    * 0 === false est faux : les types sont différents
    *
    * !==
    * */

    // cacher/afficher des balises
    function show(refOrId,mode) {
        // mode par défaut : "block"

        if (typeof refOrId === "string") {
            refOrId  = document.getElementById(refOrId);
        }

        if (mode != null) refOrId.style.display = mode;
        else refOrId.style.display = "block";
    }


    function hide(refOrId) {
        if (typeof refOrId == "string") {
            refOrId  = document.getElementById(refOrId);
        }
        refOrId.style.display = "none";
    }

    console.log("Chargement librairie (debug,show,hide,html,val)");