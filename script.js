const wordIntroPhrases = {};

    let wordToGuess = "";

    async function fetchRandomWord() {
      const options = {
        method: 'GET',
        url: 'https://random-word-by-api-ninjas.p.rapidapi.com/v1/randomword',
        params: { type: 'verb'}, // You can change the type if needed
        headers: {
          'X-RapidAPI-Key': 'aa89a9475fmsh2519ad607bf8a07p11e955jsnb24308fff616',
          'X-RapidAPI-Host': 'random-word-by-api-ninjas.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        wordToGuess = response.data.word;

        console.log(wordToGuess); // debugging purposes

        await getDefinition(wordToGuess); // Call getDefinition with the word to guess
        return wordToGuess;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async function getDefinition(wordToGuess) {
      const options = {
        method: 'GET',
        url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/definition/',
        params: { entry: wordToGuess },
        headers: {
          'X-RapidAPI-Key': 'aa89a9475fmsh2519ad607bf8a07p11e955jsnb24308fff616',
          'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response);
        const meanings = response.data.meaning.verb;
        console.log(meanings) // debugging purpose
        wordIntroPhrases[wordToGuess.toLowerCase()] = meanings; // Store the verb meanings
        console.log(wordIntroPhrases[wordToGuess.toLowerCase()]);
      } catch (error) {
        console.error(error);
      }
    }

    async function displayRandomWord(event) {
      // prevent default behaviour
      if (event){
        event.preventDefault();
  
      }
      //
      const randomWord = await fetchRandomWord();
      console.log(randomWord);
      if (randomWord) {
          const screen = document.getElementById("screen");
          const introPhrase = wordIntroPhrases[randomWord.toLowerCase()] || "No intro phrase available.";
          screen.textContent = `HINT >>>: This word has ${wordToGuess.length} letters here's a small definition to better assist you  ${introPhrase}`;
      }
  }
  

    // Function to reset the game
    function resetGame() {
      wordToGuess = "";
      wordIntroPhrases = {};
      document.getElementById("userInput").value = "";
      document.getElementById("screen").textContent = "";
      fetchRandomWord();
    }

    // Function to handle user input when the user writes the entire word
    async function handleUserInput() {
      const userInput = document.getElementById("guessInput").value;
      console.log(userInput);
      if (userInput === wordToGuess) {
        document.getElementById("screen").textContent = "Congrats you got it right!";
        document.getElementById("userInput").value = "";
      } else if (userInput.length < wordToGuess.length) {
        document.getElementById("screen").textContent = "Too short!";
      } else {
        document.getElementById("screen").textContent = "Wrong!";
      }
    }

    // Main game loop
    async function gameLoop() {
      let resetClicked = false; // Variable to track if reset button is clicked

      while (!resetClicked) {
        await displayRandomWord();
        await new Promise(resolve => {
          document.getElementById("guessButton2").addEventListener("click", async function() {
            await handleUserInput();
            resolve();
          });
        });
      }
    }

    // Event listener for reset button
    document.getElementById("resetButton1").addEventListener("click", resetGame);

    // Call the game loop when the page loads
    gameLoop();