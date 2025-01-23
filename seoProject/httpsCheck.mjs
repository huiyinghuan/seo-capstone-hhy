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
        const httpsAudit = runnerResult.lhr.audits['is-on-https'];
        

        const result = {
            httpsAduitResult: httpsAudit?.score === 1 ? "Pass" : "Fail",
            httpsAuditResultTitle: httpsAudit.title, 
            //httpsAudit: httpsAudit,
        };

        console.log(JSON.stringify(result)); // Final structured output
    } catch (err) {
        console.error("Error running Lighthouse:", err);
        console.log(JSON.stringify({ error: "Failed to complete Lighthouse audit" }));
    } finally {
        await chrome.kill();
    }
}

const url = process.argv[2];
if (url) {
    runLighthouse(url).catch(err => console.error(err));
} else {
    console.error("No URL provided.");
}
