function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    chrome.storage.sync.set({
        'email': email,
        'uid': null
    });

    chrome.runtime.sendMessage({
        msg: "Login", 
        data: {
            subject: "Login Information",
            content: {
                "email": email,
                "password": password
            }
        }
    });    
}

function logout() {
    chrome.runtime.sendMessage({
        msg: "Logout", 
    });  
}

chrome.storage.sync.get(['uid', 'email'], function(result) {
    const { uid, email } = result
    if(uid) {
        document.getElementById("login_status_text").innerHTML = "Logged in as: " + email;
    } else {
        document.getElementById("login_status_text").innerHTML = "Not Logged in";
    }
});

document.getElementById('login_button').addEventListener('click', login);
document.getElementById('logout_button').addEventListener('click', logout);