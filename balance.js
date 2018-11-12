const rp = require('request-promise-native');
const cheerio = require('cheerio');
const config = require('./requestConfig');

function getAspxParams(body) {
    const $ = cheerio.load(body);

    let __VIEWSTATE = ($('#__VIEWSTATE')[0].attribs.value) || '';
    let __VIEWSTATEGENERATOR = ($('#__VIEWSTATEGENERATOR')[0].attribs.value) || '';
    let __EVENTVALIDATION = ($('#__EVENTVALIDATION')[0].attribs.value) || '';
    let __EVENTTARGET = ($('#__EVENTTARGET')[0].attribs.value) || '';
    let __EVENTARGUMENT = ($('#__EVENTARGUMENT'))[0].attribs.value || '';

    return {
        '__EVENTTARGET': __EVENTTARGET,
        '__EVENTARGUMENT': __EVENTARGUMENT,
        '__VIEWSTATE': __VIEWSTATE,
        '__VIEWSTATEGENERATOR': __VIEWSTATEGENERATOR,
        '__EVENTVALIDATION': __EVENTVALIDATION,
    }
    
}

async function checkBalance(username, password) {
    let loginForm = config.loginForm;
    let balanceForm = config.balanceForm;
    let loginOptions = config.loginOptions;
    let balanceOptions = config.balanceOptions;
    let initialRequestOptions = config.initialRequestOptions;

    const cookieJar = rp.jar();

    loginOptions.jar = cookieJar;
    balanceOptions.jar = cookieJar;

    let initialRequest = await rp(initialRequestOptions);
    console.log("[INIT] First request made");

    let initialViewState = getAspxParams(initialRequest.body);

    loginForm = Object.assign(initialViewState, loginForm);
    loginForm["ctl00$uxContentPlaceHolder$uxUsername"] = username;
    loginForm["ctl00$uxContentPlaceHolder$uxPassword"] = password;
    loginOptions.form = loginForm;

    let login = await rp(loginOptions);

    let redirectUrl = login.request.uri.pathname;
    const success = '/NTSWebPortal/Registered/MyMykiAccount.aspx';

    if (redirectUrl == success) {
        console.log(`[LOGIN-SUCCESS] username: ${username} successfully logged in`);

        loginViewState = getAspxParams(login.body);
        balanceForm = Object.assign(loginViewState, balanceForm);
        balanceOptions.form = balanceForm;

        let balanceSnippet = await rp(balanceOptions);
        console.log(`[BALANCE-SUCCESS] Successfully loaded balance`)
        let $ = cheerio.load(balanceSnippet);

        let accountHolder = $('#ctl00_uxContentPlaceHolder_uxMyCards > tbody > tr:nth-child(2) > td:nth-child(2)').text().trim();
        let money = $('#ctl00_uxContentPlaceHolder_uxMyCards > tbody > tr:nth-child(2) > td:nth-child(3)').text().trim();
        let pass = $('#ctl00_uxContentPlaceHolder_uxMyCards > tbody > tr:nth-child(2) > td:nth-child(4)').text().trim();

        let result = {
            "accountHolder": accountHolder,
            "money": money,
            "pass": pass
        }
        
        return result;
    
    } else {
        const $ = cheerio.load(login.body);
        let errorMessage = $('#uxservererror').text().trim();

        if (errorMessage == "Invalid Username/Password.") {
            console.log(`[LOGIN-INVALID] username: ${username} tried login with invalid details`)
            throw new Error(errorMessage)
        } else {
            console.error(`[LOGIN-FAILURE] username: ${username} login failed with unknown error`)
            throw new Error("Login failed")
        }
    }
}

module.exports = {
	checkBalance: checkBalance
}