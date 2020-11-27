/// <reference path="oidc-client.js" />

export default class Configuration {
    constructor(authority, client_id, redirect_uri, post_logout_redirect_uri, response_type, scope, revokeAccessTokenOnSignout) {
        this.authority = authority;
        this.client_id = client_id;
        this.redirect_uri = redirect_uri;
        this.post_logout_redirect_uri = post_logout_redirect_uri;
        this.response_type = response_type;
        this.scope = scope;
        this.revokeAccessTokenOnSignout = revokeAccessTokenOnSignout;

        
    }
}

export function renderUI(config, lang) {
    var mgr = new Oidc.UserManager(config);
    // Set up CSS
    // Get HTML head element 
    var head = document.getElementsByTagName('HEAD')[0];

    // Create new link Element 
    var link = document.createElement('link');
    // set the attributes for link element  
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://rawcdn.githack.com/LaoKYC/LaoKYC-JavaScript/021e553ad3372d0711e0d121ec2b65d19bdfd143/JsOidc/wwwroot/css/kyc-style.css'; 

    var font = document.createElement('link');
    font.rel = 'stylesheet';
    font.type = 'text/css';
    font.href = '//db.onlinewebfonts.com/c/aec907da6ddc0232418067ecacb324a2?family=Noto+Sans+Lao';

    // Append link element to HTML head 
    head.appendChild(link);
    head.appendChild(font);

    var loginBtn = document.createElement("BUTTON");
    loginBtn.style = 'background: transparent; border: 0;';
    var imgBtn = document.createElement("img");
    imgBtn.style = 'width: 180px;';
    if (lang === 'lo') {
        imgBtn.src = "https://rawcdn.githack.com/LaoKYC/LaoKYC-JavaScript/021e553ad3372d0711e0d121ec2b65d19bdfd143/JsOidc/wwwroot/img/signin-lo.png";
    } else {
        imgBtn.src = "https://rawcdn.githack.com/LaoKYC/LaoKYC-JavaScript/021e553ad3372d0711e0d121ec2b65d19bdfd143/JsOidc/wwwroot/img/signin-en.png";
    }
    loginBtn.appendChild(imgBtn);
    const currentDiv = document.getElementById("kyc-login");
    currentDiv.appendChild(loginBtn);

    // Modal
    var modal = document.createElement('div');
    modal.className = 'modal';
    var modalcontent = document.createElement('div');
    modalcontent.className = 'modal-content';

    // Add element to div
    modal.appendChild(modalcontent);

    currentDiv.appendChild(modal);


    loginBtn.onclick = function () {
        var span = document.createElement('span');
        span.className = 'close';
        span.innerHTML = '&times;';
        modalcontent.innerHTML = '';
        modal.style.display = "block";
        modalcontent.appendChild(span);

        var isdn = document.createElement("INPUT");
        isdn.setAttribute("type", "text");
        isdn.className = 'kyc-number';
        var btn = document.createElement("BUTTON");
        btn.className = 'btnOtp';
        btn.type = 'button';

        if (lang === 'en') {
            btn.innerHTML = "Request OTP";
            isdn.placeholder = "Phone number, Eg: 205xxxxxxx";
        } else if (lang === 'lo') {
            btn.innerHTML = "ຂໍລະຫັດຜ່ານ OTP";
            isdn.placeholder = "ເບີໂທ, ຕົວຢ່າງ: 205xxxxxxx";
        }

        var frm = document.createElement("div");
        frm.className = 'kyc-form';
        var divImg = document.createElement("div");
        divImg.className = 'imgcontainer';
        var img = document.createElement('img');
        img.className = 'avatr';
        img.src = 'https://rawcdn.githack.com/LaoKYC/LaoKYC-JavaScript/021e553ad3372d0711e0d121ec2b65d19bdfd143/JsOidc/wwwroot/img/banner.png'
        img.width = 100;
        divImg.appendChild(img);

        var divContainer = document.createElement("div");
        divContainer.className = 'kyc-container';
        var label = document.createElement("LABEL");
        label.innerHTML = "Authentication LaoKYC </br>";
        divContainer.appendChild(label);
        divContainer.appendChild(isdn);
        divContainer.appendChild(btn);

        frm.appendChild(divImg);
        frm.appendChild(divContainer);

        modalcontent.appendChild(frm);
        
        btn.onclick = function () {
            mgr.signinRedirect({
                extraQueryParams: {
                    platform: 'SPA',
                    phone: isdn.value,
                    needotp: 'true'
                },
                prompt: 'login'
            });
        }
        span.onclick = function () {
            modal.style.display = "none";
        }
    }

}

export function logout(config) {
    var mgr = new Oidc.UserManager(config);
    mgr.signoutRedirect();
}

export function revoke(config) {
    var mgr = new Oidc.UserManager(config);
    mgr.revokeAccessToken().then(function () {
        log("Access Token Revoked.")
    }).catch(function (err) {
        log(err);
    });
}

export function renewToken(config) {
    var mgr = new Oidc.UserManager(config);
    mgr.signinSilent()
        .then(function () {
            log("silent renew success");
            showTokens();
        }).catch(function (err) {
            log("silent renew error", err);
        });
}

if (window.location.hash) {
    handleCallback();
}


function log(data) {
    document.getElementById('response').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('response').innerText += msg + '\r\n';
    });
}

function display(selector, data) {
    if (data && typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch (e) { }
    }
    if (data && typeof data !== 'string') {
        data = JSON.stringify(data, null, 2);
    }
    document.querySelector(selector).textContent = data;
}

export function showTokens(config, selector) {
    var mgr = new Oidc.UserManager(config);
    mgr.getUser().then(function (user) {
        if (user) {
            display(selector, user);
        }
        else {
            log("Not logged in");
        }
    });
}
function handleCallback(config) {
    var mgr = new Oidc.UserManager(config);
    mgr.signinRedirectCallback().then(function (user) {
        var hash = window.location.hash.substr(1);
        var result = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        log(result);
        showTokens();

        window.history.replaceState({},
            window.document.title,
            window.location.origin + window.location.pathname);

    }, function (error) {
        log(error);
    });
}