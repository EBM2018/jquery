<?php

error_reporting(E_ERROR); // enlever les messages 'deprecated'...

include("config.php");
// penser à maj le nom de la base et le mot de passe
include("maLibSQL.pdo.php");

$data["feedback"] = "ko";
$data["paragraphes"] = array();
if (isset($_GET["action"])) {
    switch ($_GET["action"]) {

        case "delP" :
            // Supprime un P à partir de son identifiant
            if (isset($_GET["id"])) $id = $_GET["id"];
            if ($id) {
                $SQL = "DELETE FROM paragraphes WHERE id='$id';
                DELETE FROM articles_paragraphes WHERE id_paragraphe='$id'";
                SQLUpdate($SQL);
                $data["feedback"] = "ok";
            }

        // id, contenu, ordre
        case "addP" :
            // Ajoute un P. et renvoie son identifiant

            $contenu = $ordre = false;
            if (isset($_GET["contenu"])) $contenu = $_GET["contenu"];
            if (isset($_GET["ordre"])) $ordre = $_GET["ordre"];

            if (($ordre !== false) && $contenu) {
                $SQL = "INSERT INTO paragraphes(ordre, contenu) VALUES ('$ordre','$contenu')";
                $nextId = SQLInsert($SQL);
                $data["feedback"] = "ok";
                $data["id"] = $nextId;
            }
            break;

        case "updateP" :
            // Modifie un P. dont le nom est passé en paramètre
            if (isset($_GET["contenu"])) $contenu = $_GET["contenu"];
            if (isset($_GET["id"])) $id = $_GET["id"];

            if ($id && $contenu) {
                $SQL = "UPDATE paragraphes SET contenu='$contenu' WHERE id='$id'";
                SQLUpdate($SQL);
                $data["feedback"] = "ok";
            }

            break;

        case "updateOrdre" :
            // Change l'ordre d'un paragraphe

            // On indique l'id du paragraphe concerné,
            // ainsi que le nouveau numéro d'ordre
            if (isset($_GET["id"])) $id = $_GET["id"];
            // On récupère l'ordre d'arrivée
            if (isset($_GET["ordrearrive"])) $ordrearrive = $_GET["ordrearrive"];
            // On récupère l'ordre de départ
            if (isset($_GET["ordredepart"])) $ordredepart = $_GET["ordredepart"];

            // On récupère l'id du paragraphe concerné
            $SQL = "SELECT id FROM paragraphes WHERE ordre = '$ordrearrive'";
            if (SQLGetChamp($SQL)) {
                // Il peut s'agir d'un numéro d'ordre qui est déjà utilisé
                // On va décaler les ordres des paragraphes existants après
                // TODO: SEULEMENT si c'est le CAS (doit être inutile ?)


                // Si on déplace le paragraphe ver le haut
                if ($ordrearrive > $ordredepart) {
                    $SQL = "UPDATE paragraphes SET ordre = ordre-1 
							WHERE ordre <= '$ordrearrive' AND ordre > '$ordredepart'";
                    SQLUpdate($SQL);
                } else {
                    $SQL = "UPDATE paragraphes SET ordre = ordre+1 
							WHERE ordre >= '$ordrearrive' AND ordre < '$ordredepart'";
                    SQLUpdate($SQL);
                }
            }

            // avant de changer
            // l'ordre du paragraphe concerné
            $SQL = "UPDATE paragraphes SET ordre = '$ordrearrive' WHERE id='$id'";
            SQLUpdate($SQL);

        // Il faudrait propager les modifications aux paragraphes du client :
        // On renvoie TOUT en ne mettant pas BREAK,
        // ce qui active le traitement du cas dessous

        // TODO: il faudrait faire une fonction !

        // break;

        case "getPFromA" :
            // Renvoie tous les paragraphes de la base de données associé à l'article en question
            if (isset($_GET["article"])) $contenu = $_GET["article"];

            $SQL = "SELECT p.* FROM paragraphes p, articles a, articles_paragraphes ap WHERE p.id = ap.id_paragraphe AND ap.id_article = a.id AND a.id = '$contenu' ORDER BY ordre ASC";
            $res = parcoursRs(SQLSelect($SQL));
            $data["feedback"] = "ok";
            $data["paragraphes"] = $res;
            break;

        case "getA" :
            // Renvoie tous les articles de la base de données
            $SQL = "SELECT * FROM articles";
            $res = parcoursRs(SQLSelect($SQL));
            $data["feedback"] = "ok";
            $data["articles"] = $res;
            break;

        // id, name
        case "addA" :
            // Ajoute un Article et renvoie son identifiant

            $name= false;
            if (isset($_GET["name"])) $name = $_GET["name"];

            if ($name) {
                $SQL = "INSERT INTO articles(name) VALUES ('$name')";
                $nextId = SQLInsert($SQL);
                $data["feedback"] = "ok";
                $data["id"] = $nextId;
            }
            break;

        case "updateA" :
            // Modifie un A. dont le nom est passé en paramètre
            if (isset($_GET["name"])) $name = $_GET["name"];
            if (isset($_GET["id"])) $id = $_GET["id"];

            if ($id && $name) {
                $SQL = "UPDATE articles SET name='$name' WHERE id='$id'";
                SQLUpdate($SQL);
                $data["feedback"] = "ok";
            }
            break;

        case "delA" :
            // Supprime un Article via son identifiant
            if (isset($_GET["id"])) $id = $_GET["id"];
            if ($id) {
                $SQL = "DELETE FROM articles WHERE id='$id'";
                SQLUpdate($SQL);
                $data["feedback"] = "ok";
            }
        // id_article, id_paragraphe
        case "addPinA" :
            // Ajoute la paragraphe dans la table articles_paragraphes
            // Permet d'associer le paragraphe à l'article
            if (isset($_GET["id_article"])) $id_article = $_GET["id_article"];
            if (isset($_GET["id_paragraphe"])) $id_paragraphe = $_GET["id_paragraphe"];

            if ($id_article && $id_paragraphe) {
                $SQL = "Insert INTO articles_paragraphes (id_article, id_paragraphe) Values ('$id_article', '$id_paragraphe')";
                $nextId = SQLInsert($SQL);
                $data["feedback"] = "ok";
                $data["id"] = $nextId;
            }
            break;
    }}

echo json_encode($data);
?>

