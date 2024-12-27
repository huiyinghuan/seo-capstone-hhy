import fetch from 'node-fetch';

async function getCoreWebVitals(url, apiKey) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`;

    // try {
    //     const response = await fetch(apiUrl);
    //     if (!response.ok) {
    //         console.error("Failed to fetch data from API:", response.statusText);
    //         return;
    //     }
    //     const data = await response.json();

    //     // Extract Core Web Vitals Assessment
    //     const lighthouseResult = data.lighthouseResult;
    //     const coreWebVitalsAssessment = lighthouseResult?.categories?.performance?.title || "Unknown";

    //     console.log("Core Web Vitals Assessment:", coreWebVitalsAssessment);

    //      // Extract Core Web Vitals Assessment status (Pass/Fail)
    //      const assessmentStatus = data.loadingExperience?.overall_category || "Unknown";

    //      console.log("Core Web Vitals Assessment Status:", assessmentStatus);

    //     // Extract specific metrics
    //     const metrics = {
    //         LCP: data?.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile || "N/A",
    //         CLS: data?.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || "N/A",
    //         FID: data?.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile || "N/A",
    //     };

    //     console.log("Metrics:", metrics);
    //     return { coreWebVitalsAssessment, metrics };
    // } catch (error) {
    //     console.error("Error fetching Core Web Vitals data:", error);
    // }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error("Failed to fetch data from API:", response.statusText);
            return;
        }
        const data = await response.json();

        // Print the entire report
        console.log("Full PageSpeed Insights Report: ", data);
        // console.log(JSON.stringify(data, null, 2)); // Pretty-print JSON

        return data; // Return the full report if needed for further processing
    } catch (error) {
        console.error("Error fetching PageSpeed Insights data:", error);
    }

}

// Replace with your URL and API Key
const url = "https://www.straitstimes.com/singapore/govt-apologises-for-acra-lapse-will-accelerate-efforts-to-educate-public-on-proper-nric-use";
const apiKey = "AIzaSyAzkVUI6NA87EyU151_SuhD6-X71KJdR-w";

getCoreWebVitals(url, apiKey);
