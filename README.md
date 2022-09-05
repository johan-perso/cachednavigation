# CachedNavigation.js

*inspiré de [nextjs](https://nextjs.org/learn/basics/navigate-between-pages/client-side)*

Précharge les liens présents sur votre site, afin de changer de page instantanément.

⚠️ Ne fonctionne pas sur les liens externes à votre domaine.

### Exemple

Demo : https://cachednavigation.johanstick.me/1.html

### Utilisation (HTML)

C'est simple, rajouter une ligne dans votre balise `<head>` pour importer la librarie :
```html
<script src="https://cdn.jsdelivr.net/gh/johan-perso/cachednavigation@1.1.1/index.js"></script>
```

Et sur votre page, utiliser la balise `<a>` :
```html
<a href="/">Accueil</a>
```

### Utilisation (JavaScript)

*pensez à importer la librairie dans votre balise `<head>`*

```js
// Précharger la page
prefetch('/faq')

// Naviguer vers la page
changePage('/faq')
```


### Notes additionnelles

Au chargement de la page, toutes les balises `<a>` sont automatiquement analysés et préchargés. Cette analyse s'applique également en temps réel sur les nouvelles balises ajoutés dynamiquement.

Lors d'un changement de page, si celle-ci n'a pas pu être préchargé, le changement sera fait par le navigateur.

Le changement de page par le cache remplace le contenu du body par celui qui est dans le cache, ce qui fait que le reste de la page (`<head>`, `<html>`, ...) ne changeront pas.


## Licence

MIT © [Johan](https://johanstick.me)
