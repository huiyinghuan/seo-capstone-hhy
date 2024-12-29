import fetch from 'node-fetch';

async function getCoreWebVitals(url, apiKey) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error("Failed to fetch data from API:", response.statusText);
            return;
        }
        const data = await response.json();

        // Extracting Core Web Vitals metrics
        const metrics = data.loadingExperience?.metrics || {};

        const formatDistribution = (metric) => {
            if (!metric || !metric.distributions) return { Good: "N/A", NeedsImprovement: "N/A", Poor: "N/A" };

            const distributions = metric.distributions;
            const good = (distributions[0]?.proportion * 100).toFixed(1) || "0";
            const needsImprovement = (distributions[1]?.proportion * 100).toFixed(1) || "0";
            const poor = (distributions[2]?.proportion * 100).toFixed(1) || "0";

            return { Good: `${good}%`, NeedsImprovement: `${needsImprovement}%`, Poor: `${poor}%` };
        };

        const formatPercentile = (metric, scaleFactor = 1, unit = "") => {
            if (!metric?.percentile) return "N/A";
            const percentile = (metric.percentile / scaleFactor).toFixed(2);
            return `${percentile}${unit}`;
        };

        const lcpMetric = metrics.LARGEST_CONTENTFUL_PAINT_MS;
        const inpMetric = metrics.INTERACTION_TO_NEXT_PAINT;
        const clsMetric = metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE;

        const lcpDistribution = formatDistribution(lcpMetric);
        const inpDistribution = formatDistribution(inpMetric);
        const clsDistribution = formatDistribution(clsMetric);

        const lcpPercentile = formatPercentile(lcpMetric, 1000, "s"); // converting ms to seconds for LCP
        const inpPercentile = formatPercentile(inpMetric, 1, "ms"); // keep ms for INP
        const clsPercentile = formatPercentile(clsMetric, 100); // divide the CLS by 100

        // Output results
        console.log("Core Web Vitals Distributions:");
        console.log("Largest Contentful Paint (LCP):", lcpDistribution, `75th Percentile: ${lcpPercentile}`);
        console.log("Interaction to Next Paint (INP):", inpDistribution, `75th Percentile: ${inpPercentile}`);
        console.log("Cumulative Layout Shift (CLS):", clsDistribution, `75th Percentile: ${clsPercentile}`);
    } catch (error) {
        console.error("Error fetching Core Web Vitals data:", error);
}
}


const url = "https://www.straitstimes.com/singapore/govt-apologises-for-acra-lapse-will-accelerate-efforts-to-educate-public-on-proper-nric-use";
const apiKey = "AIzaSyAzkVUI6NA87EyU151_SuhD6-X71KJdR-w";

getCoreWebVitals(url, apiKey);
