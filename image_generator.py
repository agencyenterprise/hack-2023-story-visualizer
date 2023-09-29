import openai
from dotenv import load_dotenv
import os
import requests

load_dotenv()

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
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
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
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        openai.api_key = OPENAI_API_KEY
        if text:
            # print("generate_image -> 59: " + text)
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

def generate_image2(text):
    #Leonardo.ai
    try:
        if text:

            # Get User Information, access token
            # https://docs.leonardo.ai/reference/getuserself

            print("generate_image2 -> 90: " + text)

            url = "https://cloud.leonardo.ai/api/rest/v1/me"

            headers = {
                "accept": "application/json",
                "content-type": "application/json",
                "authorization": "Bearer " + os.getenv("LEONARDOAI_API_KEY"),
            }

            response = requests.get(url, headers=headers, timeout=5)

            print("---> Get User Information -> 106: " + response.text)

            # Create a generation of images
            # https://docs.leonardo.ai/reference/creategeneration

            url = "https://cloud.leonardo.ai/api/rest/v1/generations"

            payload = {
                "height": 256,
                # "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3", # Leonardo Creative
                # "modelId": "cd2b2a15-9760-4174-a5ff-4d2925057376", # Leonardo Select
                # "modelId": "291be633-cb24-434f-898f-e662799936ad", # Leonardo Signature 
                # "modelId": "ac614f96-1082-45bf-be9d-757f2d31c174", # DreamShaper v7
                "modelId": "d69c8273-6b17-4a30-a13e-d6637ae1c644", # 3D anumation style
                "prompt": text,
                "width": 256,
                "promptMagic": True,
                "promptMagicVersion": "v2",
                "highContrast": True,
                "guidance_scale": 7,
                "imagePromptWeight": 0.4,
                "presetStyle": "LEONARDO"
            }

            response2 = requests.post(url, json=payload, headers=headers, timeout=5)

            print("---> Create a generation of images -> 128: " + response2.text)
            myGenerationId = response2.json()['sdGenerationJob']['generationId']
            print("---> generationId -> 130: " + myGenerationId)

            # Get info about a single generation of images
            # https://docs.leonardo.ai/reference/getgenerationbyid
            url = "https://cloud.leonardo.ai/api/rest/v1/generations/" + myGenerationId

            myStatus = ""
            while myStatus != "COMPLETE":
                response3 = requests.get(url, headers=headers, timeout=5)
                myStatus = response3.json()['generations_by_pk']['status']

            image_url = response3.json()['generations_by_pk']['generated_images'][0]['url']
            return image_url

    except Exception as e:
        print("An error occurred while generating the Leonardo.ai image: ", e)
        response = None        
