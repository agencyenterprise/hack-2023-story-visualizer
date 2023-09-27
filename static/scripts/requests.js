"use strict";

async function fetchAndDisplayImage(text) {
    const response = await fetch("/generate_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    });
    const data = await response.json();
    document.querySelector(".lds-facebook").style = "display:none";

    if (data.image) {
      const p_text = document.createElement("p");
      const img = document.createElement("img");
      img.src = data.image;
      p_text.innerText = text;
      document.getElementById("images").appendChild(p_text);
      document.getElementById("images").appendChild(img);

      // window.scrollTo(0,document.body.scrollHeight);
      img.onload = function () {
        img.scrollIntoView({ behavior: "smooth", block: "end" }); // Scroll to the last image added
      };
    }
}