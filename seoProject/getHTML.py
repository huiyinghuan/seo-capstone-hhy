import ast
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from urllib.parse import urljoin
import subprocess
import json
import os
from collections import Counter
import re

def fetch_static_html(url):
    try:
        print(f"Fetching static HTML for: {url}")
        response = requests.get(url, timeout=10)
       
        print(f"HTTP Status: {response.status_code}")
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            # Title
            title = soup.find('title').text if soup.find('title') else 'No title'

            # Meta Description
            meta_description = soup.find('meta', {'name': 'description'})['content'] \
                if soup.find('meta', {'name': 'description'}) else 'No description'

            # Canonical Tag
            canonical = soup.find('link', {'rel': 'canonical'})['href'] \
                if soup.find('link', {'rel': 'canonical'}) else 'No canonical tag'

            # Robots Meta Tag
            robots = soup.find('meta', {'name': 'robots'})['content'] \
                if soup.find('meta', {'name': 'robots'}) else 'No robots meta tag'

            # Heading Tags
            headings = {}
            for i in range(1, 7):
                tag = f'h{i}'
                headings[tag] = [h.text.strip() for h in soup.find_all(tag)]

            # Structured Data (JSON-LD)
            structured_data = [script.string for script in soup.find_all('script', {'type': 'application/ld+json'})]

            # Image Alt Text Analysis
            image_alt_text_data = extract_image_alt_text(soup)

            result = {
            
                "title": title,
                "meta_description": meta_description,
                "canonical": canonical,
                "robots": robots,
                "headings": headings,
                "structured_data": structured_data,
                "image_alt_text": image_alt_text_data 
            }

            print("Static HTML data:", result)
            return result

        return None
    except Exception as e:
        print(f"Error fetching static HTML: {e}")
        return None

def fetch_dynamic_html(url):
    try:
        options = Options()
        options.add_argument('--headless')  # Run in headless mode
        driver = webdriver.Chrome(options=options)

        driver.get(url)
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        # Title
        title = soup.find('title').text if soup.find('title') else 'No title'

        # Meta Description
        meta_description = soup.find('meta', {'name': 'description'})['content'] \
            if soup.find('meta', {'name': 'description'}) else 'No description'

        # Canonical Tag
        canonical = soup.find('link', {'rel': 'canonical'})['href'] \
            if soup.find('link', {'rel': 'canonical'}) else 'No canonical tag'

        # Robots Meta Tag
        robots = soup.find('meta', {'name': 'robots'})['content'] \
            if soup.find('meta', {'name': 'robots'}) else 'No robots meta tag'

        # Heading Tags
        headings = {}
        for i in range(1, 7):
            tag = f'h{i}'
            headings[tag] = [h.text.strip() for h in soup.find_all(tag)]

        # Structured Data (JSON-LD)
        structured_data = [script.string for script in soup.find_all('script', {'type': 'application/ld+json'})]

         # Image Alt Text Analysis
        image_alt_text_data = extract_image_alt_text(soup)

        driver.quit()

        return {
            "title": title,
            "meta_description": meta_description,
            "canonical": canonical,
            "robots": robots,
            "headings": headings,
            "structured_data": structured_data,
            "image_alt_text": image_alt_text_data  # Include image alt text data
        }
    except Exception as e:
        return None
    

def extract_image_alt_text(soup):
    """
    Extracts alt text from all images on the page.
    Returns a dictionary with total images, images with alt text, and missing alt text count.
    """
    images = soup.find_all('img')
    total_images = len(images)
    images_with_alt = [img.get('alt', '').strip() for img in images if img.get('alt')]
    missing_alt_count = total_images - len(images_with_alt)

    return {
        "total_images": total_images,
        "images_with_alt": len(images_with_alt),
        "missing_alt": missing_alt_count,
        "missing_alt_images": [img['src'] for img in images if not img.get('alt') and img.get('src')]  # List images missing alt
    }


def fetch_xml_sitemap(url):
    sitemap_url = urljoin(url, "/sitemap.xml")
    try:
        response = requests.get(sitemap_url, timeout=10)
        if response.status_code == 200:
            return "Sitemap found"
        else:
            return "No sitemap"
    except Exception as e:
        return "Error checking sitemap"
    

#scripts section 
# Get the base directory dynamically
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Gets the current script's directory

def get_script_path(script_name):
    """Dynamically generate the full path to the script."""
    return os.path.join(BASE_DIR, script_name)


# def check_siteMap(url):
#     """
#     Calls the checkSiteMap.py script and returns the sitemap URL(s) found.
#     """
#     script_path = get_script_path("checkSiteMap.py")  # Update with your actual script name
    
#     if not script_path:
#         return "Error: Script path not found for SiteMap check."

#     try:
#         # Call the Python script with subprocess
#         result = subprocess.run(
#             ["python", script_path, url],  
#             capture_output=True,
#             text=True,
#             timeout=120
#         )

#         print("Raw stdout output:", result.stdout)  # Debug: print raw stdout
#         print("Raw stderr output:", result.stderr)  # Debug: print raw stderr

#     #     if result.returncode == 0:
#     #         try:
#     #             # Convert Python dict string to actual dict
#     #             # output = ast.literal_eval(result.stdout.strip())  
#     #             output = json.loads(result.stdout.strip())  # Convert JSON string to dict

#     #             # Ensure we are working with a proper dictionary
#     #             if isinstance(output, dict) and "sitemaps_found" in output:
#     #                 sitemaps = [sitemap.strip() for sitemap in output["sitemaps_found"]]
#     #                 return f"Sitemaps found: {', '.join(sitemaps)}" if sitemaps else "No sitemap found."
#     #             else:
#     #                 return "Error: Unexpected output format"

#     #         except (SyntaxError, ValueError):
#     #             return f"Error: Invalid JSON output: {result.stdout}"
#     #     else:
#     #         return f"Error: {result.stderr}"

#     # except Exception as e:
#     #     return f"Error checking Sitemap: {e}"
#         if result.returncode == 0:
#             try:
#                 # 🔹 Clean up whitespace and newlines before parsing JSON
#                 json_output = result.stdout.strip()

#                 # 🔹 Ensure the output is a valid JSON string
#                 output = json.loads(json_output)

#                 if isinstance(output, dict) and "sitemaps" in output:
#                     # 🔹 Remove carriage returns (`\r`) from sitemap URLs
#                     sitemaps = [sitemap.strip() for sitemap in output["sitemaps"]]
#                     return f"Sitemaps found: {', '.join(sitemaps)}" if sitemaps else "No sitemap found."
#                 else:
#                     return "Error: Unexpected output format"

#             except json.JSONDecodeError as e:
#                 return f"Error: Could not parse JSON output: {json_output}\nException: {str(e)}"
#         else:
#             return f"Error: {result.stderr.strip()}"

#     except Exception as e:
#         return f"Error checking Sitemap: {e}"
     
def check_siteMap(url):
    """ 
    Calls the checkSiteMap.mjs script and returns the sitemap URL(s) found.
    """
    script_path = get_script_path("checkSiteMap.mjs") # Update this if the script is in a different location
    if not script_path:
        return "Error: Script path not found for HTTPS check."
    
    try:
        result = subprocess.run(
            ["node", script_path, url],  
            capture_output=True,
            text=True,
            timeout=180  # Set timeout to 30 seconds
        )
        print("Raw stdout output:", result.stdout)  # Debug: print raw stdout
        if result.returncode == 0:
            try:
                output = json.loads(result.stdout.strip())
                return output
            except json.JSONDecodeError:
                return {"error": "Invalid JSON response", "raw_output": result.stdout.strip()}
        else:
            return {"error": "Script execution failed", "stderr": result.stderr.strip()}

    except subprocess.TimeoutExpired:
        return {"error": "Sitemap check timed out."}

    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}


def check_https_status(url):
    #script_path = r"C:\Users\huiying\Downloads\SIT_Y3_Sem1\capstone\seo-capstone-hhy\seoProject\httpsCheck.mjs"
    #script_path = r"/Users/huanhuiying/Documents/seo-capstone-hhy/seoProject/httpsCheck.mjs"
    # script_path = get_script_path("https_check")
    script_path = get_script_path("httpsCheck.mjs")  # Dynamically get the script path
    if not script_path:
        return "Error: Script path not found for HTTPS check."

    try:
        # Call the .mjs file using Node.js
        result = subprocess.run(
            ["node", script_path, url],
            capture_output=True,
            text=True,
            timeout=120
        )

        print("Raw stdout output:", result.stdout)  # Debug: print raw stdout
        print("Raw stderr output:", result.stderr)  # Debug: print raw stderr
    
        if result.returncode == 0:
            # Parse the JSON output from the .mjs script
            output = json.loads(result.stdout)
            
            https_audit_result = output.get("httpsAuditResult", "Unknown")
            print("The https result is: ", https_audit_result) # just for checking result

            if https_audit_result == "Pass":
                return "Pass"
            else:
                return f"HTTPS Status: {https_audit_result}"

        else:
            return f"Error: {result.stderr}"
    except Exception as e:
        return f"Error checking HTTPS status: {e}"


def check_mobile_friendly(url):
    # script_path = r"C:\Users\huiying\Downloads\SIT_Y3_Sem1\capstone\seo-capstone-hhy\seoProject\mobileFriendlyCheck.mjs"
    #script_path = r"/Users/huanhuiying/Documents/seo-capstone-hhy/seoProject/mobileFriendlyCheck.mjs"

    script_path = get_script_path("mobileFriendlyCheck.mjs")  # Uses the same dynamic method

    if not os.path.exists(script_path):
        return f"Error: Script file not found at {script_path}"

    try:
        # Call the .mjs file using Node.js
        result = subprocess.run(
            
            ["node", script_path, url],
            capture_output=True,
            text=True,
            timeout=60,
            # encoding='utf-8' 
        )

        print("Raw stdout output:", result.stdout)  # Debug: print raw stdout
        print("Raw stderr output:", result.stderr)  # Debug: print raw stderr

        if result.returncode == 0:
            # Parse the JSON output from the .mjs script
            output = json.loads(result.stdout)
            
            font_size_status = output.get("fontSize", "Unknown")
            viewport_status = output.get("viewport", "Unknown")
            if font_size_status == "Pass" and viewport_status == "Pass":
                return "Mobile-friendly"
            else:
                return f"Not mobile-friendly: Font Size - {font_size_status}, Viewport - {viewport_status}"
        else:
            return f"Error: {result.stderr}"
    except Exception as e:
        return f"Error checking mobile-friendliness: {e}"

def check_page_speed(url):
    #script_path = r"C:\Users\huiying\Downloads\SIT_Y3_Sem1\capstone\seo-capstone-hhy\seoProject\pageSpeedCheck.mjs"
    #script_path = r"/Users/huanhuiying/Documents/seo-capstone-hhy/seoProject/pageSpeedCheck.mjs"
    
    script_path = get_script_path("pageSpeedCheck.mjs")  # Uses the same dynamic method

    if not os.path.exists(script_path):
        return f"Error: Script file not found at {script_path}"
    
    try:
        # Call the .mjs file using Node.js
        result = subprocess.run(
            
            ["node", script_path, url],
            capture_output=True,
            text=True,
            timeout=90,
            # encoding='utf-8' 
        )

        print("Raw stdout output:", result.stdout)  # Debug: print raw stdout (json)
        print("Raw stderr output:", result.stderr)  # Debug: print raw stderr (not in json)


        # Parse the JSON output from the .mjs script
        output = json.loads(result.stdout)
        
        #assessment_result = output.get("Core Web Vital Assessment", "Unknown")
        #detail_output =  output.get("details", "No Detail Output Available")

        assessment_result = output.get("coreWebVitalResult", "Unknown")
        detail_output =  output.get("details", "No Details Output Available")
        
        if assessment_result == "Pass":
            return {"result": "Pass", "details": detail_output}
        elif assessment_result == "Fail":
            print("Core Web Vitals Assessment: ", assessment_result)
            print("Detail Output: ", detail_output)
            print("Detailed Output:", json.dumps(output, indent=2))  # Print full output if failed
            
            return {"result": "Fail", "details": detail_output}
        
        else:
            return {"result": "Error", "message": "Unexpected result from Node.js script"}

    except Exception as e:
         return {"result": "Error", "message": f"Error checking page speed: {e}"}
    


def check_strucutre_data(url):
    #script_path = r"C:\Users\huiying\Downloads\SIT_Y3_Sem1\capstone\seo-capstone-hhy\seoProject\structureDataCheck.mjs"
    #script_path = r"/Users/huanhuiying/Documents/seo-capstone-hhy/seoProject/structureDataCheck.mjs"
    
    script_path = get_script_path("structureDataCheck.mjs")  # Uses the same dynamic method

    if not os.path.exists(script_path):
        return f"Error: Script file not found at {script_path}"
    
    try:
        # Call the .mjs file using Node.js
        result = subprocess.run(
            ["node", script_path, url],
            capture_output=True,
            text=True,
            timeout=120
        )

        print("Raw stdout output:", result.stdout)  # Debug: print raw stdout
        print("Raw stderr output:", result.stderr)  # Debug: print raw stderr
    
        # Parse the JSON output from the .mjs script
        output = json.loads(result.stdout)

        # If there's an error in the output
        if 'error' in output:
            return {"result": "Error", "message": output["error"]}

        # Return the result in a structured format
        return {
            "totalValidItems": output.get("totalValidItems", 0),
            "validItems": output.get("validItems", []),
            "validItemTypes": output.get("validItemTypes", []),
        }

    except Exception as e:
        return {"result": "Error", "message": f"Error fetching JSON-LD from URL: {e}"}
   



        
def fetch_html(url):
    static_data = fetch_static_html(url)
    if static_data:
        # sitemap_status = fetch_xml_sitemap(url)
        static_data["httpsAuditResult"] = check_https_status(url)  # Add HTTPS audit result
        # static_data["sitemap_status"] = sitemap_status
        static_data["sitemap_status"] = check_siteMap(url)
        static_data["mobile_friendly"] = check_mobile_friendly(url)
        static_data["page_speed"] = check_page_speed(url)
        static_data["structured_data_validation"] = check_strucutre_data(url)
       
        
        # Validate data
        validation_results = validate_seo_data(static_data)
        static_data["validation"] = validation_results

        print("Static HTML", static_data)
        return "Static HTML", static_data
        

    dynamic_data = fetch_dynamic_html(url)
    if dynamic_data:
        # sitemap_status = fetch_xml_sitemap(url)
        dynamic_data["httpsAuditResult"] = check_https_status(url)  # Add HTTPS audit result
        dynamic_data["sitemap_status"] = check_siteMap(url)
        dynamic_data["mobile_friendly"] = check_mobile_friendly(url)
        dynamic_data["page_speed"] = check_page_speed(url)
        dynamic_data["structured_data_validation"] = check_strucutre_data(url)
       


    
        # Validate data
        validation_results = validate_seo_data(dynamic_data)
        dynamic_data["validation"] = validation_results

        return "Dynamic HTML", dynamic_data

    return "Failed", None

# new version 2 with scoring algo
def validate_seo_data(data):
    """
    Validate the scraped SEO data against recommended guidelines, including a "half-valid" metric.
    """
    # Define validation requirements
    recommendations = {
        "title": (50, 60, "Title length should be between 50-60 characters.", 40, 70),
        "meta_description": (150, 160, "Meta description length should be between 150-160 characters.", 120, 190),
        # Add more fields if needed
    }

    # Store validation results
    validation_results = {}

    # Validate each field
    for field, (min_length, max_length, message, half_min, half_max) in recommendations.items():
        if field in data and data[field]:
            length = len(data[field])
            is_valid = min_length <= length <= max_length
            half_valid = half_min <= length <= half_max and not is_valid

            validation_results[field] = {
                "value": data[field],
                "length": length,
                "is_valid": is_valid,
                "half_valid": half_valid,
                "requirement": message,
            }
        else:
            validation_results[field] = {
                "value": "Missing",
                "length": 0,
                "is_valid": False,
                "half_valid": False,
                "requirement": message,
            }

    return validation_results

# old version 1 with scoring algo
# def validate_seo_data(data):
#     """
#     Validate the scraped SEO data against recommended guidelines.
#     """
#     # Define validation requirements
#     recommendations = {
#         "title": (50, 60, "Title length should be between 50-60 characters."),
#         "meta_description": (150, 160, "Meta description length should be between 150-160 characters."),
#         # Add more fields if needed
#     }

#     # Store validation results
#     validation_results = {}

#     # Validate each field
#     for field, (min_length, max_length, message) in recommendations.items():
#         if field in data and data[field]:
#             length = len(data[field])
#             validation_results[field] = {
#                 "value": data[field],
#                 "length": length,
#                 "is_valid": min_length <= length <= max_length,
#                 "requirement": message,
#             }
#         else:
#             validation_results[field] = {
#                 "value": "No data",
#                 "length": 0,
#                 "is_valid": False,
#                 "requirement": message,
#             }

#     return validation_results


# Unified function for fetching either static or dynamic HTML
# def fetch_html(url):
#     title, meta_description, canonical = fetch_static_html(url)
#     if title and meta_description:
#         return "Static HTML", title, meta_description
    
#     title, meta_description = fetch_dynamic_html(url)
#     if title and meta_description:
#         return "Dynamic HTML", title, meta_description
    
#     return "Failed", None, None


# def check_webpage_https(url):
#     script_path = r"C:\Users\huiying\Downloads\SIT_Y3_Sem1\capstone\seo-capstone-hhy\seoProject\httpsCheck.mjs"
#     try:
#         # Call the .mjs file using Node.js
#         result = subprocess.run(
            
#             ["node", script_path, url],
#             capture_output=True,
#             text=True,
#             timeout=90,
#             # encoding='utf-8' 
#         )

#         print("Raw stdout output:", result.stdout)  # Debug: print raw stdout
#         print("Raw stderr output:", result.stderr)  # Debug: print raw stderr

#         if result.returncode == 0:

#             # Parse the JSON output from the .mjs script
#             output = json.loads(result.stdout)

#             print("http output", output)
            
#             https_check_result = output.get("httpsAuditResult", "Unknown")
#             print("http check result output", https_check_result)
#             # https_check_outcome_msg = output.get("httpsAuditResultTitle", "Unknown")

#             if https_check_result == "Pass":
#                 return "Pass" 
#             # , https_check_outcome_msg
#             elif https_check_result == "Fail":
#                 return "Fail"
#             # , https_check_outcome_msg
#             else:
#                 return "Error Output"
#         else:
#             return f"Error: {result.stderr}"

#     except Exception as e: 
#         return f"Error checking page speed: {e}"