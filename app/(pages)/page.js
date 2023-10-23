"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import IntroModal from "@/components/Intro";

import { MicrophoneIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const toggleButton = useRef(null);
  const toogleText = useRef(null);
  const languageSelect = useRef(null);
  const recognition = useRef(null);
  const imagesContainer = useRef(null);
  const [openIntroModal, setOpenIntroModal] = useState(false);

  const handleButtonClick = () => {
    if (!recognition?.current) {
      startRecognition();
    } else {
      stopRecognition();
    }
  };

  useEffect(() => {
    setOpenIntroModal(true);
  }, []);

  const handleSelectChange = () => {
    if (recognition?.current) {
      stopRecognition();
      startRecognition();
    }
  };

  const startRecognition = () => {
    if (!recognition?.current) {
      recognition.current = new webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = languageSelect.current.value;

      recognition.current.start();

      recognition.current.addEventListener("error", (e) => {
        console.log("Error during recognition.current:", e);
        if (recognition.current) {
          stopRecognition();
          startRecognition();
        }
      });

      recognition.current.addEventListener("soundend", (e) => {
        if (recognition.current) {
          console.log("Sound has ended. Restarting recognition.current...");
          stopRecognition();
          startRecognition();
        }
      });

      recognition.current.addEventListener("result", convertToText);

      toggleButton.current.classList.add("animate-bounce");
      toogleText.current.textContent = "Try to use short sentences (ON)";
    }
  };

  const stopRecognition = () => {
    if (recognition?.current) {
      recognition.current.stop();
      recognition.current = null;

      toggleButton.current.classList.remove("animate-bounce");
      toogleText.current.textContent = "Try to use short sentences (OFF)";
    }
  };

  function appendSkeleton(text, id) {
    const existingSkeleton = document.getElementById(id);
    if (existingSkeleton) return;

    const skeleton = document.createElement("div");
    skeleton.id = id;
    skeleton.className = "w-full flex mx-auto max-w-[1200px] lg:max-w-screen";

    const innerDiv = document.createElement("div");
    innerDiv.id = `skeleton-innerDiv-${text}`;
    innerDiv.className =
      "border border-gray-300 rounded-lg p-4 bg-[#8F1E42] flex flex-row items-center gap-2 animate-pulse w-full";

    const childDiv = document.createElement("div");
    childDiv.id = `skeleton-childDiv-${text}`;
    childDiv.className =
      "aspect-square w-[50%] max-w-[1000px] max-h-[1000px] bg-gray-50 rounded";
    innerDiv.appendChild(childDiv);

    const pTag = document.createElement("p");
    pTag.className = "text-xl lg:text-base 2xl:text-2xl text-center p-4 flex-1";
    pTag.innerText = text;
    innerDiv.appendChild(pTag);

    skeleton.appendChild(innerDiv);

    imagesContainer.current.appendChild(skeleton);
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
      img.onerror =
        "this.onerror=null; this.src='https://www.storyvisualizer.com/img-loader.svg'";

      aspectRatioDiv.appendChild(img);

      innerDiv.classList.remove("animate-pulse");
      innerDiv.prepend(aspectRatioDiv);

      if (childDiv) childDiv.remove();

      img.onload = function () {
        skeleton.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });

        img.style.opacity = "1";
      };
    }
  }

  const wordQueue = [];
  const convertToText = async (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const words = event.results[i][0].transcript.trim().split(" ");
        wordQueue.push(...words);

        await processQueue();
      }
    }
  };

  const processQueue = async () => {
    while (wordQueue.length > 0) {
      const words = wordQueue.splice(0, 5);
      const content = words.join(" ");
      appendSkeleton(content, `skeleton-${content}`);
      await fetchAndDisplayImage(content);
    }
  };

  async function fetchAndDisplayImage(text) {
    let data;

    try {
      const response = await fetch("api/generate", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      data = await response.json();
    } catch {
      removeSkeleton(`skeleton-${text}`);
    }

    if (data.url) {
      updateSkeleton(text, data.url);
    }
  }

  return (
    <section className="flex flex-col h-[91vh] w-full overflow-hidden text-white relative">
      <header className="bg-[#8F1E42] text-center border-b border-grey w-full">
        <div className="flex flex-row justify-evenly sm:justify-around p-5 max-w-[2000px]">
          <div className="w-[130px] md:w-[180px] h-auto relative">
            <Image
              layout="fill"
              src="logo.svg"
              alt="Product Logo"
              objectFit="contain"
            />
          </div>

          <div className="max-w-[33%]">
            <button
              ref={toggleButton}
              type="button"
              id="toggle"
              className="bg-white p-5 rounded-full"
              onClick={handleButtonClick}
            >
              <MicrophoneIcon className="w-6 h-6 text-[#8F1E42]" />
            </button>
            <p
              ref={toogleText}
              className="text-white italic text-sm mt-1"
              id="toggle-text"
            >
              Try to use short sentences (OFF)
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <label htmlFor="language" className="mb-2 text-sm font text-white">
              Language
            </label>
            <select
              ref={languageSelect}
              id="language"
              onChange={handleSelectChange}
              className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en-US">🇺🇸</option>
              <option value="en-GB">🇬🇧</option>
              <option value="pt-BR">🇧🇷</option>
              <option value="pt-PT">🇵🇹</option>
              <option value="es-ES">🇪🇸</option>
              <option value="es-MX">🇲🇽</option>
              <option value="fr-FR">🇫🇷</option>
              <option value="de-DE">🇩🇪</option>
              <option value="it-IT">🇮🇹</option>
              <option value="ru-RU">🇷🇺</option>
              <option value="zh-CN">🇨🇳</option>
              <option value="zh-TW">🇹🇼</option>
              <option value="ja-JP">🇯🇵</option>
              <option value="ko-KR">🇰🇷</option>
            </select>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-scroll p-4">
        <IntroModal open={openIntroModal} setOpen={setOpenIntroModal} />
        <div className="w-full col-span-3 px-5 py-8">
          <div
            ref={imagesContainer}
            id="images"
            className="flex flex-col flex-wrap items-strech justify-center gap-4 xl:gap-8 max-w-[1000px] 2xl:max-w-[2000px] mx-auto"
          ></div>
        </div>
        <div id="scrollTarget" className="w-full" />
      </div>
    </section>
  );
}
