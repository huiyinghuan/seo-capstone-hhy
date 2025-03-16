# from openai import OpenAI

# client = OpenAI(
#   api_key="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"
# )

# completion = client.chat.completions.create(
#   model="gpt-4o-mini",
#   store=True,
#   messages=[
#     {"role": "user", "content": "write a haiku about ai"}
#   ]
# )

# print(completion.choices[0].message)




# @csrf_exempt
# def getRecommendedFixes(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             attribute = data.get("attribute", "Unknown Attribute")
#             value = data.get("value", "No Value Provided")

#             prompt = f"Provide an SEO recommendation for the following issue:\n\nAttribute: {attribute}\nValue: {value}\n\nRecommendation:"

#             response = openai.ChatCompletion.create(
#                 model="gpt-4",
#                 messages=[{"role": "system", "content": "You are an SEO expert providing actionable recommendations."},
#                           {"role": "user", "content": prompt}]
#             )

#             recommendation = response["choices"][0]["message"]["content"]

#             return JsonResponse({"recommendation": recommendation})
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=400)




# @csrf_exempt

# # Disable CSRF check for the API endpoint (You can handle this properly in production)
# def getRecommendedFixes(request):
#     if request.method == 'POST':
#         try:
#             # Parse the incoming JSON data
#             data = json.loads(request.body)
#             label = data.get("label")
#             value = data.get("value")
            
#             # Formulate the prompt for OpenAI (you can modify this prompt as needed)
#             prompt = f"Provide SEO recommendations for the following attribute: {label} with value: {value}. Suggest improvements for better SEO."

#             # Call OpenAI API for recommendations
#             response = openai.Completion.create(
#                 engine="text-davinci-003",  # Or whichever engine you prefer
#                 prompt=prompt,
#                 max_tokens=150
#             )

#             # Extract recommendation from OpenAI response
#             recommendation = response.choices[0].text.strip()

#             # Return recommendation in the response
#             return JsonResponse({"recommendation": recommendation}, status=200)

#         except Exception as e:
#             # Handle errors
#             return JsonResponse({"error": str(e)}, status=400)

#     return JsonResponse({"error": "Invalid request method"}, status=405)

# views.py
# from django.http import JsonResponse
# # from django.views.decorators.csrf import csrf_exempt


# # @csrf_exempt
# def  getRecommendedFixes(request):
#     if request.method == "POST":
#         try:
#             # Extract label and value from the POST data
#             # data = json.loads(request.body)
#             # label = data.get('label')
#             # value = data.get('value')
            
#             # Use OpenAI API (example)
#             openai.api_key = "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"
#             response = openai.Completion.create(
#                 engine="text-davinci-003",  # Adjust the model you need
#                 prompt=f"Write me a travel plan for Haikou China for a 8D7N trip'.",
#                 # prompt=f"Provide SEO recommendations for the label '{label}' with the value '{value}'.",
#                 max_tokens=100
#             )
#             recommendation = response.choices[0].text.strip()

#             return JsonResponse({"recommendation": recommendation})

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=400)


from django.http import JsonResponse
import os
from openai import OpenAI, OpenAIError
import json
import logging

logger = logging.getLogger(__name__)

# Set your OpenAI API key
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
)
print(client.api_key)  # Check the API key being used

def get_recommended_fixes(request):
    logger.info("get_recommended_fixes function called")
    print("get_recommended_fixes function called")
    try:
        data = json.loads(request.body)
        label = data.get("label", "Unknown Attribute")
        value = data.get("value", "No Value Provided")
        details = data.get("details", "No Details Available")
        requirement = data.get("requirement", "No Value Provided")

        # prompt = f"Modify the {label}, {value} to ensue the {label} fit the  {requirement}"
        #prompt = "Provide SEO recommendations for a page with the following issues: Missing alt attributes, slow page load time, missing meta description."
        
        # Define different prompts based on the label
        if "Meta Description" in label:
            prompt = f"Rewrite the following '{label}' to ensure it fits the '{requirement}' while keeping the '{value}'."
        elif "Title" in label:
            prompt = f"The current title is '{value}'. Optimize it to be compelling, concise, keyword-rich, and within '{requirement}'. Ensure it accurately describes the page content."
        elif "Image Alt Text" in label:
            prompt = f"Generate appropriate '{label}' for each of the following '{value}'. Ensure the descriptions are concise, descriptive, and SEO-friendly, accurately reflecting the content of the images. Avoid generic terms like image or photo and instead describe the subject in detail."
        elif "Page Speed" in label:
            prompt = f"Give recommendations on how to improve on core web vital assessment results based on the {details}"
        else:
            prompt = f"Modify the {label}, '{value}', to ensure it meets the requirement: '{requirement}'. Provide an SEO-friendly recommendation."
        
    
        
        logger.info(f"Prompt: {prompt}")

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Or another model like 'gpt-4'
            messages=[{"role": "system", "content": "You are an SEO expert providing actionable recommendations."},
                      {"role": "user", "content": prompt}],
            max_tokens=150
        )
        logger.info(f"OpenAI response: {response}")
        print(response)

        recommendation = response.choices[0].message.content
        print(recommendation)
        return JsonResponse({"recommendation": recommendation}, status=200)

    # except openai.error.OpenAIError   as e:
    #     logger.error(f"OpenAI error: {e}")
    #     # Handle OpenAI-specific errors
    #     return JsonResponse({"error": f"OpenAI error: {str(e)}"}, status=500)

    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        # Handle other exceptions
        return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)

# def contentAnalysis 
