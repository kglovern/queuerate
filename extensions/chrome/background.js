const firebaseConfig = {
    apiKey: "AIzaSyBjtW6LTs6UmvJ-FYRSqVAljQNDobbYQno",
    authDomain: "curate-3a4b8.firebaseapp.com",
    databaseURL: "https://curate-3a4b8.firebaseio.com",
    projectId: "curate-3a4b8",
    storageBucket: "curate-3a4b8.appspot.com",
    messagingSenderId: "931076853892",
    appId: "1:931076853892:web:94ee05d0b0bb3742bcf2d1"
};
// Initialize Firebase
const firebaseAuth = firebase.initializeApp(firebaseConfig);

chrome.runtime.onInstalled.addListener(function () {
    // chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    //     chrome.declarativeContent.onPageChanged.addRules([{
    //         conditions: [new chrome.declarativeContent.PageStateMatcher({
    //             // pageUrl: { hostEquals: 'developer.chrome.com' },
    //         })
    //         ],
    //         actions: [new chrome.declarativeContent.ShowPageAction()]
    //     }]);
    // });
});

// http://api.curator.codifyr.ca
// http://localhost:8080/
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.storage.sync.get(['uid'], function(result) {
        const { uid } = result
        if(uid) {
            fetch('http://api.curator.codifyr.ca/links/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: uid,
                    url: tab.url
                })
            })
                .then(response => response.json())
                .then(response => {
                    // console.log(response)
                })
                .catch(error => console.log('Error:', error));
        } else {
            chrome.runtime.openOptionsPage();
        }
    });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.msg === "Login") {
            const { email, password } = request.data.content 
            firebaseAuth.auth()
                .signInWithEmailAndPassword(email, password)
                .then(result => {
                    const { user: { uid } } = result
                    chrome.storage.sync.set({'uid': uid});
                })
                .catch(error => {
                    // console.log(error);
                });
        } else if(request.msg === "Logout") {
            firebase.auth().signOut().then(function() {
                chrome.storage.sync.set({
                    'email': null,
                    'uid': null
                });
            }).catch(function(error) {
                // An error happened.
            });
        }
    }
);