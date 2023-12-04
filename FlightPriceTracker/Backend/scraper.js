const puppeteer = require('puppeteer-core');

const {openDevtools} = require('./utils')

const SBR_WS_ENDPOINT = `wss://brd-customer-hl_9bdac220-zone-flight_prices:uglveq94kdn6@brd.superproxy.io:9222`;

async function parseRoute(div) {

    const airlineSpan = await div.$('[class^="LogoImage_container"] span'
    );

    // we don't eval right away bc the log image span is sometimes empty. We will call it conditionally

    let airline = await airlineSpan?.evaluate((el) => el.textContent.trim())

    // most are undefined. For these, we will parse the airline from the image:

    if(!airline) {
        const airlineImg = await div.$('[class^="LogoImage_container"] img');
        airline = await airlineImg?.evaluate(el => el.alt.trim());
    }

    const departAt = await div.$eval('[class^="LegInfo_routePartialDepart"] span',
    (el) => el.textContent.trim()
    );

    const arriveAt = await div.$eval('[class^="LegInfo_routePartialArrive"] span',
    (el) => el.textContent.trim()
    );

    const duration = await div.$eval('[class^="LegInfo_stopsContainer"] span',
    (el) => el.textContent.trim()
    );
    
    const direct = await div.$eval('[class^="LegInfo_stopsLabelContainer"] span',
    (el) => el.textContent.trim()
    );

    return {
        airline,
        departAt,
        arriveAt,
        duration,
        direct
    }
}


async function parseFlight(flight) {
    // find first price, evaluate it to take text content, trim (remove white space at beggining and end)
    // await bc asyn function
    const price = await flight.$eval('[class^="Price_mainPriceContainer"]', (el) => el.textContent.trim());

    // fin utb_lc class, then find the direct childs of it that are divs
    const [toDiv, fromDiv] = await flight.$$(
        '[class^="UpperTicketBody_legsContainer"] > div'
    );
    // result = [toDiv, fromDiv]
    // console.log(result.length);

    return {
        price,
        to: await parseRoute(toDiv),
        from: await parseRoute(fromDiv),
    }
}

async function scrapeFlights(from, to, departDate, returnDate) {
    console.log('Connecting to Scraping Browser...');

    const url = `https://www.skyscanner.net/transport/flights/${from}/${to}/${departDate}/${returnDate}/`
    
    // ?adultsv2=1&cabinclass=economy&childrenv2=&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1`

    const browser = await puppeteer.connect({
        browserWSEndpoint: SBR_WS_ENDPOINT,
    });
    try {
        const page = await browser.newPage();
        console.warn('Connected! Navigating to ', url);

        // Open devtools, uncomment if want to see bot scraping the web

        /* const client = await page.target().createCDPSession();
        await openDevtools(page, client); */


        await page.goto(url);
        // CAPTCHA handling: If you're expecting a CAPTCHA on the target page, use the following code snippet to check the status of Scraping Browser's automatic CAPTCHA solver
        // const client = await page.createCDPSession();
        // console.log('Waiting captcha to solve...');
        // const { status } = await client.send('Captcha.waitForSolve', {
        //     detectTimeout: 10000,
        // });
        // console.log('Captcha solve status:', status);

        // close the privacy pop-up: finds button by class, clicks
        await page.locator('#cookieBannerContent button').click()

        // parsing 
        // 1 $ finds 1 matching selector, $$ finds all
        // ^= => selector start with ...
        const flights = await page.$$('a[class^="FlightsTicket_link"]');
        // console.log(flights.length)
        // found 11 flights

        // collect array of 11 promises by using parseFlights on each flight found
        
        const data = await Promise.all(flights.map(parseFlight));
        // =
        // await Promise.all(flights.map((flight) => parseFlight(flight)));
        // =
        // const promises = flights.map((flight) => parseFlight(flight));
        // await Promise.all(promises); // wait for all flights to be parsed into promises
        
        //console.log(data); becomes
        return data;

        // console.log('Navigated! Scraping page content...');

        //const html = await page.content();

        //console.log(html)

    } finally {
        await browser.close();
        // comment this out to see the devtools and website instead of closing it after scraping
    }
}

/* main().catch(err => {
    console.error(err.stack || err);
    process.exit(1);
}); */

module.exports = {
    scrapeFlights,
};