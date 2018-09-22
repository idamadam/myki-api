const puppeteer = require('puppeteer');

async function startSession(username, password) {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
	const page = await browser.newPage();

	await page.goto('https://www.mymyki.com.au/NTSWebPortal/Login.aspx');

	const USERNAME_SELECTOR = '#ctl00_uxContentPlaceHolder_uxUsername';
	const PASSWORD_SELECTOR = '#ctl00_uxContentPlaceHolder_uxPassword';
	const SUBMIT_BUTTON = '#ctl00_uxContentPlaceHolder_uxLogin';
	const LOGIN_ERROR_SELECTOR = '#uxservererror'

	const navigationPromise = page.waitForNavigation();

	await page.click(USERNAME_SELECTOR);
	await page.keyboard.type(username);
	
	await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(password);
	
	await page.click(SUBMIT_BUTTON);

	console.log("Logging in")
	await navigationPromise;

	if (await page.$(LOGIN_ERROR_SELECTOR) != null) {
		browser.close();
		throw "Login Details Incorrect"
	}
	
	console.log("Log in Successful")
	return {
		browser: browser,
		page: page
	};
}

async function checkBalance(browser, page) {
	const BALANCE_SELECTOR = '#ctl00_uxContentPlaceHolder_uxMyCards > tbody > tr:nth-child(2) > td:nth-child(3)';

	await page.waitForSelector(BALANCE_SELECTOR);
	console.log("Got Balance")
		
	balance = await page.evaluate((sel) => {
		let element = document.querySelector(sel).innerHTML;
		return element.trim();
	}, BALANCE_SELECTOR);

	browser.close();
	return balance;
}


module.exports = {
	startSession: startSession,
	checkBalance: checkBalance
}