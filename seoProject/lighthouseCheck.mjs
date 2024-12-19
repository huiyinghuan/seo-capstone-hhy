// import fs from 'fs';
// import lighthouse from 'lighthouse';
// import * as chromeLauncher from 'chrome-launcher';

// // Define the URL you want to test (replace with actual URL)
// const url = 'https://thebiguglywebsite.com/';

// const flags = {
//   onlyCategories: ['seo']  // Modify the category to 'seo' to focus on SEO-related checks
// };

// const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});

// // Combine the flags and other configuration options
// const options = {
//   logLevel: 'info',
//   output: 'html',
//   port: chrome.port,
//   ...flags // Spread the flags here
// };

// // Run Lighthouse with the combined options
// const runnerResult = await lighthouse(url, options);

// // .report is the HTML report as a string
// const reportHtml = runnerResult.report;
// fs.writeFileSync('lhreport.html', reportHtml);

// // .lhr is the Lighthouse Result as a JS object
// console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
// console.log('SEO score was', runnerResult.lhr.categories.seo.score * 100);

// // Check if font-size issue is present and print full details
// const fontSizeAudit = runnerResult.lhr.audits['font-size'];

// if (fontSizeAudit) {
//   console.log('Font-size issue detected:');
//   console.log(`Title: ${fontSizeAudit.title}`);
//   console.log(`Description: ${fontSizeAudit.description}`);
  
//   // Print details, which includes the URL to learn more
//   if (fontSizeAudit.details && fontSizeAudit.details.url) {
//     console.log(`Learn more: ${fontSizeAudit.details.url}`);
//   } else {
//     console.log('No additional resources available.');
//   }
// } else {
//   console.log('No font-size issue detected.');
// }

// // Close the Chrome instance after the audit
// chrome.kill();

import fs from 'fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
async function runLighthouse(url) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'json', onlyCategories: ['best-practices'], port: chrome.port };
    const runnerResult = await lighthouse(url, options);

    // Debug and log all available audit keys
    console.log('Available audit keys:', Object.keys(runnerResult.lhr.audits));

    // Attempt to fetch viewport audit
    const viewportAudit = runnerResult.lhr.audits['viewport'];

    if (viewportAudit) {
        console.log('Viewport audit:', viewportAudit);
    } else {
        console.log('Viewport audit is undefined. Check the audit keys and hierarchy.');
    }

    const fontSizeAudit = runnerResult.lhr.audits['font-size'];

    if (fontSizeAudit) {
        console.log('Font-Size Audit:', fontSizeAudit);
    } else {
        console.log('Font-Size audit is undefined. Check the audit keys and hierarchy.');
    }

    await chrome.kill();
}


// async function runLighthouse(url) {
//     const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
//     const options = { logLevel: 'info', output: 'json', port: chrome.port };
//     const runnerResult = await lighthouse(url, options);

//     // Log all categories and their associated audits
//     const categories = runnerResult.lhr.categories;
//     const audits = runnerResult.lhr.audits;

//     console.log('Categories and their associated audit keys:\n');

//     for (const [categoryId, category] of Object.entries(categories)) {
//         console.log(`Category: ${category.title} (${categoryId})`);
//         category.auditRefs.forEach((auditRef) => {
//             const auditKey = auditRef.id;
//             const auditTitle = audits[auditKey]?.title || 'Unknown title';
//             console.log(`  - Audit Key: ${auditKey}, Title: ${auditTitle}`);
//         });
//         console.log('');
//     }

//     await chrome.kill();
// }
runLighthouse('https://thebiguglywebsite.com/'); // Replace with your URL
