import fetch from 'node-fetch';

const fetchPageSpeedData = async (url, apiKey) => {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
    return response.json();
};

const processMetrics = (metrics) => {
    const isGood = (metric, threshold, scaleFactor = 1) => {
        if (!metric?.percentile) return null;
        return metric.percentile / scaleFactor <= threshold;
    };

    const formatDistribution = (metric) => {
        if (!metric || !metric.distributions) return { Good: "N/A", NeedsImprovement: "N/A", Poor: "N/A" };
        const distributions = metric.distributions;
        return {
            Good: `${(distributions[0]?.proportion * 100).toFixed(1) || "0"}%`,
            NeedsImprovement: `${(distributions[1]?.proportion * 100).toFixed(1) || "0"}%`,
            Poor: `${(distributions[2]?.proportion * 100).toFixed(1) || "0"}%`
        };
    };

    const formatPercentile = (metric, scaleFactor = 1, unit = "") => {
        if (!metric?.percentile) return "N/A";
        return `${(metric.percentile / scaleFactor).toFixed(2)}${unit}`;
    };

    const lcpMetric = metrics.LARGEST_CONTENTFUL_PAINT_MS;
    const inpMetric = metrics.INTERACTION_TO_NEXT_PAINT;
    const clsMetric = metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE;

    return {
        lcp: {
            distribution: formatDistribution(lcpMetric),
            "75th Percentile": formatPercentile(lcpMetric, 1000, "s")
        },
        inp: {
            distribution: formatDistribution(inpMetric),
            "75th Percentile": formatPercentile(inpMetric, 1, "ms")
        },
        cls: {
            distribution: formatDistribution(clsMetric),
            "75th Percentile": formatPercentile(clsMetric, 100)
        },
        "Core Web Vital Assessment": (() => {
            const lcpGood = isGood(lcpMetric, 2500, 1000);
            const inpGood = isGood(inpMetric, 200);
            const clsGood = isGood(clsMetric, 0.1, 100);

            if (lcpGood === null || clsGood === null) return "Cannot be assessed (insufficient data for LCP or CLS)";
            if (inpGood === null) return lcpGood && clsGood ? "Pass" : "Fail";
            return lcpGood && inpGood && clsGood ? "Pass" : "Fail";
        })()
    };
};

const getCoreWebVitals = async (url, apiKey) => {
    try {
        const data = await fetchPageSpeedData(url, apiKey);
        const metrics = data.loadingExperience?.metrics || {};
        const results = processMetrics(metrics);
        
         // Return both core result and detailed output
         return {
            coreWebVitalResult: results["Core Web Vital Assessment"],
            details: results
        };
    } catch (error) {
        console.error("Error fetching Core Web Vitals data:", error);
        return { error: error.message };
    }
};


//does not return the detail output yet older version
// const getCoreWebVitals = async (url, apiKey) => {
//     try {
//         const data = await fetchPageSpeedData(url, apiKey);
//         const metrics = data.loadingExperience?.metrics || {};
//         const results = processMetrics(metrics);
        
//         // Return the results as JSON
//         return results;
//     } catch (error) {
//         console.error("Error fetching Core Web Vitals data:", error);
//         return { error: error.message };
//     }
// };


//const apiKey = "AIzaSyAzkVUI6NA87EyU151_SuhD6-X71KJdR-w";
const apiKey = "AIzaSyCmjvdDODGkhOaoe0EZ-Gq0BJHEg8LmTIw"; // for macbook

const url = process.argv[2];
//for testing
//const url = "https://www.straitstimes.com/singapore/govt-apologises-for-acra-lapse-will-accelerate-efforts-to-educate-public-on-proper-nric-use";

//Fetch and display JSON results
(async () => {
    const result = await getCoreWebVitals(url, apiKey);
    console.log(JSON.stringify(result, null, 2));
})();
