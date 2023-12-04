// Node.js Puppeteer - launch devtools locally

const { exec } = require('child_process');
const chromeExecutable = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const openDevtools = async (page, client) => {
    // get current frameId
    const frameId = page.mainFrame()._id;
    // get URL for devtools from scraping browser
    const { url: inspectUrl } = await client.send('Page.inspect', { frameId });
    // open devtools URL in local chrome
    exec(`"${chromeExecutable}" "${inspectUrl}"`, error => {
        if (error)
            throw new Error('Unable to open devtools: ' + error);
    });
    // wait for devtools ui to load
    await delay(5000);
};

module.exports = {
    openDevtools
}

/* const page = await browser.newPage();
const client = await page.target().createCDPSession();
await openDevtools(page, client);
await page.goto('http://example.com'); */