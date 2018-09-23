const rp = require('request-promise-native');
const cheerio = require('cheerio');

let loginForm = {
    ctl00$uxContentPlaceHolder$browser_name: 'Chrome',
    ctl00$uxContentPlaceHolder$uxLogin: 'Login'
}

let balanceForm = {
    __EVENTTARGET: 'ctl00$uxContentPlaceHolder$uxTimer',
    _ASYNCPOST: 'true',
    ctl00$uxHeader$uxSearchTextBox: '',
    ctl00$uxHeader$hidFontSize: '',
    ctl00$ScriptManager1: 'ctl00$uxContentPlaceHolder$Panel|ctl00$uxContentPlaceHolder$uxTimer'
}

let initialRequestOptions = {
    uri: `https://www.mymyki.com.au/NTSWebPortal/login.aspx`,
    method: 'GET',
    simple: false,
    resolveWithFullResponse: true
}

let loginOptions = {
    uri: `https://www.mymyki.com.au/NTSWebPortal/login.aspx`,
    method: 'POST',
    simple: false,
    followAllRedirects: true,
    resolveWithFullResponse: true,
    headers: {
        'Origin': 'https://www.mymyki.com.au',
        'Referer': 'https://www.mymyki.com.au/NTSWebPortal/login.aspx',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
    }
};

let balanceOptions = {
    uri: `https://www.mymyki.com.au/NTSWebPortal/Registered/MyMykiAccount.aspx?menu=My+myki+account`,
    method: 'POST',
    simple: false,
    followAllRedirects: true
}

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
    const cookieJar = rp.jar();

    loginOptions.jar = cookieJar;
    balanceOptions.jar = cookieJar;

    let initialRequest = await rp(initialRequestOptions);
    let initialViewState = getAspxParams(initialRequest.body);

    loginForm = Object.assign(initialViewState, loginForm);
    loginForm["ctl00$uxContentPlaceHolder$uxUsername"] = username;
    loginForm["ctl00$uxContentPlaceHolder$uxPassword"] = password;
    loginOptions.form = loginForm;

    let login = await rp(loginOptions);

    let redirectUrl = login.request.uri.pathname;
    const success = '/NTSWebPortal/Registered/MyMykiAccount.aspx';

    if (redirectUrl == success) {
        loginViewState = getAspxParams(login.body);
        balanceForm = Object.assign(loginViewState, balanceForm);
        balanceOptions.form = balanceForm;

        console.log("Successful login");

        let balanceSnippet = await rp(balanceOptions);
        let $ = cheerio.load(balanceSnippet);

        let result = $('#ctl00_uxContentPlaceHolder_uxMyCards > tbody > tr:nth-child(2) > td:nth-child(3)').text().trim();
        
        return result;
    
    } else {
        const $ = cheerio.load(login.body);
        let errorMessage = $('#uxservererror').text().trim();

        if (errorMessage == "Invalid Username/Password.") {
            console.log("Invalid login")
            throw new Error(errorMessage)
        } else {
            console.error("Login process failure")
            throw new Error("Login failed");
        }
    }
}

module.exports = {
	checkBalance: checkBalance
}