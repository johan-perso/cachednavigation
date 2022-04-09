/*
©️ Johan le stickman - 2022
https://github.com/johan-perso/cachednavigation

Notes additionnelles :
	- Seul le contenu du body est remplacé (y compris les attributs du body, telle que les classes)
	- Les balises situés dans le head (title, meta, ...) ne sont pas modifiés lors d'un changement de page
	- Les liens externes (en dehors du domaine principal) ne sont pas affectés
	- Seul les liens avec balise "a" sont affectés, la fonction `changePage(url)` peut également être utilisé
*/


// Préparer les pages chargés dans le cache
var pageCached = []

// Construire un DOMParser
var DOMParser = new DOMParser();

// Fonction pour changer de page à partir d'une page chargé dans le cache
async function changePage(url){
	// Si la page n'est pas dans le cache
	if(!pageCached.find(p => p.href == url)) return window.location.href = url;

	// Récupérer la page du cache
	var page = pageCached.find(p => p.href == url);
	page = page?.page;

	// Afficher la page
	document.body.outerHTML = page;
	window.scrollTo(0, 0)

	// Si la page n'est pas du HTML
	if(!page.startsWith('<body')) return window.location.href = url;

	// Modifier l'URL
	history.pushState({}, '', url);

	// Vérifier tout les liens
	checkAllLink();
}

// Détecter quand on retourne en arrière
window.addEventListener('popstate', function(e){
	// Récupérer l'URL
	var url = location.href;

	// Afficher la page
	changePage(url);
});

// Fonction pour prefetch une page
async function prefetch(url){
	// Vérifier si la page est déjà dans le cache
	if(pageCached.find(p => p.href == url)) return false;

	// Fetch la page et ne prendre que l'intérieure de la balise body
	var response = await fetch(url);
	var page = await response.text();
	if(page.startsWith('<!DOCTYPE html>')) page = DOMParser.parseFromString(page, 'text/html').body.outerHTML;

	// Ajouter la page dans le cache
	pageCached.push({
		href: url,
		page: page
	});

	return true;
}

// Fonction pour vérifier tout les liens dans la page
async function checkAllLink(){
	// Mettre dans le cache la page actuelle
	await prefetch(location.href);

	// Obtenir la liste des balises a dans la page
	const links = document.querySelectorAll('a');

	// Pour chaque balise a
	for (var link of links){
		// Obtenir l'attribut href de la balise
		var href = link.getAttribute('href');
		if(!href) continue;

		// Si la page n'est pas sur le même (sous)domaine que la page courante, ignorer
		if(href.startsWith(`http://${window.location.host}`) || href.startsWith(`https://${window.location.host}`) || href.startsWith(`/`) || (!href.startsWith('http') && !href.startsWith('https') && !href.startsWith('#') && !href.startsWith('/') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:'))){} else continue;

		// Modifier l'attribut href
		link.setAttribute('href', `javascript:changePage('${href.replace(/\//g, '\\/')}')`);

		// Prefetch la page et la mettre dans le cache
		prefetch(href)
	}
}

// Quand la page finit de charger
document.addEventListener('DOMContentLoaded', async () => {
	checkAllLink()
})

// Dès qu'une balise a est ajouté dans le DOM
document.addEventListener('DOMNodeInserted', async (e) => {
	// Si la balise a est une balise a
	if(e.target.tagName == 'A'){
		// Obtenir l'attribut href de la balise
		var href = e.target.getAttribute('href');
		if(!href) return;

		// Si la page n'est pas sur le même (sous)domaine que la page courante, ignorer
		if(href.startsWith(`http://${window.location.host}`) || href.startsWith(`https://${window.location.host}`) || href.startsWith(`/`) || (!href.startsWith('http') && !href.startsWith('https') && !href.startsWith('#') && !href.startsWith('/') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:'))){} else return;

		// Modifier l'attribut href
		e.target.setAttribute('href', `javascript:changePage('${href.replace(/\//g, '\\/')}')`);

		// Prefetch la page et la mettre dans le cache
		prefetch(href)
	}
})