
// la fonction qui va nous permettre de récuper
// la traduction du mot en anglais via l'api Bing translator
function getEnWord(word) {

    var result="";
    var p = {};
	p.appid = '68D088969D79A8B23AF8585CC83EBA2A05A97651';
	p.to = 'en';
	p.from = 'fr';
	p.text = word ;
	
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

   return result;
}

// la fonction qui va nous permettre de récupérer
// la liste de mot français depuis le fichier txt,
// et renvoyer un objets contenant tout les mots
function getFrWords() {

    var result="";
    
	
    var promise = $.ajax({

		url: 'src/txt/verbe-2.txt',
		async: false,    
   });    

    promise.done(
    	function (data){         	
      	result = data;
    });

   var tab = result.split("\n");   
   return tab;
}

// juste une fonction pour renvoyer un nombre aléatoire
// entre un interval passé en paramètre
function rand(max, min){

	return Math.floor(Math.random() * (max - min +1)) + min;
}

function game(){

	// on récupère tout les mots français
	this.frWords = getFrWords();
	// on initialise les points à 10
	this.point = 10;
	var frWords = this.frWords;
	
	// on déclare la fonction qui nous permettra de récupérer
	// un objet contenant le mot en français et sa traduction
	// associée	
	this.getRandWords = function (){
		
		do{
			var word = {};
			word.fr = frWords[rand(frWords.length,0)];
			word.en = getEnWord(word.fr);

		}while (word.en.length==0 && word.fr!=word.en)

		 return word;
		
	}
	
}

// la fonction qui va nous permettre de masquer les lettres
function hideWord(word){
	var txt = word[0];
	for (var i = 1; i < word.length; i++) {
		if( word[i]==' '){

		 	// au cas ou la gameuction est en deux mots
		 	// on est sympa et on lui donne la première
		 	//lettre du second mot
		 	txt = txt + ' ' +  word[i+1]
		 	i++;
		}
		 		
		 else
		 	txt = txt + '-';
	}; 
	return txt;
}

// On vérifie si le mot entré (enter) correspond
// à la traduction (correction)
// et on actualise le nombre de points en fonction
// du résultat
function verify(enter, correction, points){

		if (enter == correction){

			$('.showAnwser').html('Bonne réponse :)');
			points++;
		}
			
		
		else{
			$('.showAnwser').html('La réponse était : <br> '+correction);
			points--;
		}

		setTimeout(function(){

			$('.showAnwser').html('');
		},1500);
		
		game.points = points;
}


function update(){

	// si on gagne
	if (game.points >= 20){

		$('.verify').css('display', 'none');
		$('.replay').css('display', 'inline-block');
		$('.progressBar').width(game.points/20*100+'%');		
	}
	
	// si on perd 
	else if (game.points <= 0){

		$('.verify').css('display', 'none');
		$('.replay').css('display', 'inline-block');
		$('.progressBar').width(game.points/20*100+'%');
	}

	// si le jeu continu
	else{

		// on selectionne un nouveau mot à traduire avec 
		// sa traduction
		word = game.getRandWords();

		$('.progressBar').width(game.points/20*100+'%');
		$('.french').html(word.fr);
		$('.english').html(hideWord(word.en));
	}

	// et on efface le contenu de la class answer pour
	// éviter à l'utilisateur de le faire
	$('.answer').val('');
}

$('.verify').click(function(){

	verify($('.answer').html(), word.en, game.points)
	update();
});


$(document).keypress(function(e) {

    if(e.keyCode === 13) {

    	verify($('.answer').html(), word.en, game.points)
		update();
	}
});


$('.replay').click(function(){

	game.points=10;
	update();
});


var game = new game;
update();
