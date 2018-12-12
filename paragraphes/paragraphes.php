<?php

include("config.php");
// penser à maj le nom de la base et le mot de passe
include("maLibSQL.pdo.php");
//var $dat = 0;
$SQL = "SELECT * FROM paragraphes ORDER BY ordre ASC";
$res = parcoursRs(SQLSelect($SQL));
$data["feedback"] = "ok";
$data["paragraphes"] = $res;


foreach ($data as $dat) {
    echo $dat;
}