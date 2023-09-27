"use strict";

const toggleButton = document.getElementById("toggle");
const languageSelect = document.getElementById("language");
const progressBar = document.getElementById("progress");

function reverseChildren(parent) {
  for (var i = 1; i < parent.childNodes.length; i++) {
    parent.insertBefore(parent.childNodes[i], parent.firstChild);
  }
}

function appendSkeleton(text) {
  // Create main skeleton div
  const existingSkeleton = document.getElementById("skeleton");
  if (existingSkeleton) return;

  const skeleton = document.createElement("div");
  skeleton.id = "skeleton";
  skeleton.className = "w-full sm:w-[45%]";

  // Create inner div
  const innerDiv = document.createElement("div");
  innerDiv.className =
    "border border-gray-300 rounded-lg p-4 bg-gray-200 flex flex-col items-center gap-2 animate-pulse w-full";

  const childDiv = document.createElement("div");
  childDiv.className =
    "aspect-square w-full max-w-[1000px] max-h-[1000px] bg-gray-300 rounded";
  innerDiv.appendChild(childDiv);

  const pTag = document.createElement("p");
  pTag.className = "text-sm";
  pTag.innerText = text;
  innerDiv.appendChild(pTag);

  // Add innerDiv to skeleton
  skeleton.appendChild(innerDiv);
  // Append skeleton to the body or another container
  const imagesContainer = document.getElementById("images");
  imagesContainer.prepend(skeleton);
}

function removeSkeleton() {
  const skeleton = document.getElementById("skeleton");
  if (skeleton) skeleton.remove();
}

let recognition = null;

const toggleListening = () => {
  if (recognition) {
    // If recognition is active, stop it
    recognition.stop();
    recognition = null;
    toggleButton.classList.remove("animate-bounce");
  } else {
    // If recognition is not active, start it
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect.value; // Use the selected language
    // recognition.lang = 'pt-BR'     recognition.start();
    // recognition.lang = 'pt-BR'
    recognition.start();
    recognition.addEventListener("onnomatch", handleNoMatch);
    recognition.addEventListener("error", handleError);
    recognition.addEventListener("result", convertToText);
    toggleButton.classList.add("animate-bounce");
  }
};

const handleError = async (event) => {
  console.log(event);
};

const handleNoMatch = async (event) => {
  console.log(event);
};

const convertToText = async (event) => {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      const content = event.results[i][0].transcript.trim();
      appendSkeleton(content);
      await fetchAndDisplayImage(content); // Call the function with the final text
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
