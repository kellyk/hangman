//Globals
var word, answer = [], used = [], errors = 0;
$(document).ready(init);

function reveal() {
	$('[data-content=answer]').show();
}

function clearScreen() {
	$('[data-content=answer]').hide();
	$('[data-content=used]').html("");
	errors = 0;
	used = [];
	answer = [];
}

function reload (){
	clearScreen();
	startGame();
}

function init() {
	$('[data-action=reveal]').on('click', reveal);
	$('[data-action=reload]').on('click', reload);
	$('[data-action=guess]').on('submit', validate);
	startGame();
}

function getRandomWord() {
	// use ajax to get the word
    var requestStr = "http://randomword.setgetgo.com/get.php";
	$.ajax({
        type: "GET",
        url: requestStr,
        dataType: "jsonp",
        success: function(response) {
			word = response.Word.toLowerCase().trim();
			displayGame();
        }
    });
}

function startGame() {
	getRandomWord();
	var input = $('[data-content=guess]').get(0);
	$(input).focus().val("");
}

function displayGame() {
	$('[data-content=answer]').html(word);
	//fill an array of the word's size with dashes
	for(var i = 0; i < word.length; i++)
	{
		answer[i] = "_";
	}

	displayProgress();
}

function displayProgress() {
	var div = document.getElementById('answer');
	var answerString = "";

	for (var i = 0; i < answer.length; i++)
	{
		answerString += answer[i] + " ";
	}
	div.innerHTML = answerString;
}

function validate(e) {
	e.preventDefault();
	var input = $('[data-content=guess]').get(0);
	var warning = $('[data-content=warning]').get(0);

	//get letter from user and clear the input field
	var guess = input.value;
	$(input).focus().val("");

	//make sure letter is valid character, and 1 char at a time
	var pattern = new RegExp(/^([A-z]){1,1}$/);
	var valid = pattern.test(guess);
	var successfulGuess = false;

	//if the letter is valid
	if (valid) {
		//make the letter lowercase
		guess = guess.toLowerCase();

		//test to see if that letter has already been guessed
		if(alreadyUsed(guess)) {
			//tell the user that letter has been guessed and to try again
			$(warning).html("You already guessed '" + guess +"'!");
			return;
		} else {
			$(warning).html("");
			//add guess to list of already guessed
			used.push(guess);
			for (var i = 0; i < word.length; i++) {
				if (word[i] == guess)
				{
					answer[i] = guess;
					successfulGuess = true;
				}
			}
			displayProgress();
			checkWin();
		}

		//if that guess isn't in the word
		if(!successfulGuess)
			hangman(); //change picture
	}

	else //non alpha character entered. display error
	{
		$(warning).html("Please enter one letter.");
		return;
	}

	var usedDiv = $('[data-content=used]');
	$(usedDiv).html("<h2>Letters Used:</h2>" + used);
}

function checkWin() {
	if (String(word) == String(answer.join(""))) {
		alert("You won!");
	}
}

function alreadyUsed(guess) {
	for(var i = 0; i < used.length; i++) {
		if(used[i] == guess)
			return true;
	}
	return false;
}


function hangman() {
	//raise error count
	errors++;

	if (errors > 6) {
		return;
	}

	//grab and add pictures depending on how many errors
	var gallows = $('.gallows').find('img');
	$(gallows).attr('src', 'images/' + errors + '.png');

	if(errors == 6) {
		alert("You lost!");
		return;
	}
	
}