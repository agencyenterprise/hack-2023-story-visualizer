"use strict";

console.log("Hello World!")

const toggleButton = document.getElementById("toggle");
const output = document.getElementById("output");
const languageSelect = document.getElementById("language");

let recognition = null;

const toggleListening = () => {
if (recognition) {
  // If recognition is active, stop it
  recognition.stop();
  recognition = null;
  output.textContent = "";
  toggleButton.classList.remove("animate-bounce");
} else {
  // If recognition is not active, start it
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = languageSelect.value; // Use the selected language
  // recognition.lang = 'pt-BR'
  recognition.start();
  recognition.addEventListener("result", convertToText);
  toggleButton.classList.add("animate-bounce");
}
};

const convertToText = (event) => {
for (let i = event.resultIndex; i < event.results.length; i++) {
  if (event.results[i].isFinal) {
    const content = event.results[i][0].transcript.trim();
    output.textContent = content;
    fetchAndDisplayImage(content); // Call the function with the final text
  }
}
};

// Add event listener to languageSelect
languageSelect.addEventListener("change", () => {
if (recognition) {
  toggleListening(); // Stop current recognition
  toggleListening(); // Start new recognition with new language
}
});

toggleButton.addEventListener("click", toggleListening);