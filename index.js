/*
©️ Johan le stickman - 2022
https://github.com/johan-perso/cachednavigation
v1.1

Notes additionnelles :
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
	body = page?.body;

	// Afficher la page
		// Remplacer le body
		document.body.outerHTML = body;

		// Remplacer le head si il est différent de l'ancien
		if(page?.head != document?.head?.outerHTML) document.head.outerHTML = page?.head;

		// Scroll vers le 0, 0
		window.scrollTo(0, 0)

		// Enlever les head vide
		Array.from(document.querySelectorAll('head')).filter(h => h.childNodes.length == 0).forEach(h => h.remove());

	// Si la page n'est pas du HTML
	if(!body.startsWith('<body')) return window.location.href = url;

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
	if(page.startsWith('<!DOCTYPE html>')) body = DOMParser.parseFromString(page, 'text/html').body.outerHTML;
	if(page.startsWith('<!DOCTYPE html>')) head = DOMParser.parseFromString(page, 'text/html').head.outerHTML;

	// Ajouter la page dans le cache
	pageCached.push({
		href: url,
		body: body,
		head: head
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
