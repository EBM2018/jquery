var _request = false;
var _fnCb = null; 

function enrichir(objetModele, objetModifications) {
	var oRes = {}; 
	for (prop in objetModele) {
		if (objetModifications[prop] != undefined)
			oRes[prop] = objetModifications[prop]; 
		else 
			oRes[prop] = objetModele[prop]; 
	}
	return oRes; 
}

// TODO:
// produire un handler 'ajax' pour la fonction envoiRequete 
// Il admettra un paramètre sous forme de JSON
// Type & callback seront facultatifs
// Les données seront passées par json également, par exemple {''debutNom'':''T''} au lieu de «debutNom=T». 
var oAjaxCfg = {
	url : "", 
	data : {}, 
	callback : function(e){console.log("Recu : " + e);},
	type:"GET"	
}
function ajax(oParams) {
	// paramètres dans oParams : 
	// type[GET], data[{}], url, callback[function(){}]
	// data est passé aussi au format json 
	var cfg = enrichir(oAjaxCfg,oParams); 
	var donnees = ""; 
	for (cle in cfg.data) {
		// Création du QS...  
		donnees += "&" + cle + "=" + encodeURIComponent(cfg.data[cle]);
	}
	donnees = donnees.substr(1);
	// methode substr(debut, [longueur]) extrait une sous-chaine
	console.log("donnees : " + donnees);
	envoiRequete(cfg.type,cfg.url,donnees,cfg.callback); 
}

// Attention : on ne peut faire qu'une seule requête à la fois
function envoiRequete(type,url,donnees,callback)
{
	_request = new XMLHttpRequest(); 
	_fnCb = callback;

	if (type=='GET') 
	{
		_request.open("GET", url+"?"+donnees, true);
		donnees=null;
	}
	else 
	{
		_request.open("POST", url, true);
		_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		/*
		// provoque des erreurs sous Windows...
		_request.setRequestHeader("Content-length", donnees.length);
		_request.setRequestHeader("Connection", "close");
		*/
	}

	_request.onreadystatechange = traiteReponse;
	_request.send(donnees);
}

function traiteReponse()
{
	// alert(_request.readyState); // A décommenter...
	if (_request.readyState == 4) 
	{
	    if (_request.status == 200) 
	    {
			var donnee = _request.responseText;
			_fnCb(donnee); 
	    }
	}
} 

console.log("librairie ajax chargee");
