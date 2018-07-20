const puppeteer = require('puppeteer');

async function getBalance(username, password) {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	
	await page.goto('https://www.mymyki.com.au/NTSWebPortal/Login.aspx');
	
	const USERNAME_SELECTOR = '#ctl00_uxContentPlaceHolder_uxUsername';
	const PASSWORD_SELECTOR = '#ctl00_uxContentPlaceHolder_uxPassword';
	const SUBMIT_BUTTON = '#ctl00_uxContentPlaceHolder_uxLogin';
	const BALANCE_SELECTOR = '#ctl00_uxContentPlaceHolder_uxMyCards > tbody > tr:nth-child(2) > td:nth-child(3)';
    const LOGIN_ERROR_SELECTOR = '#uxservererror'
    
    const navigationPromise = page.waitForNavigation();
    
    let balance;
	
	await page.click(USERNAME_SELECTOR);
	await page.keyboard.type(username);
	
	await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(password);
	
	await page.click(SUBMIT_BUTTON);
	
	await navigationPromise;
	
	if (await page.$(LOGIN_ERROR_SELECTOR) != null) {

		throw "Login Details Incorrect"
		
	} else {
		await page.waitForSelector(BALANCE_SELECTOR);
		
		balance = await page.evaluate((sel) => {
			let element = document.querySelector(sel).innerHTML;
			return element.trim();
		}, BALANCE_SELECTOR);
		
	}
	
	return balance;
	browser.close();
}

module.exports = {
	getBalance: getBalance
}