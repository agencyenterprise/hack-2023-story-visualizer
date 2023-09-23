import openai

def generate_image(text):
    # Perform text-to-image generation here
    try:        
        openai.api_key = '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'
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
