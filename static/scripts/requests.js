"use strict";

async function fetchAndDisplayImage(text) {
  appendSkeleton();
  let data;

  try {
    const response = await fetch("/generate_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    });
    data = await response.json();
  } catch {
    removeSkeleton();
  }

  if (data.image) {
    // Create main div
    const mainDiv = document.createElement("div");
    mainDiv.className =
      "border border-gray-200 rounded-lg p-4 bg-gray-200 flex flex-col items-center gap-2 w-full sm:w-[45%]";

    // Create container div and img
    const containerDiv = document.createElement("div");
    containerDiv.className =
      "aspect-square w-full max-w-[1000px] max-h-[1000px]";
    containerDiv.style.background =
      "url(/static/img-loader.svg) no-repeat center";

    const img = document.createElement("img");
    img.src = data.image;
    img.alt = "Instagram Post";
    img.className = "aspect-square w-full h-full max-w-[1000px] max-h-[1000px]";
    img.style.opacity = "0";
    img.style.transition = "all 0.2s ease";
    img.onerror = "this.onerror=null; this.src='/static/img-loader.svg'";

    // Add img to containerDiv
    containerDiv.appendChild(img);

    // Create p
    const pTag = document.createElement("p");
    pTag.className =
      "text-sm sm:text-base lg:text-xl xl:text-3xl text-center  p-4";
    pTag.innerText = text;

    // Add containerDiv and pTag to mainDiv
    mainDiv.appendChild(containerDiv);
    mainDiv.appendChild(pTag);

    // Add mainDiv to the images container
    removeSkeleton();
    const imagesContainer = document.getElementById("images");
    imagesContainer.appendChild(mainDiv);

    img.onload = function () {
      // img.scrollIntoView({ behavior: "smooth", block: "end" }); // Scroll to the last image added
      const scrollTarget = document.getElementById("scrollTarget");
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "end" }); // Scroll to the last image added
      img.style.opacity = "1";
    };
  }
}
