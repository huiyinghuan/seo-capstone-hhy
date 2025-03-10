import requests
from urllib.parse import urlparse, urljoin

def get_base_url(url):
    """
    Extracts the base URL (scheme + domain) from a full URL.
    Example: 
    Input:  'https://www.channelnewsasia.com/east-asia/manus-new-ai-china-deepseek-4983936'
    Output: 'https://www.channelnewsasia.com'
    """
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}"

def fetch_xml_sitemap(base_url):
    """
    Checks for a sitemap by looking at common sitemap locations.
    """
    common_sitemap_paths = [
        "/sitemap.xml",
        "/sitemap_index.xml",
        "/sitemap1.xml",
        "/sitemap-index.xml",
        "/sitemap/sitemap.xml",
        "/sitemap.php",
        "/sitemap.txt"
    ]

    for path in common_sitemap_paths:
        sitemap_url = urljoin(base_url, path)
        try:
            response = requests.get(sitemap_url, timeout=10)
            if response.status_code == 200:
                return f"Sitemap found: {sitemap_url}"
        except requests.RequestException:
            continue  # Ignore errors and try the next one

    return "No sitemap found"

def fetch_sitemap_from_robots(base_url):
    """
    Checks the robots.txt file for a declared sitemap.
    """
    robots_url = urljoin(base_url, "/robots.txt")
    
    try:
        response = requests.get(robots_url, timeout=10)
        if response.status_code == 200:
            lines = response.text.split("\n")
            sitemaps = [line.split(": ")[1] for line in lines if line.lower().startswith("sitemap:")]
            
            if sitemaps:
                return {"sitemaps_found": sitemaps}
    
    except requests.RequestException:
        pass  # Ignore errors

    return {"sitemaps_found": [], "message": "No sitemap found in robots.txt"}

# Example usage:
full_url = "https://www.channelnewsasia.com/east-asia/manus-new-ai-china-deepseek-4983936"

# Extract the base domain
base_url = get_base_url(full_url)

# Check common sitemap locations first
sitemap_result = fetch_xml_sitemap(base_url)

# If not found, check robots.txt
if "No sitemap found" in sitemap_result:
    sitemap_result = fetch_sitemap_from_robots(base_url)

print(sitemap_result)
