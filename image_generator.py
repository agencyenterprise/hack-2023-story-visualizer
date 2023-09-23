import openai
from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def get_promtp(text: str):
    """Returns a prompt for the user to complete."""
    return f"""You are tool designer to transform expressions, utterances and prepositions into a sequence of
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
    input: {text}
    ANSWER:"""

def text_completion(text):
    # Perform text-to-image generation here
    try:  
        openai.api_key = OPENAI_API_KEY
        response = openai.Completion.create(
            engine="davinci",
            prompt = text,
            max_tokens=100,
            temperature=0.5,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0.6,
            stop=["\n"]
        )
        return response['choices'][0]['text']

    except Exception as e:
        print(e)
        print("An error occurred while generating the text: ", e)
        response = None

def generate_image(text):
    # Perform text-to-image generation here
    try:
        openai.api_key = OPENAI_API_KEY
        if text:
            print(text)
            #text = text_completion(get_promtp(text))
            if text:
                response = openai.Image.create(
                    prompt = text,
                    n=1,
                    size="256x256"
                )
                image_url = response['data'][0]['url']
                return image_url

    except Exception as e:
        print("An error occurred while generating the image: ", e)
        response = None



