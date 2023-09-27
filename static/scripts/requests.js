"use strict";

function reverseChildren(parent) {
  for (var i = 1; i < parent.childNodes.length; i++){
      parent.insertBefore(parent.childNodes[i], parent.firstChild);
  }
}

function appendSkeleton() {
    // Create main skeleton div
    const skeleton = document.createElement('div');
    skeleton.id = 'skeleton';
    skeleton.className = 'w-full sm:w-[45%]';
    skeleton.style.display = 'none';

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
    imagesContainer.appendChild(skeleton);
}

function removeSkeleton() {
    const skeleton = document.getElementById('skeleton');
    if (skeleton) skeleton.remove();
}

// To use these functions:
// appendSkeleton(); - to add the skeleton to the DOM
// removeSkeleton(); - to remove the skeleton from the DOM

async function fetchAndDisplayImage(text) {
    appendSkeleton();

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
      removeSkeleton();
      const imagesContainer = document.getElementById("images")
      imagesContainer.appendChild(mainDiv);

      // window.scrollTo(0,document.body.scrollHeight);
      img.onload = function () {
        img.scrollIntoView({ behavior: "smooth", block: "end" }); // Scroll to the last image added
        img.style.opacity = "1";
      };
    }
}