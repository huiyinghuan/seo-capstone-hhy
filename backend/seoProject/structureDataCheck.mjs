// //v7
// import jsonld from 'jsonld';
// import fetch from 'node-fetch';
// import * as cheerio from 'cheerio';

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
//             console.log(`🔍 Extracted JSON-LD from Script ${i + 1}:`);
//             console.log(jsonLd); // Logging the raw JSON-LD content
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

//         // Track the valid items and their types
//         let validItemCount = 0;
//         const validItems = [];

//         // Loop through each JSON-LD script and extract the type and properties
//         for (let i = 0; i < jsonLdScripts.length; i++) {
//             const jsonLdData = jsonLdScripts[i];
//             let scriptValidItems = [];

//             try {
//                 // Check if the JSON-LD contains a '@graph' key
//                 if (jsonLdData['@graph']) {
//                     const graph = jsonLdData['@graph'];

//                     graph.forEach(item => {
//                         // Check for a valid @type for each item in the @graph
//                         const jsonLdType = item['@type'];
//                         if (jsonLdType) {
//                             scriptValidItems.push(jsonLdType);
//                             // Log each item type found
//                             console.log(`🔑 Found valid item in @graph: ${jsonLdType}`);
                            
//                             // Log the elements of the valid item
//                             console.log(`  Details for ${jsonLdType}:`);
//                             Object.keys(item).forEach(key => {
//                                 if (key !== '@type') { // Exclude '@type' key as we already logged it
//                                     console.log(`    ${key}: ${JSON.stringify(item[key], null, 2)}`);
//                                 }
//                             });
//                         }
//                     });

//                     validItemCount += scriptValidItems.length;

//                     // Log the number of valid structured items
//                     console.log(`Valid structured items found in @graph: ${scriptValidItems.length}`);
//                 } else {
//                     console.log(`⚠️ JSON-LD Script ${i + 1} does not have a valid '@graph' field.`);
//                 }

//                 // Compact JSON-LD to validate context
//                 const compacted = await jsonld.compact(jsonLdData, {});
//                 console.log(`✅ JSON-LD script ${i + 1} is valid:\n`, JSON.stringify(compacted, null, 2));

//             } catch (err) {
//                 console.error(`❌ JSON-LD validation failed for script ${i + 1}:`, err.message);
//             }

//             // Store valid items for final summary
//             validItems.push({
//                 scriptIndex: i + 1,
//                 validItemTypes: scriptValidItems
//             });
//         }

//         // Log the total number of valid structured items (based on @type in all scripts)
//         console.log(`\n📊 Total valid items: ${validItemCount}`);

//         // Log a summary of valid items for each script
//         validItems.forEach((item, index) => {
//             console.log(`\n🏷️ Script ${item.scriptIndex}:`);
//             item.validItemTypes.forEach(type => {
//                 console.log(`- ${type}`);
//             });
//         });

//     } catch (error) {
//         console.error('🚨 Error fetching or validating structured data:', error.message);
//     }
// }

// // Example usage
// const websiteUrl = 'https://www.semrush.com/kb/995-what-is-semrush'; // Replace with the target website URL
// await validateJsonLdFromUrl(websiteUrl);


//v8 returning the result instead of logging them 
// import jsonld from 'jsonld';
// import fetch from 'node-fetch';
// import * as cheerio from 'cheerio';

// // Function to fetch and validate JSON- LD from a webpage
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
//             console.log(`🔍 Extracted JSON-LD from Script ${i + 1}:`);
//             console.log(jsonLd); // Logging the raw JSON-LD content
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

//         // Track the valid items and their types
//         let validItemCount = 0;
//         const validItems = [];
//         const validItemTypes = new Set(); // To track unique valid item types

//         // Loop through each JSON-LD script and extract the type and properties
//         for (let i = 0; i < jsonLdScripts.length; i++) {
//             const jsonLdData = jsonLdScripts[i];
//             let scriptValidItems = [];

//             try {
//                 // Check if the JSON-LD contains a '@graph' key
//                 if (jsonLdData['@graph']) {
//                     const graph = jsonLdData['@graph'];

//                     graph.forEach(item => {
//                         // Check for a valid @type for each item in the @graph
//                         const jsonLdType = item['@type'];
//                         if (jsonLdType) {
//                             scriptValidItems.push({
//                                 type: jsonLdType,
//                                 details: item
//                             });
//                             validItemTypes.add(jsonLdType); // Add to set of valid item types
//                             // Log each item type found
//                             console.log(`🔑 Found valid item in @graph: ${jsonLdType}`);
                            
//                             // Log the elements of the valid item
//                             console.log(`  Details for ${jsonLdType}:`);
//                             Object.keys(item).forEach(key => {
//                                 if (key !== '@type') { // Exclude '@type' key as we already logged it
//                                     console.log(`    ${key}: ${JSON.stringify(item[key], null, 2)}`);
//                                 }
//                             });
//                         }
//                     });

//                     validItemCount += scriptValidItems.length;

//                     // Log the number of valid structured items
//                     console.log(`Valid structured items found in @graph: ${scriptValidItems.length}`);
//                 } else {
//                     console.log(`⚠️ JSON-LD Script ${i + 1} does not have a valid '@graph' field.`);
//                 }

//                 // Compact JSON-LD to validate context
//                 const compacted = await jsonld.compact(jsonLdData, {});
//                 console.log(`✅ JSON-LD script ${i + 1} is valid:\n`, JSON.stringify(compacted, null, 2));

//             } catch (err) {
//                 console.error(`❌ JSON-LD validation failed for script ${i + 1}:`, err.message);
//             }

//             // Store valid items for final summary
//             validItems.push({
//                 scriptIndex: i + 1,
//                 validItems: scriptValidItems
//             });
//         }

//         // Return the results: valid items, number of valid items, valid item types, and the elements in the valid items
//         return {
//             totalValidItems: validItemCount,
//             validItems,
//             validItemTypes: Array.from(validItemTypes) // Convert Set to Array for easy access
//         };

//     } catch (error) {
//         console.error('🚨 Error fetching or validating structured data:', error.message);
//         return {
//             totalValidItems: 0,
//             validItems: [],
//             validItemTypes: []
//         };
//     }
// }

// // Example usage
// const websiteUrl = 'https://www.channelnewsasia.com/commentary/education-master-degrees-qualifications-useless-tuition-fees-4802721'; // Replace with the target website URL
// const result = await validateJsonLdFromUrl(websiteUrl);
// console.log(`\n📊 Total valid items: ${result.totalValidItems}`);
// console.log(`\n📋 Valid Item Types: ${result.validItemTypes.join(', ')}`);
// result.validItems.forEach(item => {
//     console.log(`\n🏷️ Script ${item.scriptIndex}:`);
//     item.validItems.forEach(validItem => {
//         console.log(`- ${validItem.type}`);
//         console.log(`  Details: ${JSON.stringify(validItem.details, null, 2)}`);
//     });
// });


//v9 turning into a script for running via a call
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
            throw new Error(`Failed to fetch the URL. Status: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();

        // Load HTML content with cheerio
        const $ = cheerio.load(html);

        // Extract JSON-LD scripts
        const jsonLdScripts = [];
        $('script[type="application/ld+json"]').each((i, element) => {
            const jsonLd = $(element).html();
            try {
                const parsedJsonLd = JSON.parse(jsonLd);
                jsonLdScripts.push(parsedJsonLd);
            } catch (error) {
                throw new Error(`Error parsing JSON-LD script ${i + 1}: ${error.message}`);
            }
        });

        if (jsonLdScripts.length === 0) {
            throw new Error('No JSON-LD data found on the page.');
        }

        // Track the valid items and their types
        let validItemCount = 0;
        const validItems = [];
        const validItemTypes = new Set(); // To track unique valid item types

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
                            scriptValidItems.push({
                                type: jsonLdType,
                                details: item
                            });
                            validItemTypes.add(jsonLdType); // Add to set of valid item types
                        }
                    });

                    validItemCount += scriptValidItems.length;
                }

                // Compact JSON-LD to validate context
                await jsonld.compact(jsonLdData, {});

            } catch (err) {
                throw new Error(`JSON-LD validation failed for script ${i + 1}: ${err.message}`);
            }

            // Store valid items for final summary
            validItems.push({
                scriptIndex: i + 1,
                validItems: scriptValidItems
            });
        }

        // Return the structured result
        return {
            totalValidItems: validItemCount,
            validItems,
            validItemTypes: Array.from(validItemTypes), // Convert Set to Array for easy access
        };

    } catch (error) {
        // Return a structured error result if an error occurred
        return {
            error: error.message,
        };
    }
}

//Example usage in another module
async function main() {
    const websiteUrl = 'https://www.screamingfrog.co.uk/generate-json-ld-schema-at-scale/'; // Replace with the target website URL
    const result = await validateJsonLdFromUrl(websiteUrl);

    // Example of structured result for external use
    console.log(JSON.stringify(result, null, 2)); // Will be in a structured format
}

main().catch(err => console.error("Error in JSON-LD validation:", err));


// Example usage
// const websiteUrl = 'https://firstpagesage.com/seo-blog/top-seo-tools-comparison/'; // Replace with the target website URL
// const result = await validateJsonLdFromUrl(websiteUrl);
// console.log(`\n📊 Total valid items: ${result.totalValidItems}`);
// console.log(`\n📋 Valid Item Types: ${result.validItemTypes.join(', ')}`);
// result.validItems.forEach(item => {
//     console.log(`\n🏷️ Script ${item.scriptIndex}:`);
//     item.validItems.forEach(validItem => {
//         console.log(`- ${validItem.type}`);
//         console.log(`  Details: ${JSON.stringify(validItem.details, null, 2)}`);
//     });
// });

