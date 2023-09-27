"use strict";

const toggleButton = document.getElementById("toggle");
const languageSelect = document.getElementById("language");

function reverseChildren(parent) {
  for (var i = 1; i < parent.childNodes.length; i++){
      parent.insertBefore(parent.childNodes[i], parent.firstChild);
  }
}

function appendSkeleton() {
    // Create main skeleton div
    const existingSkeleton = document.getElementById('skeleton');
    if (existingSkeleton) return;

    const skeleton = document.createElement('div');
    skeleton.id = 'skeleton';
    skeleton.className = 'w-full sm:w-[45%]';

    // Create inner div
    const innerDiv = document.createElement('div');
    innerDiv.className = 'border border-gray-300 rounded-lg p-4 bg-gray-200 flex flex-col items-center gap-2 animate-pulse w-full';

    // Create 3 child divs and add them to the innerDiv
    for (let i = 0; i < 3; i++) {
        const childDiv = document.createElement('div');
        if (i === 0) {
            childDiv.className = 'aspect-square w-full max-w-[1000px] max-h-[1000px] bg-gray-300 rounded';
        } else {
            childDiv.className = 'h-4 bg-gray-300 rounded' + ((i === 2) ? ' w-1/3' : ' w-full');
        }
        innerDiv.appendChild(childDiv);
    }

    // Add innerDiv to skeleton
    skeleton.appendChild(innerDiv);
    // Append skeleton to the body or another container
    const imagesContainer = document.getElementById("images")
    imagesContainer.prepend(skeleton);
}

function removeSkeleton() {
    const skeleton = document.getElementById('skeleton');
    if (skeleton) skeleton.remove();
}

let recognition = null;

const stopRecognition = () => {
   if (recognition) {
    // If recognition is active, stop it
    recognition.stop();
    recognition = null;
    toggleButton.classList.remove("animate-bounce");
  }
}

const startRecognition = () => {
  if (!recognition) {
    // If recognition is not active, start it
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect.value; // Use the selected language
    // recognition.lang = 'pt-BR'     recognition.start();
    // recognition.lang = 'pt-BR'
    recognition.start();

    // Listeners
    recognition.addEventListener("error", e => {
        console.log("Error during recognition:", e);
        if (recognition) {
          stopRecognition(); // Stop current recognition
          startRecognition(); // Start new recognition with new language
        }
    });
    recognition.addEventListener("soundend", e => {
        if (recognition) {
          console.log("Sound has ended. Restarting recognition...");
          stopRecognition(); // Stop current recognition
          startRecognition(); // Start new recognition with new language
        }
    });
    recognition.addEventListener("result", convertToText);

    // Animation
    toggleButton.classList.add("animate-bounce");
  }
};

const convertToText = async (event) => {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      appendSkeleton();
      const content = event.results[i][0].transcript.trim();
      await fetchAndDisplayImage(content); // Call the function with the final text
    }
  }
};

// Add event listener to languageSelect
languageSelect.addEventListener("change", () => {
  if (recognition) {
    stopRecognition(); // Stop current recognition
    startRecognition(); // Start new recognition with new language
  }
});

toggleButton.addEventListener("click", () => {
  if (!recognition) {
    startRecognition(); // Start new recognition with new language
  } else {
    stopRecognition(); // Stop current recognition
  }
});
