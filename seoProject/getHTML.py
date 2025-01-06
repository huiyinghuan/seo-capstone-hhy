import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from urllib.parse import urljoin
import subprocess
import json


def fetch_static_html(url):
    try:
        print(f"Fetching static HTML for: {url}")
        response = requests.get(url, timeout=10)
        https_status = "Yes" if url.startswith("https") else "No"
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

            result = {
                "https": https_status,
                "title": title,
                "meta_description": meta_description,
                "canonical": canonical,
                "robots": robots,
                "headings": headings,
                "structured_data": structured_data
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

        driver.quit()

        return {
            "title": title,
            "meta_description": meta_description,
            "canonical": canonical,
            "robots": robots,
            "headings": headings,
            "structured_data": structured_data
        }
    except Exception as e:
        return None

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

def check_mobile_friendly(url):
    script_path = r"C:\Users\huiying\Downloads\SIT_Y3_Sem1\capstone\seo-capstone-hhy\seoProject\mobileFriendlyCheck.mjs"
    #script_path = r"/Users/huanhuiying/Documents/seo-capstone-hhy/seoProject/mobileFriendlyCheck.mjs"

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
    script_path = r"C:\Users\huiying\Downloads\SIT_Y3_Sem1\capstone\seo-capstone-hhy\seoProject\pageSpeedCheck.mjs"
    #script_path = r"/Users/huanhuiying/Documents/seo-capstone-hhy/seoProject/pageSpeedCheck.mjs"
    try:
        # Call the .mjs file using Node.js
        result = subprocess.run(
            
            ["node", script_path, url],
            capture_output=True,
            text=True,
            timeout=90,
            # encoding='utf-8' 
        )

        print("Raw stdout output:", result.stdout)  # Debug: print raw stdout
        print("Raw stderr output:", result.stderr)  # Debug: print raw stderr


        # Parse the JSON output from the .mjs script
        output = json.loads(result.stdout)
        
        assessment_result = output.get("Core Web Vital Assessment", "Unknown")
        
        if assessment_result == "Pass":
            return "Pass"
        elif assessment_result == "Fail":
            print("Core Web Vitals Assessment: Fail")
            print("Detailed Output:", json.dumps(output, indent=2))  # Print full output if failed
            return "Fail"
        
        else:
            return "Error Output"

    except Exception as e:
        return f"Error checking page speed: {e}"

def fetch_html(url):
    static_data = fetch_static_html(url)
    if static_data:
        sitemap_status = fetch_xml_sitemap(url)
        static_data["sitemap_status"] = sitemap_status
        static_data["mobile_friendly"] = check_mobile_friendly(url)
        static_data["page_speed"] = check_page_speed(url)

        # Validate data
        validation_results = validate_seo_data(static_data)
        static_data["validation"] = validation_results

        print("Static HTML", static_data)
        return "Static HTML", static_data
        

    dynamic_data = fetch_dynamic_html(url)
    if dynamic_data:
        sitemap_status = fetch_xml_sitemap(url)
        dynamic_data["sitemap_status"] = sitemap_status
        dynamic_data["mobile_friendly"] = check_mobile_friendly(url)
        dynamic_data["page_speed"] = check_page_speed(url)

        # Validate data
        validation_results = validate_seo_data(dynamic_data)
        dynamic_data["validation"] = validation_results

        return "Dynamic HTML", dynamic_data

    return "Failed", None



def validate_seo_data(data):
    """
    Validate the scraped SEO data against recommended guidelines.
    """
    # Define validation requirements
    recommendations = {
        "title": (50, 60, "Title length should be between 50-60 characters."),
        "meta_description": (150, 160, "Meta description length should be between 150-160 characters."),
        # Add more fields if needed
    }

    # Store validation results
    validation_results = {}

    # Validate each field
    for field, (min_length, max_length, message) in recommendations.items():
        if field in data and data[field]:
            length = len(data[field])
            validation_results[field] = {
                "value": data[field],
                "length": length,
                "is_valid": min_length <= length <= max_length,
                "requirement": message,
            }
        else:
            validation_results[field] = {
                "value": "No data",
                "length": 0,
                "is_valid": False,
                "requirement": message,
            }

    return validation_results


# Unified function for fetching either static or dynamic HTML
# def fetch_html(url):
#     title, meta_description, canonical = fetch_static_html(url)
#     if title and meta_description:
#         return "Static HTML", title, meta_description
    
#     title, meta_description = fetch_dynamic_html(url)
#     if title and meta_description:
#         return "Dynamic HTML", title, meta_description
    
#     return "Failed", None, None
