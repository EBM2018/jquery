<?php

include("config.php");
// penser à maj le nom de la base et le mot de passe
include("maLibSQL.pdo.php");
$SQL = "SELECT * FROM paragraphes ORDER BY ordre ASC";
$res = parcoursRs(SQLSelect($SQL));
$data["feedback"] = "ok";
$data["paragraphes"] = $res;


$SQL1 = "SELECT ordre FROM paragraphes ORDER BY ordre ASC";
$res1 = parcoursRs(SQLSelect($SQL1));
$data1["feedback"] = "ok";
$data1["paragraphes"] = $res1;
?>

