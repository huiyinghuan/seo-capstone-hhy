// import fs from 'fs';
// import lighthouse from 'lighthouse';
// import * as chromeLauncher from 'chrome-launcher';

// async function runLighthouse(url) {
//     const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
//     const options = {
//         logLevel: 'info',
//         output: 'json',
//         onlyCategories: ['best-practices'],
//         port: chrome.port,
//     };
//     try {
//         const runnerResult = await lighthouse(url, options);
//         const httpsAuditResult = runnerResult.lhr.audits['is-on-https'];
        

//         const result = {
//             httpsAuditResult: httpsAuditResult?.score === 1 ? "Pass" : "Fail",
//             //https_status: httpsAudit?.score === 1 ? "Pass" : "Fail",
//             // httpsAuditResultTitle: httpsAudit.title, 
//             // httpsAuditDescription: httpsAudit.description
//             //httpsAudit: httpsAudit,
//         };

//         console.log(JSON.stringify(result)); // Final structured output
//     } catch (err) {
//         console.error("Error running Lighthouse:", err);
//         console.log(JSON.stringify({ error: "Failed to complete Lighthouse audit" }));
//     } finally {
//         await chrome.kill();
//     }
// }

// const url = process.argv[2];
// if (url) {
//     runLighthouse(url).catch(err => console.error(err));
// } else {
//     console.error("No URL provided.");
// }


import fs from 'fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function runLighthouse(url) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['best-practices'],
        port: chrome.port,
    };

    try {
        const runnerResult = await lighthouse(url, options);
        const httpsAuditResult = runnerResult.lhr.audits['is-on-https'];

        if (!httpsAuditResult) {
            throw new Error("'is-on-https' audit not found in Lighthouse results.");
        }

        const result = {
            //httpsAuditResult: httpsAuditResult?.score === 1 ? "Pass" : "Fail",
            httpsAuditResult: httpsAuditResult?.title === "Uses HTTPS" ? "Pass" : "Fail",
            title: httpsAuditResult.title || "N/A",
            description: httpsAuditResult.description || "N/A",
        };

        console.log(JSON.stringify(result, null, 2)); // Structured output
    } catch (err) {
        console.error("Error running Lighthouse:", err);
        console.log(JSON.stringify({ error: "Failed to complete Lighthouse audit" }));
    } finally {
        await chrome.kill();
    }
}

// const url = process.argv[2];
// if (!url || !/^https?:\/\/.+$/.test(url)) {
//     console.error("Please provide a valid URL (e.g., https://example.com).");
//     process.exit(1);
// }

// runLighthouse(url).catch(err => console.error(err));
const url = process.argv[2];
if (url) {
    runLighthouse(url).catch(err => console.error(err));
} else {
    console.error("No URL provided.");
}
