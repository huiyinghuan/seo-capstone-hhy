import requests
from bs4 import BeautifulSoup
from jsonschema import validate, ValidationError
import json
from datetime import datetime

# Function to fetch the HTML content of a page
def fetch_html(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return None

# Function to fetch the Schema.org definition for a specific type
def fetch_schema_definition(schema_type="Thing"):
    url = "https://schema.org/version/latest/schemaorg-current-https.jsonld"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching schema definition: {e}")
        return None

# Function to validate the JSON-LD structured data against Schema.org definitions
def validate_jsonld(jsonld_data):
    results = {}
    try:
        schema_type = jsonld_data.get("@type", "Thing")
        schema = fetch_schema_definition(schema_type)
        if not schema:
            results["valid"] = False
            results["error"] = f"Schema definition not found for {schema_type}"
            results["details"] = None
            return results

        try:
            validate(instance=jsonld_data, schema=schema)
            results["valid"] = True
            results["error"] = None
            results["details"] = f"JSON-LD block is valid according to Schema.org definition for type '{schema_type}'."
        except ValidationError as e:
            results["valid"] = False
            results["error"] = e.message
            results["details"] = {
                "failed_validator": e.validator,
                "validator_value": e.validator_value,
                "instance_path": list(e.path),
                "schema_path": list(e.schema_path)
            }
    except json.JSONDecodeError:
        results["valid"] = False
        results["error"] = "Invalid JSON-LD format"
        results["details"] = None

    return results

# Function to extract JSON-LD structured data from HTML
def extract_jsonld_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    scripts = soup.find_all('script', {'type': 'application/ld+json'})
    jsonld_blocks = []
    for script in scripts:
        if script.string:
            try:
                data = json.loads(script.string)
                if isinstance(data, list):
                    jsonld_blocks.extend(data)
                else:
                    jsonld_blocks.append(data)
            except json.JSONDecodeError as e:
                print("Error decoding JSON-LD:", e)
    
    # Debugging output to inspect extracted JSON-LD blocks and their types
    print("\n--- Extracted JSON-LD Blocks ---")
    for idx, block in enumerate(jsonld_blocks):
        print(f"Block #{idx + 1}: {json.dumps(block, indent=2)}")
        print(f"Type: {block.get('@type', 'No type specified')}")
    
    return jsonld_blocks

# Main function to perform the test
def test_structured_data_validation(url):
    # Step 1: Fetch HTML content from the URL
    html_content = fetch_html(url)
    if not html_content:
        print("Failed to fetch HTML content.")
        return

    # Step 2: Extract JSON-LD structured data
    jsonld_blocks = extract_jsonld_from_html(html_content)
    if not jsonld_blocks:
        print("No JSON-LD structured data found.")
        return

    # Initialize summary data
    valid_items = {}
    invalid_items = {}
    total_valid = 0
    total_invalid = 0

    # Step 3: Validate each JSON-LD block
    for idx, block in enumerate(jsonld_blocks):
        result = validate_jsonld(block)
        schema_type = block.get("@type", "Thing")
        if result["valid"]:
            if schema_type not in valid_items:
                valid_items[schema_type] = 0
            valid_items[schema_type] += 1
            total_valid += 1
        else:
            if schema_type not in invalid_items:
                invalid_items[schema_type] = 0
            invalid_items[schema_type] += 1
            total_invalid += 1

    # Step 4: Output summary
    print("\n--- Structured Data Validation Summary ---")
    print(f"Crawled successfully on {datetime.now().strftime('%b %d, %Y, %I:%M:%S %p')}")
    print(f"Total detected structured data: {len(jsonld_blocks)} items")
    
    # Display valid items summary
    if valid_items:
        print("\nValid items:")
        for item_type, count in valid_items.items():
            print(f"  {item_type}: {count} valid item(s) detected")
    
    # Display invalid items summary
    if invalid_items:
        print("\nInvalid items:")
        for item_type, count in invalid_items.items():
            print(f"  {item_type}: {count} invalid item(s) detected")
    
    # Display overall valid and invalid counts
    print(f"\nTotal valid items detected: {total_valid}")
    print(f"Total invalid items detected: {total_invalid}")
    
    # Display Google Rich Results eligibility
    if total_valid > 0:
        print("\nValid items are eligible for Google Search's rich results. Learn more.")
    else:
        print("\nNo valid items detected for rich results.")

if __name__ == "__main__":
    url = "https://www.channelnewsasia.com/commentary/education-master-degrees-qualifications-useless-tuition-fees-4802721"  # Example URL
    test_structured_data_validation(url)
