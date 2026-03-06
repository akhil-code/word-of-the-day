const endpoint = "https://words.url2.at/words";

async function nextWord() {
    const wordElement = document.getElementById("word");
    const definitionElement = document.getElementById("definition");
    const speechPartElement = document.getElementById("speech-part");

    if (!wordElement || !definitionElement) {
        return;
    }

    wordElement.style.opacity = "0";

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        const nextWordText = data._id || "Unknown word";
        const nextDefinitionText =
            (Array.isArray(data.meanings) &&
                data.meanings[0] &&
                data.meanings[0].definition) ||
            "Definition not available.";
        const nextSpeechPartText =
            (Array.isArray(data.meanings) &&
                data.meanings[0] &&
                data.meanings[0].speech_part) ||
            "";

        setTimeout(() => {
            wordElement.textContent = nextWordText;
            definitionElement.textContent = nextDefinitionText;
            if (speechPartElement) {
                speechPartElement.textContent = nextSpeechPartText;
            }

            wordElement.style.transition = "opacity 0.5s ease";
            wordElement.style.opacity = "1";
        }, 200);
    } catch (error) {
        console.error("Failed to fetch next word:", error);
        wordElement.style.opacity = "1";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const nextWordButton = document.getElementById("refresh-button");
    if (nextWordButton) {
        nextWordButton.addEventListener("click", () => nextWord());
    }
    nextWord();
});
