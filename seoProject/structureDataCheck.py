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
