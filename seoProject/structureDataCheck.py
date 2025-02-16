<<<<<<< HEAD
import json
import requests

# Step 1: Load the Schema.org JSON-LD vocabulary
def load_schema_vocabulary(url):
    try:
        response = requests.get(url)
        schema_data = response.json()
        return schema_data
    except Exception as e:
        print(f"Error loading Schema.org vocabulary: {e}")
        return None

# Step 2: Extract types and properties from the Schema.org vocabulary
def extract_schema_types_and_properties(schema_data):
    types_and_properties = {}

    # Iterate through the @graph part of the vocabulary, which contains types and properties
    for item in schema_data["@graph"]:
        if "@type" in item and item["@type"] == "Class":
            # Extract valid types
            types_and_properties[item["@id"]] = {
                "type": "Class",
                "properties": set()
            }

        if "@type" in item and item["@type"] == "Property":
            # Extract valid properties
            domain = item.get("domainIncludes", [])
            for domain_type in domain:
                if domain_type not in types_and_properties:
                    types_and_properties[domain_type] = {
                        "type": "Class",
                        "properties": set()
                    }
                types_and_properties[domain_type]["properties"].add(item["@id"])

    return types_and_properties

# Step 3: Validate the structured data
def validate_structured_data(structured_data, types_and_properties):
    issues = []

    # Check if @graph exists, if not treat the structured data as a single object
    if "@graph" in structured_data:
        items_to_validate = structured_data["@graph"]
    else:
        items_to_validate = [structured_data]

    # Validate each item in the graph (or the single root item)
    for item in items_to_validate:
        if "@type" not in item:
            issues.append("Missing '@type' key")
            continue
        
        item_type = item["@type"]
        
        if item_type not in types_and_properties:
            issues.append(f"Invalid type: '{item_type}'")
            continue

        properties = item.keys()
        valid_properties = types_and_properties.get(item_type, [])
        
        for prop in properties:
            if prop not in valid_properties:
                issues.append(f"Invalid property: '{prop}' for type '{item_type}'")

    return issues


# Step 4: Main function to run the validation
def main():
    schema_url = "https://schema.org/version/latest/schemaorg-current-https.jsonld"
    structured_data = """
    {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Racial and religious harmony scores rise in Singapore: IPS study",
    "name": "Racial and religious harmony scores rise in Singapore: IPS study",
    "description": "Researchers polled a representative sample of 4,000 Singaporeans and permanent residents aged 18 and above. Read more at straitstimes.com.",
    "image": {
        "@type": "ImageObject",
        "representativeOfPage": "True",
        "url": "https://cassette.sphdigital.com.sg/image/straitstimes/45d54436a1677b8a42fb080cd5a8c16bc77f7818fefeac42108cd7975a379103"
    },
    "datePublished": "2025-02-03T16:00:00+08:00",
    "dateModified": "2025-02-03T23:00:39+08:00",
    "isAccessibleForFree": "True",
    "author": [{
        "@type": "Person",
        "name": "Tham Yuen-C",
        "jobTitle": "Senior Political Correspondent",
        "url": "https://www.straitstimes.com/authors/tham-yuen-c"
    }],
    "publisher": {
        "@type": "Organization",
        "name": "The Straits Times"
    },
    "mainEntityOfPage": "https://www.straitstimes.com/singapore/racial-and-religious-harmony-scores-rise-in-spore-study"
    }

    """
    
    # Parse the structured data
    structured_data = json.loads(structured_data)

    # Load Schema.org vocabulary
    schema_data = load_schema_vocabulary(schema_url)
    if not schema_data:
        return

    # Extract types and properties from Schema.org
    types_and_properties = extract_schema_types_and_properties(schema_data)

    # Validate the structured data
    issues = validate_structured_data(structured_data, types_and_properties)

    # Output issues
    if issues:
        print("Validation Issues:")
        for issue in issues:
            print(f"- {issue}")
    else:
        print("No validation issues found!")

if __name__ == "__main__":
    main()
=======
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
>>>>>>> e47443c8824bdd271d25061d498d4ea2afd0b41f
