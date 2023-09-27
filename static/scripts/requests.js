"use strict";

function reverseChildren(parent) {
  for (var i = 1; i < parent.childNodes.length; i++){
      parent.insertBefore(parent.childNodes[i], parent.firstChild);
  }
}

async function fetchAndDisplayImage(text) {
    console.log("Fetching image...")
    const response = await fetch("/generate_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    });
    const data = await response.json();
//    document.querySelector(".lds-facebook").style = "display:none";

    if (data.image) {
      // Create main div
      const mainDiv = document.createElement('div');
      mainDiv.className = 'border border-gray-300 rounded-lg p-4 bg-gray-200 flex flex-col items-center gap-2 w-full sm:w-[45%]';

      // Create container div and img
      const containerDiv = document.createElement('div');
      containerDiv.className = 'aspect-square w-full max-w-[1000px] max-h-[1000px]';
      containerDiv.style.background = "url(/static/img-loader.svg) no-repeat center";

      const img = document.createElement('img');
      img.src = data.image;
      img.alt = 'Instagram Post';
      img.className = 'aspect-square w-full h-full max-w-[1000px] max-h-[1000px]';
      img.style.opacity = '0';
      img.style.transition = 'all 0.2s ease';
      img.onerror = "this.onerror=null; this.src='/static/img-loader.svg'";
//      img.onload = "this.style.opacity=1;";

      // Add img to containerDiv
      containerDiv.appendChild(img);

      // Create p
      const pTag = document.createElement('p');
      pTag.className = 'text-sm';
      pTag.innerText = text;

      // Add containerDiv and pTag to mainDiv
      mainDiv.appendChild(containerDiv);
      mainDiv.appendChild(pTag);

      // Add mainDiv to the images container
      skeleton.style.display = "none";
      const imagesContainer = document.getElementById("images")
      imagesContainer.appendChild(mainDiv);

      // window.scrollTo(0,document.body.scrollHeight);
      img.onload = function () {
        img.scrollIntoView({ behavior: "smooth", block: "end" }); // Scroll to the last image added
        img.style.opacity = "1";
      };
    }
}