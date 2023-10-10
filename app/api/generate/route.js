import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

import { Leonardo } from "@leonardo-ai/sdk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const leonardoAi = new Leonardo({
  security: {
    bearerAuth: process.env.LEONARDO_API_KEY,
  },
});

export async function POST(req, res) {
  const headersList = headers();
  const referer = headersList.get("referer");

  if (
    !referer ||
    (getDomain(referer) !== getDomain(process.env.NEXTAUTH_URL) &&
      process.env.NODE_ENV !== "development")
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { text, type } = await req.json();

  if (type === "leo") {
    const response = await generateLeonardoAiImage(text);

    return NextResponse.json({
      url: response,
    });
  } else {
    const response = await generateOpenAiImage(text);

    return NextResponse.json({
      url: response,
    });
  }
}

function getDomain(url) {
  const domain = new URL(url || "").hostname;
  const newDomain = domain.replace("www.", "");
  return newDomain;
}

async function generateOpenAiImage(text) {
  const response = await openai.images.generate({
    prompt: text,
    n: 1,
    size: "256x256",
  });

  return response.data[0].url;
}

async function generateLeonardoAiImage(text) {
  const generation = await leonardoAi.generation.createGeneration({
    height: 256,
    width: 256,
    numImages: 1,
    modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
    prompt: text,
  });

  if (generation.statusCode !== 200) {
    return null;
  }

  const response = await leonardoAi.generation.getGenerationById(
    generation.createGeneration200ApplicationJSONObject.sdGenerationJob
      .generationId
  );

  return response.getGenerationById200ApplicationJSONObject.generationsByPk
    .generatedImages[0].url;
}

function generateAIContext(text) {
  return `You are tool designer to transform expressions, utterances and prepositions into a sequence of
      visual text represepythntations.
      ---- TASKS ----
      1. For each message in the input you should be able to produce a simple representation where
      the context of the message can be narrated to deaf people.
      2. Produce in the end a sequence of visual text representations that can be used as prompt to power a text to image generation model, like dalle2 or stable diffusion
      3. You can make up facts and visual representations as long they are part or have indirect relationship with the inital text.
      4. In the end you must summary the entire text in a single representation with up to 100 characters
      ---- EXAMPLES ----
      For example, if the message is
      “Hi, how are you?”, the output could be something similar to this message:
      A person walking in the street and waving at a friend.
      For example, if the message is
      "Hey I like this food, it's delicious", the output could be something similar to this message:
      A person eating a delicious meal.
      ---- END OF EXAMPLES ----
      ---- END OF TASKS ----
      input: ${text}
      ANSWER:`;
}
