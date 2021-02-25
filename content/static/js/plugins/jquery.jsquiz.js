(function( $ ) {
  $.fn.jsQuiz = function(options) {

	//presets
	var settings = {
		firstQuestion	: 0,
		buttonText		: 'Bitte geben Sie eine Antwort ein',
		errorText		: 'Bitte geben Sie eine gültige Zahl ein!',
		buttonTextForw	: 'weiter',
		srcPath			: '/static/projekte/jsquiz/',
		classInput		: '.inputarea',
		elInput			: '',
		elAnswer		: '.answers',
		elButton		: '.submitbutton',
		elQuestion		: '.question',
		elNumber		: '.questionNumber',
		elResult		: '.result',
		elNew			: '.restart',
		elError			: '.error',
		elImage			: '.image',
		givenAnswer		: '',
		debug			: false,
		createQuestion	: function( questionId, data ){
		//function for appending question

			var imageSrc = window.www_root + settings.srcPath + 'images/';

			//empty div and append question
			settings.elQuestion.empty();
			settings.elImage.empty();
			settings.elAnswer.empty();

			settings.elQuestion.append( "<p>" + data[questionId].body.question + "</p>" );

			//define answertypes
			var ansFree = data[questionId].body.answers.freeLabels;
			var ansRadio = data[questionId].body.answers.radioLabels;
			var ansCheck = data[questionId].body.answers.checkLabels;
			var position = data[questionId].body.positionLabel;
			var img = data[questionId].image.source;
			var credit = data[questionId].image.credit;
			var html = '';

			//form input according to format of question
			$.each( ansRadio, function( index, value ){
				html = html + "<p class='answer'><input type='radio' class='inputarea' name='" +questionId+ "' value='" +index+ "' id='" + index + "'/><label for='"+index+"'>" +value+ "</label></p>";
			});

			if (position === 'before'){
				$.each( ansFree, function(index, value){
					html = html + "<label>" + value + "</label><input type='text' class='inputarea'/>";
				});
			}
			else if (position === 'beforeafter'){
				html = html + "<label>" + ansFree[0] + "</label><input type='text' class='inputarea'/><label>" + ansFree[1] + "</label>";
			}
			else{
				$.each( ansFree, function(index, value){
					html = html + "<input type='text' class='inputarea'/><label>" + value + "</label>";
				});
			}


			$.each( ansCheck, function(index, value){
				html = html + "<p class='answer'><input type='checkbox' class='inputarea' name='" +questionId+ "' value='" +index+ "'/><label>" +value+ "</label></p>";
			});

			//default if no labels are set
			if( html === ''){
				html = "<input type='text' class='inputarea'/>";
			}

			if(img.length > 0){
				settings.elImage.append( "<p class='copyright'>" + credit + "</p><img src='" + imageSrc + img + "'/>" );
			}

			//append html
			settings.elAnswer.html('<span>Ihre Antwort:&nbsp;</span>' + html);
			settings.elInput	= quizDiv.find( settings.classInput );
		},
		testForCorrectAnswer: function ( correctAnswer , array){
			// return true/false 
			var fieldOne = (settings.elInput).first().val().replace(/^0+/,'');
			var fieldTwo = $(settings.elInput).eq(1).val();
			var givenAnswer = '';

			//prepare givenAnswer
			if (typeof fieldTwo === "undefined"){
				givenAnswer = fieldOne;
			}else{
				givenAnswer = fieldOne + "," + fieldTwo;
			}

			settings.givenAnswer = givenAnswer;

			if( array === true){
					if ( $.inArray(givenAnswer, correctAnswer) > -1){
						return(true);
					}else{
						return(false);
					}
				}else{
					return( givenAnswer == correctAnswer );
				}
		},
		prepareCheckboxResults: function(){

			var givenAnswer = '';

			settings.elInput.each( function(){

				if( this.checked ){
					givenAnswer += ',' + $(this).val();	
				}
	
			});

			return( givenAnswer.substr(1) );

		},
		evaluateQuestion : function( questionId, data ){

			var correctAnswer = data[questionId].correct_answer,
				correct = false,
				type = data[questionId].type;

			settings.givenAnswer = '';

			//switch (type) radio/check/several ; Standard: free
			switch (type){
				case "radio" :
				//for radio answers
					correctAnswer = data[questionId].body.answers.radioLabels[correctAnswer];
					settings.givenAnswer = data[questionId].body.answers.radioLabels[settings.prepareCheckboxResults()];
					correct = ( correctAnswer == settings.givenAnswer );

					break;
				case "check" :
				//for checkbox answers

					var indexes = settings.prepareCheckboxResults();
					var correctAnswerString = '';
					
					$.each( indexes.split(','), function( index, value){
						settings.givenAnswer += ',' + data[questionId].body.answers.checkLabels[value];	
					});

					$.each(correctAnswer, function (i){
						correctAnswerString += ',' + data[questionId].body.answers.checkLabels[correctAnswer[i]];
					});

					settings.givenAnswer = settings.givenAnswer.substr(1);
					correct = ( settings.givenAnswer == correctAnswerString.substr(1) );
					break;
				case "fraction" :
				//for ecspecially complicated long fraction answers
					correct = true;
					var fracArray = [];

					$.each( settings.elInput, function( index, value ){
						if( index%2 == 0 ){
							fracArray[fracArray.length] = $(value).val();
						}else{
							var lastEl = fracArray.length - 1;
							fracArray[lastEl] = fracArray[lastEl] + "/" + $(value).val();
						}
					})

					$.each( correctAnswer, function( index, value ){
						if( value.toString().indexOf( fracArray[index] ) == -1){
							correct = false;
						}
					})

					settings.givenAnswer = fracArray.join(" ");
					break;	
				case "several" :
				//for answers with several possibilities (correctAnswer is an Array here)
					correct = settings.testForCorrectAnswer( correctAnswer, true );
					break;
				case "noresult" :
				//for answers that are always true
					settings.testForCorrectAnswer( correctAnswer );
					correct = true;
					break;
				default :
				// for everything else
					correct = settings.testForCorrectAnswer( correctAnswer.join( "," ) );
			}
	
			//define output element
			output[questionId] = {
				qId : data[questionId].id,
				question : data[questionId].body.question,
				correctAnswer : data[questionId].displayAnswer,
				percentageCorrect : data[questionId].percentageCorrect,
				givenAnswer : settings.givenAnswer,
				correct : correct,
				freeLabels: data[questionId].body.answers.freeLabels
			};

		},
		buttonFunction : function( nextQuestion ){

			settings.elButton.show();

			//prepare button for next question
			settings.elButton.attr( "disabled", "disabled" );
			settings.elButton.text( settings.buttonText );
			settings.elButton.attr( "data-question", nextQuestion );

			//enable button when input box is clicked 
			settings.elInput.bind( "click keydown", function(){
				settings.elButton.removeAttr( "disabled" );
				settings.elButton.text( settings.buttonTextForw );
			});

			//disable button when no input is given
			settings.elInput.focusout( function() {

				var show = true;

				$.each( settings.elInput, function( index, value ){
					if( $( value ).val().length === 0 ){
						show = false;
					}
				});

				if ( show === false ){
					settings.elButton.attr( "disabled", "disabled" );
					settings.elButton.text( settings.buttonText );
				}
			});
		},
		addNumber : function( questionNumber, questionLength ){

			//function for adding question numbers
			var correctNumber = questionNumber + 1;

			if( questionNumber != questionLength){
				var text = "Frage " +correctNumber+ " von " +questionLength;
			}else{
				var text = "Auflösung";
			}

			if(settings.format === 'fullpage'){
				$( ".articleheader" ).find( ".supertitle" ).html( text );
			}else{
				settings.elNumber.html( text );
			}

		},
		buildBar : function(text, correct){

			correct = Math.ceil( parseInt(correct,10));
			var incorrect = Math.ceil(100 - correct);

			settings.elQuestion.append("<p>" +text+ "</p>");

			var bar = 	'<div class="bar">'
						+ '<div class="innerbar clearfix">'
						+ '<div class="correct" style="width: ' +correct+ '%">&nbsp;</div>'
						+ '<div class="incorrect" style="margin-left: ' +(correct+1)+ '%">&nbsp;</div>'
						+ '</div>'
						+ '<div class="outerbar clearfix">'
						+ '<div class="correct" style="width: ' +correct+ '%">'+correct+'%</div>'
						+ '<div class="incorrect" style="margin-left: ' +(correct+1)+ '%">' +incorrect+ '%</div>'
						+ '</div></div>';

			settings.elQuestion.append( bar );
		},
		showResult : function(){
			
			//function to show result
			var result = {};

			settings.elButton.hide();

			var answerString = '';
			var userResult = {
				correct: 0,
				incorrect: 0
			}

			$.each(output, function( index, value ){

					if (value.correct){
						answerString += "1";
						userResult.correct += 1;
					}else{
						answerString += "0";
						userResult.incorrect += 1;
					}
			});

			var userUrl = 'http://phpscripts.zeit.de/mathetest/api.php';

			if (settings.debug){
				userUrl +='?debug';
			}else{
				userUrl +='?answer=' + answerString + '&callback=?';
			}

			$.getJSON(userUrl, function(data) {

				if(data) {
					result = data[0];

					var numberQuestions = userResult.correct + userResult.incorrect;
					var percentageUserResult = Math.ceil(((userResult.correct * 100)/numberQuestions));

					settings.buildBar("Herzlichen Glückwunsch. Sie haben "+userResult.correct+" von "+ numberQuestions + " Fragen richtig beantwortet.", percentageUserResult);
					settings.buildBar("Der Durchschnitt der ZEIT-ONLINE-Leser liegt bei " + Math.ceil(parseInt(result.avg,10)) + "% richtiger Antworten.", result.avg);
					settings.buildBar("In der Studie der Stiftung Rechnen, der Wochenzeitung DIE ZEIT, Forsa und den Universitäten Halle-Wittenberg und des Saarlandes wurden im Durchschnitt " +overallScore+ " der Aufgaben richtig berechnet.", overallScore);
					 
					var html = '';

					$.each( output, function( index, value ){
				
						html += "<div class='antwortstats'><p><strong> Frage " + value.qId + ": </strong>" + value.question + "</p>"
							  + "<p>Richtige Antwort: <span class='text_true'>" + value.correctAnswer + " </span>";

						if(value.correct){
							html += "<span class='but_true'>richtig</span></p>";
						}else{
							html += "</p><p>Ihre Antwort: <span class='text_false'>" + value.givenAnswer + " </span>" + "<span class='but_false'>falsch</span></p>";
						}

						html += "<p>" + result.answers[index] + "% der ZEIT ONLINE-Leser und " + value.percentageCorrect +" der Bundesbürger haben diese Frage richtig beantwortet.</p>";
						html += '</div>';
					});

					settings.elResult.html(html);

					//modify facebook metadata
					$( 'meta[property="og:title"]' ).attr( "content", "Der große ZEIT-Mathetest: Ich habe " +userResult.correct+ " von " +numberQuestions+ " Fragen beim großen ZEIT-Mathetest richtig beantwortet. Wie gut rechnest du?" );
				}

			});
		}
	};

	if( options ){
		$.extend( settings, options );
	}

	//define plugin div and output object
	var quizDiv = this;
	var output = {};

	if( settings.type ){

		var jsonSrc = window.www_root + settings.srcPath + 'json/' + settings.type + ".json";
		var overallScore = 0;

		//getJSON
		$.getJSON( jsonSrc, function (data){

			var backlink = window.location.origin + window.location.pathname;

			//set basic html structure
			var html =	'<div class="question"></div>'
						+'<div class="image"></div>'
						+'<p class="error"></p>'
						+'<p class="answers"></p><br>'
						+'<div class="bottom"><p class="inputleft"><a class="restart" href="' +backlink+ '" name="neu">Neu beginnen</a></p>'
						+'<p class="inputright"><button class="submitbutton" data-question="0"></button></p></div>'
						+'<div class="result"></div>';

			quizDiv.append( html );
			quizDiv.addClass( "quiztool" );

			//set classes
			settings.elAnswer	= quizDiv.find( settings.elAnswer );
			settings.elButton	= quizDiv.find( settings.elButton );
			settings.elQuestion	= quizDiv.find( settings.elQuestion );
			settings.elNumber	= quizDiv.find( settings.elNumber );
			settings.elResult	= quizDiv.find( settings.elResult );
			settings.elNew		= quizDiv.find( settings.elNew );
			settings.elError	= quizDiv.find( settings.elError );
			settings.elImage	= quizDiv.find( settings.elImage );

			var questionLength = data.questions.length;
			overallScore = data.correctOverall;

			settings.elNew.bind( "click", function(){

				settings.elResult.empty();

				//create first question and set button behaviour (disabled/enabled)
				settings.createQuestion( settings.firstQuestion, data.questions );
				settings.addNumber( settings.firstQuestion, questionLength );
				settings.buttonFunction( settings.firstQuestion );

				settings.firstQuestion = 0;
			});

			settings.elNew.trigger( "click" );

			//click-function for button
			$( ".submitbutton" ).bind( "click", function(){

				//call ivw/ webtrekk/ ga tracking
				if( typeof ZEIT !== "undefined" ) { ZEIT.clickWebtrekk( 'jsquiz' ); ZEIT.clickIVW(); }

				//scroll to top
				window.scrollTo(0, 0);

				settings.elError.empty();

				//get position
				var curQuestion = quizDiv.find( ".submitbutton" ).attr( "data-question" );
				var nextQuestion = parseInt( curQuestion, 10 ) + 1;

				//get answer
				var input = settings.elInput.val();

				//test all input text fields for numeric values
				$.each( settings.elInput, function( index, value ){
					if(($(value).attr("type") == 'text') && !$.isNumeric($(value).val())){
						input = false;
					}
				});

				//control for numeric input
				if( $.isNumeric(input) === true ){

					//evaluate Question
					settings.evaluateQuestion( curQuestion, data.questions );

					//empty divs after click
					settings.elQuestion.empty();
					settings.elAnswer.empty();
					settings.elImage.empty();

					if( curQuestion < questionLength -1 ){
						settings.createQuestion( nextQuestion, data.questions );
						settings.addNumber( nextQuestion, questionLength );
						settings.buttonFunction( nextQuestion );
					}else{
						settings.showResult();
						settings.addNumber( nextQuestion, questionLength );
					}

				}else {
					settings.elError.text(settings.errorText);
				}

			});//end of click-function (for next question)
		});//end of get.JSON
	}//end of if(settings.type)
  };//end of plugin
})( jQuery );




