// // validateStructuredData.mjs
// // validateStructuredData.mjs
// import axios from "axios";
// import * as cheerio from "cheerio";
// import Ajv from "ajv";
// import addFormats from "ajv-formats";

// // Schema.org context URL
// const schemaUrl = "https://schema.org/version/latest/schemaorg-current-https.jsonld";

// // Function to validate structured data from a webpage
// async function validateStructuredDataFromURL(url) {
//   try {
//     // 1️⃣ Fetch the webpage content
//     const { data: html } = await axios.get(url);
//     const $ = cheerio.load(html);

//     // 2️⃣ Extract JSON-LD scripts
//     const jsonLdData = [];
//     $('script[type="application/ld+json"]').each((_, element) => {
//       const json = $(element).html();
//       if (json) {
//         try {
//           jsonLdData.push(JSON.parse(json));
//         } catch (parseError) {
//           console.error("⚠️ Invalid JSON-LD:", parseError);
//         }
//       }
//     });

//     if (jsonLdData.length === 0) {
//       console.warn("⚠️ No JSON-LD structured data found.");
//       return;
//     }

//     // 3️⃣ Fetch schema.org context
//     const { data: schema } = await axios.get(schemaUrl);

//     // 4️⃣ Initialize AJV validator
//     const ajv = new Ajv({ allErrors: true });
//     addFormats(ajv);
//     const validate = ajv.compile(schema);

//     // 5️⃣ Validate each JSON-LD block
//     jsonLdData.forEach((data, index) => {
//       const valid = validate(data);
//       console.log(`🧩 Validating JSON-LD Block ${index + 1}:`);
//       if (valid) {
//         console.log("✅ Valid structured data!");
//       } else {
//         console.error("❌ Invalid structured data:", validate.errors);
//       }
//     });

//   } catch (error) {
//     console.error("🚨 Error fetching or validating structured data:", error.message);
//   }
// }

// // 🌐 Example: Validate structured data from a website
// const websiteUrl = "https://www.channelnewsasia.com/commentary/education-master-degrees-qualifications-useless-tuition-fees-4802721";
// validateStructuredDataFromURL(websiteUrl);


// v2 working

// Import libraries
// import jsonld from 'jsonld';
// import fetch from 'node-fetch';
// import * as cheerio from "cheerio";

// // Function to fetch and validate JSON-LD from a webpage
// async function validateJsonLdFromUrl(url) {
//     try {
//         // Fetch the webpage content
//         const response = await fetch(url);
//         const html = await response.text();

//         // Load HTML content with cheerio
//         const $ = cheerio.load(html);

//         // Extract JSON-LD scripts
//         const jsonLdScripts = [];
//         $('script[type="application/ld+json"]').each((i, element) => {
//             const jsonLd = $(element).html();
//             try {
//                 const parsedJsonLd = JSON.parse(jsonLd);
//                 jsonLdScripts.push(parsedJsonLd);
//             } catch (error) {
//                 console.error(`❌ Error parsing JSON-LD script ${i + 1}:`, error.message);
//             }
//         });

//         // Validate each JSON-LD script
//         if (jsonLdScripts.length === 0) {
//             console.log('⚠️ No JSON-LD data found on the page.');
//             return;
//         }

//         for (let i = 0; i < jsonLdScripts.length; i++) {
//             const jsonLdData = jsonLdScripts[i];
//             try {
//                 // Compact JSON-LD to validate context
//                 const compacted = await jsonld.compact(jsonLdData, {});
//                 console.log(`✅ JSON-LD script ${i + 1} is valid:\n`, JSON.stringify(compacted, null, 2));
//             } catch (err) {
//                 console.error(`❌ JSON-LD validation failed for script ${i + 1}:`, err.message);
//             }
//         }
//     } catch (error) {
//         console.error('🚨 Error fetching or validating structured data:', error.message);
//     }
// }

// // Example usage
// const websiteUrl = 'https://www.channelnewsasia.com/commentary/education-master-degrees-qualifications-useless-tuition-fees-4802721'; // Replacing target website URL
// await validateJsonLdFromUrl(websiteUrl);




//v3
// import jsonld from 'jsonld';
// import fetch from 'node-fetch';
// import * as cheerio from "cheerio";

// // Function to fetch and validate JSON-LD from a webpage
// async function validateJsonLdFromUrl(url) {
//     try {
//         // Fetch the webpage content
//         const response = await fetch(url);
//         const html = await response.text();

//         // Load HTML content with cheerio
//         const $ = cheerio.load(html);

//         // Extract JSON-LD scripts
//         const jsonLdScripts = [];
//         $('script[type="application/ld+json"]').each((i, element) => {
//             const jsonLd = $(element).html();
//             try {
//                 const parsedJsonLd = JSON.parse(jsonLd);
//                 jsonLdScripts.push(parsedJsonLd);
//             } catch (error) {
//                 console.error(`❌ Error parsing JSON-LD script ${i + 1}:`, error.message);
//             }
//         });

//         if (jsonLdScripts.length === 0) {
//             console.log('⚠️ No JSON-LD data found on the page.');
//             return;
//         }

//         console.log(`🔍 Detected ${jsonLdScripts.length} JSON-LD script(s).`);

//         // Loop through each JSON-LD script and extract the type and properties
//         for (let i = 0; i < jsonLdScripts.length; i++) {
//             const jsonLdData = jsonLdScripts[i];

//             try {
//                 // Check if the JSON-LD contains a '@type' key and get its value
//                 const jsonLdType = jsonLdData['@type'] || jsonLdData['@context'];

//                 // If a @type is found, log the type and its properties
//                 if (jsonLdType) {
//                     console.log(`\n✅ JSON-LD Script ${i + 1} contains type: ${jsonLdType}`);
//                     logJsonLdProperties(jsonLdData);
//                 } else {
//                     console.log(`⚠️ JSON-LD Script ${i + 1} does not have a valid @type field.`);
//                 }

//                 // Compact JSON-LD to validate context
//                 const compacted = await jsonld.compact(jsonLdData, {});
//                 console.log(`✅ JSON-LD script ${i + 1} is valid:\n`, JSON.stringify(compacted, null, 2));

//             } catch (err) {
//                 console.error(`❌ JSON-LD validation failed for script ${i + 1}:`, err.message);
//             }
//         }
//     } catch (error) {
//         console.error('🚨 Error fetching or validating structured data:', error.message);
//     }
// }

// // Function to log the properties of JSON-LD data
// function logJsonLdProperties(jsonLdData) {
//     // Iterate over each key in the JSON-LD data and log its value
//     for (const [key, value] of Object.entries(jsonLdData)) {
//         // If it's an object, log the structure recursively
//         if (typeof value === 'object' && !Array.isArray(value)) {
//             console.log(`  ${key}: {`);
//             logJsonLdProperties(value);
//             console.log(`  }`);
//         } else if (Array.isArray(value)) {
//             // If it's an array, log each item
//             console.log(`  ${key}: [`);
//             value.forEach((item, index) => {
//                 if (typeof item === 'object') {
//                     logJsonLdProperties(item);
//                 } else {
//                     console.log(`${item}`);
//                 }
//             });
//             console.log(`  ]`);
//         } else {
//             console.log(`  ${key}: ${value}`);
//         }
//     }
// }

// // Example usage
// const websiteUrl = 'https://www.channelnewsasia.com/commentary/education-master-degrees-qualifications-useless-tuition-fees-4802721'; // Replacing target website URL
// await validateJsonLdFromUrl(websiteUrl);


//v4
// import jsonld from 'jsonld';
// import fetch from 'node-fetch';
// import * as cheerio from "cheerio";

// // Function to fetch and validate JSON-LD from a webpage
// async function validateJsonLdFromUrl(url) {
//     try {
//         // Fetch the webpage content
//         const response = await fetch(url);
        
//         // Check if the response was successful (status 200)
//         if (!response.ok) {
//             console.error(`🚨 Error: Failed to fetch the URL. Status: ${response.status} ${response.statusText}`);
//             return;
//         }

//         const html = await response.text();

//         // Load HTML content with cheerio
//         const $ = cheerio.load(html);

//         // Extract JSON-LD scripts
//         const jsonLdScripts = [];
//         $('script[type="application/ld+json"]').each((i, element) => {
//             const jsonLd = $(element).html();
//             try {
//                 const parsedJsonLd = JSON.parse(jsonLd);
//                 jsonLdScripts.push(parsedJsonLd);
//             } catch (error) {
//                 console.error(`❌ Error parsing JSON-LD script ${i + 1}:`, error.message);
//             }
//         });

//         if (jsonLdScripts.length === 0) {
//             console.log('⚠️ No JSON-LD data found on the page.');
//             return;
//         }

//         console.log(`🔍 Detected ${jsonLdScripts.length} JSON-LD script(s).`);

//         // Track the types of items
//         let validItemCount = 0;
//         const itemTypes = {};

//         // Loop through each JSON-LD script and extract the type and properties
//         for (let i = 0; i < jsonLdScripts.length; i++) {
//             const jsonLdData = jsonLdScripts[i];

//             try {
//                 // Check if the JSON-LD contains a '@type' key and get its value
//                 const jsonLdType = jsonLdData['@type'] || jsonLdData['@context'];

//                 // If a @type is found, log the type and its properties
//                 if (jsonLdType) {
//                     validItemCount++;
//                     if (!itemTypes[jsonLdType]) {
//                         itemTypes[jsonLdType] = [];
//                     }
//                     itemTypes[jsonLdType].push(jsonLdData);
//                     console.log(`\n✅ JSON-LD Script ${i + 1} contains type: ${jsonLdType}`);
//                     logJsonLdProperties(jsonLdData);
//                 } else {
//                     console.log(`⚠️ JSON-LD Script ${i + 1} does not have a valid @type field.`);
//                 }

//                 // Compact JSON-LD to validate context
//                 const compacted = await jsonld.compact(jsonLdData, {});
//                 console.log(`✅ JSON-LD script ${i + 1} is valid:\n`, JSON.stringify(compacted, null, 2));

//             } catch (err) {
//                 console.error(`❌ JSON-LD validation failed for script ${i + 1}:`, err.message);
//             }
//         }

//         console.log(`\n📊 Total valid JSON-LD item types detected: ${validItemCount}`);
//         for (const [type, items] of Object.entries(itemTypes)) {
//             console.log(`\n🏷️ Type: ${type} - Number of Items: ${items.length}`);
//             items.forEach((item, index) => {
//                 console.log(`  Item ${index + 1}:`);
//                 logJsonLdProperties(item);
//             });
//         }
//     } catch (error) {
//         console.error('🚨 Error fetching or validating structured data:', error.message);
//     }
// }

// // Function to log the properties of JSON-LD data
// function logJsonLdProperties(jsonLdData) {
//     // Iterate over each key in the JSON-LD data and log its value
//     for (const [key, value] of Object.entries(jsonLdData)) {
//         // If it's an object, log the structure recursively
//         if (typeof value === 'object' && !Array.isArray(value)) {
//             console.log(`  ${key}: {`);
//             logJsonLdProperties(value);
//             console.log(`  }`);
//         } else if (Array.isArray(value)) {
//             // If it's an array, log each item
//             console.log(`  ${key}: [`);
//             value.forEach((item, index) => {
//                 if (typeof item === 'object') {
//                     logJsonLdProperties(item);
//                 } else {
//                     console.log(`    ${item}`);
//                 }
//             });
//             console.log(`  ]`);
//         } else {
//             console.log(`  ${key}: ${value}`);
//         }
//     }
// }

// // Example usage
// const websiteUrl = 'https://www.channelnewsasia.com/commentary/education-master-degrees-qualifications-useless-tuition-fees-4802721'; // Replacing target website URL
// await validateJsonLdFromUrl(websiteUrl);


//v5
// import jsonld from 'jsonld';
// import fetch from 'node-fetch';
// import * as cheerio from "cheerio";

// // Function to fetch and validate JSON-LD from a webpage
// async function validateJsonLdFromUrl(url) {
//     try {
//         // Fetch the webpage content
//         const response = await fetch(url);
        
//         // Check if the response was successful (status 200)
//         if (!response.ok) {
//             console.error(`🚨 Error: Failed to fetch the URL. Status: ${response.status} ${response.statusText}`);
//             return;
//         }

//         const html = await response.text();

//         // Load HTML content with cheerio
//         const $ = cheerio.load(html);

//         // Extract JSON-LD scripts
//         const jsonLdScripts = [];
//         $('script[type="application/ld+json"]').each((i, element) => {
//             const jsonLd = $(element).html();
//             console.log(`🔍 Extracted JSON-LD from script ${i + 1}: ${jsonLd}`); // Logging the raw JSON-LD
//             try {
//                 const parsedJsonLd = JSON.parse(jsonLd);
//                 jsonLdScripts.push(parsedJsonLd);
//             } catch (error) {
//                 console.error(`❌ Error parsing JSON-LD script ${i + 1}:`, error.message);
//             }
//         });

//         if (jsonLdScripts.length === 0) {
//             console.log('⚠️ No JSON-LD data found on the page.');
//             return;
//         }

//         console.log(`🔍 Detected ${jsonLdScripts.length} JSON-LD script(s).`);

//         // Track the valid items and their types
//         let validItemCount = 0;
//         const validItems = [];

//         // Loop through each JSON-LD script and extract the type and properties
//         for (let i = 0; i < jsonLdScripts.length; i++) {
//             const jsonLdData = jsonLdScripts[i];

//             try {
//                 // Check if the JSON-LD contains a '@type' key and get its value
//                 const jsonLdType = jsonLdData['@type'] || jsonLdData['@context'];

//                 // If a @type is found, log the type and its properties
//                 if (jsonLdType) {
//                     validItemCount++;
//                     validItems.push({ type: jsonLdType, data: jsonLdData });
//                     console.log(`\n✅ JSON-LD Script ${i + 1} contains type: ${jsonLdType}`);
//                     logJsonLdProperties(jsonLdData);
//                 } else {
//                     console.log(`⚠️ JSON-LD Script ${i + 1} does not have a valid @type field.`);
//                 }

//                 // Compact JSON-LD to validate context
//                 const compacted = await jsonld.compact(jsonLdData, {});
//                 console.log(`✅ JSON-LD script ${i + 1} is valid:\n`, JSON.stringify(compacted, null, 2));

//             } catch (err) {
//                 console.error(`❌ JSON-LD validation failed for script ${i + 1}:`, err.message);
//             }
//         }

//         // Log the total number of valid items detected
//         console.log(`\n📊 Total valid items detected: ${validItemCount}`);

//         // Log the structure of each valid item
//         validItems.forEach((item, index) => {
//             console.log(`\n🏷️ Item ${index + 1} (Type: ${item.type}):`);
//             logJsonLdProperties(item.data);
//         });

//     } catch (error) {
//         console.error('🚨 Error fetching or validating structured data:', error.message);
//     }
// }

// // Function to log the properties of JSON-LD data
// function logJsonLdProperties(jsonLdData) {
//     // Iterate over each key in the JSON-LD data and log its value
//     for (const [key, value] of Object.entries(jsonLdData)) {
//         // If it's an object, log the structure recursively
//         if (typeof value === 'object' && !Array.isArray(value)) {
//             console.log(`  ${key}: {`);
//             logJsonLdProperties(value);
//             console.log(`  }`);
//         } else if (Array.isArray(value)) {
//             // If it's an array, log each item
//             console.log(`  ${key}: [`);
//             value.forEach((item, index) => {
//                 if (typeof item === 'object') {
//                     logJsonLdProperties(item);
//                 } else {
//                     console.log(`    ${item}`);
//                 }
//             });
//             console.log(`  ]`);
//         } else {
//             console.log(`  ${key}: ${value}`);
//         }
//     }
// }

// // Example usage
// const websiteUrl = 'https://www.channelnewsasia.com/commentary/education-master-degrees-qualifications-useless-tuition-fees-4802721'; // Replacing target website URL
// await validateJsonLdFromUrl(websiteUrl);


//v6
// Function to fetch and validate JSON-LD from a webpage
import jsonld from 'jsonld';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Function to fetch and validate JSON-LD from a webpage
async function validateJsonLdFromUrl(url) {
    try {
        // Fetch the webpage content
        const response = await fetch(url);
        
        // Check if the response was successful (status 200)
        if (!response.ok) {
            console.error(`🚨 Error: Failed to fetch the URL. Status: ${response.status} ${response.statusText}`);
            return;
        }

        const html = await response.text();

        // Load HTML content with cheerio
        const $ = cheerio.load(html);

        // Extract JSON-LD scripts
        const jsonLdScripts = [];
        $('script[type="application/ld+json"]').each((i, element) => {
            const jsonLd = $(element).html();
            console.log(`🔍 Extracted JSON-LD from Script ${i + 1}:`);
            console.log(jsonLd); // Logging the raw JSON-LD content
            try {
                const parsedJsonLd = JSON.parse(jsonLd);
                jsonLdScripts.push(parsedJsonLd);
            } catch (error) {
                console.error(`❌ Error parsing JSON-LD script ${i + 1}:`, error.message);
            }
        });

        if (jsonLdScripts.length === 0) {
            console.log('⚠️ No JSON-LD data found on the page.');
            return;
        }

        // Track the valid items and their types
        let validItemCount = 0;
        const validItems = [];

        // Loop through each JSON-LD script and extract the type and properties
        for (let i = 0; i < jsonLdScripts.length; i++) {
            const jsonLdData = jsonLdScripts[i];
            let scriptValidItems = [];

            try {
                // Check if the JSON-LD contains a '@graph' key
                if (jsonLdData['@graph']) {
                    const graph = jsonLdData['@graph'];

                    graph.forEach(item => {
                        // Check for a valid @type for each item in the @graph
                        const jsonLdType = item['@type'];
                        if (jsonLdType) {
                            scriptValidItems.push(jsonLdType);
                            // Log each item type found
                            console.log(`🔑 Found valid item in @graph: ${jsonLdType}`);
                        }
                    });

                    validItemCount += scriptValidItems.length;

                    // Log the number of valid structured items
                    console.log(`Valid structured items found in @graph: ${scriptValidItems.length}`);
                    scriptValidItems.forEach(type => {
                        console.log(`- ${type} (Contains details like headline, description, image, author, publisher, etc.)`);
                    });
                } else {
                    console.log(`⚠️ JSON-LD Script ${i + 1} does not have a valid '@graph' field.`);
                }

                // Compact JSON-LD to validate context
                const compacted = await jsonld.compact(jsonLdData, {});
                console.log(`✅ JSON-LD script ${i + 1} is valid:\n`, JSON.stringify(compacted, null, 2));

            } catch (err) {
                console.error(`❌ JSON-LD validation failed for script ${i + 1}:`, err.message);
            }

            // Store valid items for final summary
            validItems.push({
                scriptIndex: i + 1,
                validItemTypes: scriptValidItems
            });
        }

        // Log the total number of valid structured items (based on @type in all scripts)
        console.log(`\n📊 Total valid items: ${validItemCount}`);

        // Log a summary of valid items for each script
        validItems.forEach((item, index) => {
            console.log(`\n🏷️ Script ${item.scriptIndex}:`);
            item.validItemTypes.forEach(type => {
                console.log(`- ${type}`);
            });
        });

    } catch (error) {
        console.error('🚨 Error fetching or validating structured data:', error.message);
    }
}

// Example usage
const websiteUrl = 'https://www.channelnewsasia.com/singapore/neon-art-glass-blowing-fire-only-artist-4900756'; // Replacing target website URL
await validateJsonLdFromUrl(websiteUrl);
