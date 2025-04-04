// import requests
// from urllib.parse import urlparse, urljoin
// import sys

// def get_base_url(url):
//     """
//     Extracts the base URL (scheme + domain) from a full URL.
//     Example: 
//     Input:  'https://www.channelnewsasia.com/east-asia/manus-new-ai-china-deepseek-4983936'
//     Output: 'https://www.channelnewsasia.com'
//     """
//     parsed_url = urlparse(url)
//     return f"{parsed_url.scheme}://{parsed_url.netloc}"

// def fetch_xml_sitemap(base_url):
//     """
//     Checks for a sitemap by looking at common sitemap locations.
//     """
//     common_sitemap_paths = [
//         "/sitemap.xml",
//         "/sitemap_index.xml",
//         "/sitemap1.xml",
//         "/sitemap-index.xml",
//         "/sitemap/sitemap.xml",
//         "/sitemap.php",
//         "/sitemap.txt"
//     ]

//     for path in common_sitemap_paths:
//         sitemap_url = urljoin(base_url, path)
//         try:
//             response = requests.get(sitemap_url, timeout=10)
//             if response.status_code == 200:
//                 return {"sitemap_found": True, "sitemap_url": sitemap_url}
//         except requests.RequestException:
//             continue  # Ignore errors and try the next one

//     return {"sitemap_found": False, "message": "No sitemap found"}

// def fetch_sitemap_from_robots(base_url):
//     """
//     Checks the robots.txt file for a declared sitemap.
//     """
//     robots_url = urljoin(base_url, "/robots.txt")
    
//     try:
//         response = requests.get(robots_url, timeout=10)
//         if response.status_code == 200:
//             lines = response.text.split("\n")
//             sitemaps = [line.split(": ")[1] for line in lines if line.lower().startswith("sitemap:")]
            
//             if sitemaps:
//                 return {"sitemap_found": True, "sitemaps": sitemaps}
    
//     except requests.RequestException:
//         pass  # Ignore errors

//     #return {"sitemaps_found": [], "message": "No sitemap found in robots.txt"}
//     return {"sitemap_found": False, "message": "No sitemap found in robots.txt"}


// def main():
//     if len(sys.argv) < 2:
//         print("Error: No URL provided.")
//         print("Usage: python script.py <URL>")
//         sys.exit(1)

//     full_url = sys.argv[1]

//     if not full_url.startswith(("http://", "https://")):
//         print("Error: Please provide a valid URL (e.g., https://example.com).")
//         sys.exit(1)

//     # Extract base domain
//     base_url = get_base_url(full_url)

//     # Check common sitemap locations first
//     sitemap_result = fetch_xml_sitemap(base_url)

//     # If not found, check robots.txt
//     if not sitemap_result["sitemap_found"]:
//         sitemap_result = fetch_sitemap_from_robots(base_url)

//     print(sitemap_result)

// if __name__ == "__main__":
//     main()

// # Example usage:
// # full_url = "https://www.channelnewsasia.com/east-asia/manus-new-ai-china-deepseek-4983936"

// # # Extract the base domain
// # base_url = get_base_url(full_url)

// # # Check common sitemap locations first
// # sitemap_result = fetch_xml_sitemap(base_url)

// # # If not found, check robots.txt
// # if "No sitemap found" in sitemap_result:
// #     sitemap_result = fetch_sitemap_from_robots(base_url)

// v2
// # print(sitemap_result)
// import { URL } from 'url';
// import fetch from 'node-fetch';

// function getBaseUrl(url) {
//     /**
//      * Extracts the base URL (scheme + domain) from a full URL.
//      * Example:
//      * Input:  'https://www.channelnewsasia.com/east-asia/manus-new-ai-china-deepseek-4983936'
//      * Output: 'https://www.channelnewsasia.com'
//      */
//     const parsedUrl = new URL(url);
//     return `${parsedUrl.protocol}//${parsedUrl.host}`;
// }

// async function fetchXmlSitemap(baseUrl) {
//     /**
//      * Checks for a sitemap by looking at common sitemap locations.
//      */
//     const commonSitemapPaths = [
//         '/sitemap.xml',
//         '/sitemap_index.xml',
//         '/sitemap1.xml',
//         '/sitemap-index.xml',
//         '/sitemap/sitemap.xml',
//         '/sitemap.php',
//         '/sitemap.txt'
//     ];

//     for (const path of commonSitemapPaths) {
//         const sitemapUrl = new URL(path, baseUrl).href;
//         try {
//             const response = await fetch(sitemapUrl, { timeout: 10000 });
//             if (response.ok) {
//                 return { sitemap_found: true, sitemap_url: sitemapUrl };
//             }
//         } catch (error) {
//             continue; // Ignore errors and try the next one
//         }
//     }
//     return { sitemap_found: false, message: 'No sitemap found' };
// }

// async function fetchSitemapFromRobots(baseUrl) {
//     /**
//      * Checks the robots.txt file for a declared sitemap.
//      */
//     const robotsUrl = new URL('/robots.txt', baseUrl).href;
//     try {
//         const response = await fetch(robotsUrl, { timeout: 10000 });
//         if (response.ok) {
//             const text = await response.text();
//             const lines = text.split('\n');
//             const sitemaps = lines
//                 .filter(line => line.toLowerCase().startsWith('sitemap:'))
//                 .map(line => line.split(': ')[1].trim());
            
//             if (sitemaps.length > 0) {
//                 return { sitemap_found: true, sitemaps };
//             }
//         }
//     } catch (error) {
//         // Ignore errors
//     }
//     return { sitemap_found: false, message: 'No sitemap found in robots.txt' };
// }

// async function main() {
//     const args = process.argv.slice(2);
//     if (args.length < 1) {
//         console.error('Error: No URL provided.');
//         console.error('Usage: node script.mjs <URL>');
//         process.exit(1);
//     }

//     const fullUrl = args[0];
//     if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
//         console.error('Error: Please provide a valid URL (e.g., https://example.com).');
//         process.exit(1);
//     }

//     const baseUrl = getBaseUrl(fullUrl);
//     let sitemapResult = await fetchXmlSitemap(baseUrl);

//     if (!sitemapResult.sitemap_found) {
//         sitemapResult = await fetchSitemapFromRobots(baseUrl);
//     }

//     console.log(JSON.stringify(sitemapResult, null, 2));
// }

// main().catch(console.error);


//v3
import fetch from 'node-fetch';

async function getBaseUrl(url) {
    /**
     * Extracts the base URL (scheme + domain) from a full URL.
     */
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.host}`;
    } catch (error) {
        throw new Error("Invalid URL format.");
    }
}

async function fetchXmlSitemap(baseUrl) {
    /**
     * Checks for a sitemap by looking at common sitemap locations.
     */
    const commonSitemapPaths = [
        '/sitemap.xml',
        '/sitemap_index.xml',
        '/sitemap1.xml',
        '/sitemap-index.xml',
        '/sitemap/sitemap.xml',
        '/sitemap.php',
        '/sitemap.txt'
    ];

    for (const path of commonSitemapPaths) {
        const sitemapUrl = new URL(path, baseUrl).href;
        try {
            const response = await fetch(sitemapUrl, { timeout: 10000 });
            if (response.ok) {
                return { sitemap_found: true, sitemap_url: sitemapUrl };
            }
        } catch (error) {
            continue; // Ignore errors and try the next one
        }
    }
    return { sitemap_found: false, message: 'No sitemap found at common locations.' };
}

async function fetchSitemapFromRobots(baseUrl) {
    /**
     * Checks the robots.txt file for a declared sitemap.
     */
    const robotsUrl = new URL('/robots.txt', baseUrl).href;
    try {
        const response = await fetch(robotsUrl, { timeout: 10000 });
        if (response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            const sitemaps = lines
                .filter(line => line.toLowerCase().startsWith('sitemap:'))
                .map(line => line.split(': ')[1].trim());

            if (sitemaps.length > 0) {
                return { sitemap_found: true, sitemaps };
            }
        }
    } catch (error) {
        console.error(`Error fetching robots.txt: ${error.message}`);
    }
    return { sitemap_found: false, message: 'No sitemap found in robots.txt.' };
}

async function checkSitemap(url) {
    /**
     * Runs the sitemap check process.
     */
    try {
        // console.log("Checking sitemap for:", url);

        const baseUrl = await getBaseUrl(url);
        let result = await fetchXmlSitemap(baseUrl);

        if (!result.sitemap_found) {
            result = await fetchSitemapFromRobots(baseUrl);
        }

        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Error checking sitemap:", error.message);
        console.log(JSON.stringify({ error: "Failed to check sitemap" }));
    }
}

// Get URL from command line arguments
const url = process.argv[2];

if (url) {
    checkSitemap(url).catch(err => console.error(err));
} else {
    console.error("No URL provided.");
}