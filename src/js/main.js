



// juste une fonction pour renvoyer un nombre aléatoire
// entre un interval passé en paramètre
function rand(max, min){

	return Math.floor(Math.random() * (max - min +1)) + min;
}

function game(){

	
	// on initialise les points à 10
	this.points = 10;
	
	// la fonction qui va nous permettre de récupérer
	// la liste de mot français depuis le fichier txt,
	// et renvoyer un objets contenant tout les mots
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
	// la fonction qui va nous permettre de récuper
	// la traduction du mot en anglais via l'api Bing translator
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

			
	// on déclare la fonction qui nous permettra de récupérer
	// un objet contenant le mot en français et sa traduction
	// associée	
	this.getRandWords = function (){
		
		do{
			
			this.fr = this.frWords[rand(this.frWords.length,0)];
			this.getEnWord();

		}while (this.en.length==0 || this.fr==this.en)		
	}	

	this.update = function(){
		
		// si on gagne
		if (game.points >= 20){

			$('.verify').css('display', 'none');
			$('.replay').css('display', 'inline-block');
			$('.progressBar').width(this.points/20*100+'%');		
		}
		
		// si on perd 
		else if (game.points <= 0){

			$('.verify').css('display', 'none');
			$('.replay').css('display', 'inline-block');
			$('.progressBar').width(this.points/20*100+'%');
		}

		// si le jeu continu
		else{

			// on selectionne un nouveau mot à traduire avec 
			// sa traduction
			word = game.getRandWords();

			$('.progressBar').width(game.points/20*100+'%');
			$('.french').html(this.fr);
			this.hideWord();
		}

		// et on efface le contenu de la class answer pour
		// éviter à l'utilisateur de le faire
		$('.answer').val('');
	}

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

	this.verify = function(){

		var txt = '';
		for (var i = 0; i < this.en.length-1; i++) {
			txt = txt + this.en[i];
		}

		
		if ($('.answer').val() == txt){
			$('.showAnwser').html('Bonne réponse :)');
			this.points++;
		}			
		
		else{
			$('.showAnwser').html('La réponse était : <br> '+this.en);
			this.points--;
		}

		setTimeout(function(){

			$('.showAnwser').html('');
		},1500);
	}
}

// On vérifie si le mot entré (enter) correspond
// à la traduction (correction)
// et on actualise le nombre de points en fonction
// du résultat

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


$('.replay').click(function(){

	game.points=10;
	game.update();
	$('.replay').css('display', 'none');
});


var game = new game();
game.update();
