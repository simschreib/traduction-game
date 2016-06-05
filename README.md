
Installation :

	Copier le répertoire et ajoutez le dans le fichier www de votre serveur


Temps estimé de réalisation : 

	6h 6h30

Points à améliorer : 

	- Empécher l'utilisateur de tricher en utilisant la console.
	Pour se faire il faudrait récupérer ses données depuis un serveur

	- Améliorer les traductions : certaines sont en plusieurs mots ou trop similaires 
	par rapport aux Français. Solution faire une vérification plus poussée des mots rendus.
	Problème : augmente le nombre de requètes soumit à l'API




LE CODE : 




Contient le mot en anglais : 

	this.en

Contient le mot en français : 

	this.fr

Contient la liste des mots français :

	this.frWords

Une fonction pour renvoyer un nombre aléatoire
entre un interval passé en paramètre

	function rand(max, min){

		return Math.floor(Math.random() * (max - min +1)) + min;
	}

Notre Prototype

	function game(){

on initialise les points à 10

	this.points = 10;
	
la fonction qui va nous permettre de récupérer
la liste de mots français depuis le fichier txt,
et renvoyer un objet contenant tout les mots

	this.getFrWords = function () {

	    var result="";	
	    var promise = $.ajax({

			url: 'src/txt/verbe-2.txt',
			async: false,    
	   });    

	    promise.done(
	    	function (data){         	
	      	result = data;
	    });

	   this.frWords = result.split("\n");   
	}

	this.getFrWords();

la fonction qui va nous permettre de récuper
la traduction du mot en anglais via l'api Bing translator

	 this.getEnWord = function() {

	    var result="";
	    var p = {};
		p.appid = '68D088969D79A8B23AF8585CC83EBA2A05A97651';
		p.to = 'en';
		p.from = 'fr';
		p.text = this.fr ;
		
	    var promise = $.ajax({

			url: 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate',
			data: p,
	        async: false,
	        dataType: 'json',
	      
	   });    

	    promise.done(
	    	function (data){         	
	      	result = data;
	      	
	    });
		
		promise.fail(
	    	function (){         	
	      	result = getWords();
	    });

	   this.en= result.toLowerCase();
	  
	}

			
on déclare la fonction qui nous permettra de définir le mot français et sa traduction associée	

	this.getRandWords = function (){
		
		do{
			
			this.fr = this.frWords[rand(this.frWords.length,0)];
			this.getEnWord();

		}while (this.en.length==0 || this.fr==this.en)		
	}	


La fonction qui va actualiser les données

	this.update = function(){
		
si on gagne on affiche le bouton rejouer et enlève le bouton vérifier

		if (game.points >= 20){

			$('.verify').css('display', 'none');
			$('.replay').css('display', 'inline-block');
			$('.progressBar').width(this.points/20*100+'%');		
		}
		
si on perd on affiche le bouton rejouer et enlève le bouton vérifier

		else if (game.points <= 0){

			$('.verify').css('display', 'none');
			$('.replay').css('display', 'inline-block');
			$('.progressBar').width(this.points/20*100+'%');
		}

si le jeu continu

		else{

			// on selectionne un nouveau mot à traduire avec 
			// sa traduction
			word = game.getRandWords();

			$('.progressBar').width(game.points/20*100+'%');
			$('.french').html(this.fr);
			this.hideWord();
		}

et on efface le contenu de la class answer pour
éviter à l'utilisateur de le faire

		$('.answer').val('');
	}

La fonction qui va remplacer chaque lettre par un '-'
excepté pour la première lettre de chaque mot

	this.hideWord = function(){


		this.txt = this.en[0];
		
		for (var i = 1; i < this.en.length-1 ; i++) {
			if(this.en[i]==' '){

			 	// au cas ou la traduction est en deux mots
			 	// on est sympa et on lui donne la première
			 	//lettre du second mot
			 	this.txt = this.txt + ' ' +  this.en[i+1]
			 	i++;
			}
			 		
			 else
			 	this.txt = this.txt + '-';
		}
		$('.english').html(this.txt)
	}

La fonction qui va vérifier si on a rentré la bonne réponse

	this.verify = function(){

		var txt = '';
		for (var i = 0; i < this.en.length-1; i++) {
			txt = txt + this.en[i];
		}

Il a trouver donc on rajoute un point à son score
et on lui met un petit message motivant		

		if ($('.answer').val() == txt){
			$('.showAnwser').html('Bonne réponse :)');
			this.points++;
		}			
Il mal répondu donc on lui affiche la réponse	

		else{
			$('.showAnwser').html('La réponse était : <br> '+this.en);
			this.points--;
		}
Et au bout de 1.5s on supprime ce que l'on a affiché

		setTimeout(function(){

			$('.showAnwser').html('');
		},1500);
	}
}

Au clic ou en appuyant sur la touche entrée on valide notre réponse

	$('.verify').click(function(){

		game.verify();
		game.update();
	});


	$(document).keypress(function(e) {

	    if(e.keyCode === 13) {

	    	game.verify();
	    	game.update();
		}
	});

Au clic on relance la partie et on enlève le bouton rejouer

	$('.replay').click(function(){

		game.points=10;
		game.update();
		$('.replay').css('display', 'none');
	});

Et on lance le jeu 

	var game = new game();
	game.update();
