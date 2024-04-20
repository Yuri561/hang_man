const wordIntroPhrases = {};

let wordToGuess = "";

async function fetchRandomWord() {
  const options = {
    method: 'GET',
    url: 'https://random-word-by-api-ninjas.p.rapidapi.com/v1/randomword',
    params: { type: 'verb' }, // You can change the type if needed
    headers: {
      'X-RapidAPI-Key': 'aa89a9475fmsh2519ad607bf8a07p11e955jsnb24308fff616',
      'X-RapidAPI-Host': 'random-word-by-api-ninjas.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    wordToGuess = response.data.word;
    await getDefinition(wordToGuess); // Call getDefinition with the random word
    return wordToGuess;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getDefinition(word) {
  const options = {
    method: 'GET',
    url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/definition/',
    params: { entry: word },
    headers: {
      'X-RapidAPI-Key': 'aa89a9475fmsh2519ad607bf8a07p11e955jsnb24308fff616',
      'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const meanings = response.data.meaning;
    wordIntroPhrases[word.toLowerCase()] = meanings['verb']; // Store the verb meanings
    console.log(wordIntroPhrases[word.toLowerCase()]);
  } catch (error) {
    console.error(error);
  }
}

async function displayRandomWord(event) {
    document.getElementById("generate").addEventListener("click", displayRandomWord);
    event.preventDefault();
    
  const randomWord = await fetchRandomWord();
  console.log(randomWord);
  if (randomWord) {
    const screen = document.getElementById("screen");
    const introPhrase = wordIntroPhrases[randomWord.toLowerCase()] || "No intro phrase available.";
    screen.textContent = `HINT >>>: ${introPhrase}`;
  }
}

// Call the function to display a random word with intro phrase when the page loads
displayRandomWord();
