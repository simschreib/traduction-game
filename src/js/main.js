function rand(max, min){

	return Math.floor(Math.random() * (max - min +1)) + min;
}

function game(){

	this.points = 10;
	
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

	this.getRandWords = function (){
		
		do{
			
			this.fr = this.frWords[rand(this.frWords.length,0)];
			this.getEnWord();

		}while (this.en.length==0 || this.fr==this.en)		
	}	

	this.update = function(){

		if (game.points >= 20){

			$('.verify').css('display', 'none');
			$('.replay').css('display', 'inline-block');
			$('.progressBar').width(this.points/20*100+'%');		
		}
		

 		else if (game.points <= 0){

			$('.verify').css('display', 'none');
			$('.replay').css('display', 'inline-block');
			$('.progressBar').width(this.points/20*100+'%');
		}


		else{

			game.getRandWords();

			$('.progressBar').width(game.points/20*100+'%');
			$('.french').html(this.fr);
			this.hideWord();
		}

		$('.answer').val('');
	}

	this.hideWord = function(){


		this.txt = this.en[0];
		
		for (var i = 1; i < this.en.length-1 ; i++) {
			if(this.en[i]==' '){

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
