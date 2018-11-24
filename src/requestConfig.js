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
}

let balanceOptions = {
    uri: `https://www.mymyki.com.au/NTSWebPortal/Registered/MyMykiAccount.aspx?menu=My+myki+account`,
    method: 'POST',
    simple: false,
    followAllRedirects: true
}

module.exports = {
    loginForm: loginForm,
    balanceForm: balanceForm,
    initialRequestOptions: initialRequestOptions,
    loginOptions: loginOptions,
    balanceOptions: balanceOptions
}