const endpoint = "https://words.url2.at/words";

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch random word and set it in the DOM on page load.
    fetchAndSetWord();

    //  Add event listener to the next word button
    const nextWordButton = document.getElementById("refresh-button");
    nextWordButton.addEventListener("click", async () => {
        fetchAndSetWord();
    });
});

async function fetchAndSetWord() {
    // Fetch DOM elements
    const wordElement = document.getElementById("word");
    const definitionElement = document.getElementById("definition");
    const exampleElement = document.getElementById("example");

    // Fetch a random word from the server
    const randomWord = await getRandomWord();
    // Update the DOM elements with the fetched word
    wordElement.innerHTML = randomWord._id;
    definitionElement.innerHTML = randomWord.meanings[0].definition
    exampleElement.innerHTML = randomWord.meanings[0].example;
}

async function getRandomWord() {
    // make a POST request to the server
    const response = await fetch(endpoint);
    // Process the response
    return await response.json();
}

