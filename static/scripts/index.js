"use strict";

const toggleButton = document.getElementById("toggle");
const toogleText = document.getElementById("toggle-text");
const languageSelect = document.getElementById("language");
const progressBar = document.getElementById("progress");

function reverseChildren(parent) {
  for (var i = 1; i < parent.childNodes.length; i++) {
    parent.insertBefore(parent.childNodes[i], parent.firstChild);
  }
}

function appendSkeleton(text, id) {
  // Create main skeleton div
  const existingSkeleton = document.getElementById(id);
  if (existingSkeleton) return;

  const skeleton = document.createElement("div");
  skeleton.id = id;
  skeleton.className = "w-full flex mx-auto max-w-[1200px] lg:max-w-screen";

  // Create inner div
  const innerDiv = document.createElement("div");
  innerDiv.id = `skeleton-innerDiv-${text}`;
  innerDiv.className =
    "border border-gray-300 rounded-lg p-4 bg-gray-200 flex flex-row items-center gap-2 animate-pulse w-full";

  const childDiv = document.createElement("div");
  childDiv.id = `skeleton-childDiv-${text}`;
  childDiv.className =
    "aspect-square w-[50%] max-w-[1000px] max-h-[1000px] bg-gray-300 rounded";
  innerDiv.appendChild(childDiv);

  const pTag = document.createElement("p");
  pTag.className =
    "text-sm lg:text-base xl:text-lg 2xl:text-4xl text-center p-4 flex-1";
  pTag.innerText = text;
  innerDiv.appendChild(pTag);

  // Add innerDiv to skeleton
  skeleton.appendChild(innerDiv);
  // Append skeleton to the body or another container
  const imagesContainer = document.getElementById("images");
  imagesContainer.appendChild(skeleton);
}

function removeSkeleton(id) {
  const skeleton = document.getElementById(id);
  if (skeleton) skeleton.remove();
}

function updateSkeleton(text, imgUrl) {
  const skeleton = document.getElementById(`skeleton-${text}`);
  const innerDiv = document.getElementById(`skeleton-innerDiv-${text}`);
  const childDiv = document.getElementById(`skeleton-childDiv-${text}`);

  if (innerDiv && childDiv) {
    const aspectRatioDiv = document.createElement("div");
    aspectRatioDiv.className = "relative w-[50%] pb-[50%] h-0";

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = "Instagram Post";
    img.className =
      "aspect-square w-full h-full max-w-[1000px] max-h-[1000px] absolute top-0 left-0";
    img.style.opacity = "0";
    img.style.transition = "all 0.2s ease";
    img.onerror = "this.onerror=null; this.src='/static/img-loader.svg'";

    aspectRatioDiv.appendChild(img);

    innerDiv.classList.remove("animate-pulse");
    innerDiv.prepend(aspectRatioDiv);

    if (childDiv) childDiv.remove();

    img.onload = function () {
      // img.scrollIntoView({ behavior: "smooth", block: "end" }); // Scroll to the last image added
      const scrollTarget = document.getElementById("scrollTarget");
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "end" }); // Scroll to the last image added
      img.style.opacity = "1";
    };
  }
}

let recognition = null;

const stopRecognition = () => {
  if (recognition) {
    // If recognition is active, stop it
    recognition.stop();
    recognition = null;
    toggleButton.classList.remove("animate-bounce");
    toogleText.textContent = "Try to use short sentences (OFF)";
  }
};

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
    recognition.addEventListener("error", (e) => {
      console.log("Error during recognition:", e);
      if (recognition) {
        stopRecognition(); // Stop current recognition
        startRecognition(); // Start new recognition with new language
      }
    });
    recognition.addEventListener("soundend", (e) => {
      if (recognition) {
        console.log("Sound has ended. Restarting recognition...");
        stopRecognition(); // Stop current recognition
        startRecognition(); // Start new recognition with new language
      }
    });
    recognition.addEventListener("result", convertToText);

    // Animation
    toggleButton.classList.add("animate-bounce");
    toogleText.textContent = "Try to use short sentences (ON)";
  }
};

const convertToText = async (event) => {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      const content = event.results[i][0].transcript.trim();
      appendSkeleton(content, `skeleton-${content}`);
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
