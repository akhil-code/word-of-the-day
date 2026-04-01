const endpoint = "https://words.url2.at/words";

function getLocalIsoDate() {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

const WOTD_LOCALSTORAGE_KEY = "words.wotd.v1";

async function nextWord(options = {}) {
    const { forceFetch = false } = options || {};
    const wordElement = document.getElementById("word");
    const definitionElement = document.getElementById("definition");
    const speechPartElement = document.getElementById("speech-part");

    if (!wordElement || !definitionElement) {
        return;
    }

    wordElement.style.opacity = "0";

    try {
        const today = getLocalIsoDate();

        if (!forceFetch) {
            try {
                const cachedRaw = localStorage.getItem(WOTD_LOCALSTORAGE_KEY);
                if (cachedRaw) {
                    const cached = JSON.parse(cachedRaw);
                    if (cached && cached.date === today && cached.word) {
                        const nextWordText = cached.word || "Unknown word";
                        const nextDefinitionText =
                            cached.definition || "Definition not available.";
                        const nextSpeechPartText = cached.speechPart || "";

                        setTimeout(() => {
                            wordElement.textContent = nextWordText;
                            definitionElement.textContent = nextDefinitionText;
                            if (speechPartElement) {
                                speechPartElement.textContent = nextSpeechPartText;
                            }

                            wordElement.style.transition = "opacity 0.5s ease";
                            wordElement.style.opacity = "1";
                        }, 200);
                        return;
                    }
                }
            } catch {
                // Ignore localStorage/JSON errors and fall back to network.
            }
        }

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

        try {
            localStorage.setItem(
                WOTD_LOCALSTORAGE_KEY,
                JSON.stringify({
                    date: today,
                    word: nextWordText,
                    definition: nextDefinitionText,
                    speechPart: nextSpeechPartText,
                })
            );
        } catch {
            // Ignore quota / privacy mode / disabled localStorage.
        }

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
        nextWordButton.addEventListener("click", () =>
            nextWord({ forceFetch: true })
        );
    }
    nextWord();
});
