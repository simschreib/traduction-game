Pour lancer l'application copier le répertoire et double cliquez sur index.html.

Liste des Fonction : 

function getEnWord(word) : 
	retourne la traduction du mot demandé

function getFrWords() : 
	sélectionne tout les mots listé dans le fichier txt en objet

function rand(max, min) 
	une fonction permettant de renvoyer un entier aléatoire dans un
	interval donné via les paramètres

function game() : 
	le prototype qui va contenir la liste des mots français, le nombre de point
	et une fonction : 
		getRandWords qui va nous permettre de nous renvoyer un mot aléatoire français, 
		parmis les mots stockés, avec sa correspondance en anglais. 

function hideWord(word) : 
	remplace toutes les lettre du mot anglais sauf la première de chaque mots par : '-'

function verify(enter, correction, points) : 
	fonction qui va vérifier si le mot saisi par l'utilisateur (enter) 
	correspond à la traduction (correction) et actualise le nombre de points.

function update() : 
	va vérifier l'état de jeu et chargé et on va affecter à la variable globale word 
	un nouvel objet contenant le mot français et ça traduction. 
	En cas de victoire ou de perte la fonction affichera le bouton rejouer.
	La fonction update affiche aussi la réponse en cas d'erreur ou un message 
	encourageant en cas de bonne réponse

On écoute les évènement :

au clic

	$('.verify').click(function(){

		verify($('.answer').html(), word.en, game.points)
		update();
	});

ou en appuyant sur la touche entrée :

	$(document).keypress(function(e) {

	    if(e.keyCode === 13) {

	    	verify($('.answer').html(), word.en, game.points)
			update();
		}
	});

on vérifie la réponse et on actualise l'état de jeu.


pour rejouer on remet les points à 10
et on actualise, sans oublié de faire disparaitre
le bonton rejouer

	$('.replay').click(function(){

		game.points=10;
		update();
	});

On itinialise le jeu

	var game = new game;
	update();




