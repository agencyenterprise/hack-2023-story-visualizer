"use strict";

async function fetchAndDisplayImage(text) {
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
    removeSkeleton(`skeleton-${text}`);
  }

  if (data.image) {
    updateSkeleton(text, data.image);
  }
}

async function fetchAndDisplayImage2(text) {
  let data;

  try {
    const response = await fetch("/generate_image2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    });
    data = await response.json();
  } catch {
    removeSkeleton(`skeleton-${text}`);
  }

  if (data.image) {
    updateSkeleton(text, data.image);
  }
}

