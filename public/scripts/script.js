
const developerKey = 'YOR_API_KEY';
const clientId = 'YOUR_CLIENT_ID';
const scope =   'https://www.googleapis.com/auth/drive.file ' +
                'https://www.googleapis.com/auth/drive.metadata ' +
                'https://www.googleapis.com/auth/drive.readonly';
let GoogleAuth;
let access_token;

const signOutBtn = document.getElementById('googleDriveOff');
const authBtn = document.getElementById('googleDrive');

// ===== start function ===== //
function onApiLoad() {

    gapi.load('auth2', function() {

        auth2 = gapi.auth2.init({
            client_id: clientId,
            prompt: 'select_account',
            scope: scope
        }).then(function() {

            GoogleAuth = gapi.auth2.getAuthInstance();
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                signOutBtn.classList.remove("invisible");
            }
            onAuthApiLoad()
        });
    });
}

function onAuthApiLoad() {

    authBtn.addEventListener('click', function() {

        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {

            GoogleAuth.grantOfflineAccess({
                prompt: 'select_account', //select_account, consent
                scope: scope
            }).then(
                function(resp) {
                    reloadUserAuth();
                }
            );
        } else {
            reloadUserAuth();
        }
    });

    signOutBtn.addEventListener('click', function() {
        GoogleAuth.signOut();
        signOutBtn.classList.add("invisible");
    });
}

function reloadUserAuth() {

    googleUser = GoogleAuth.currentUser.get();
    googleUser.reloadAuthResponse().then(
        function(authResponse) {
            signOutBtn.classList.remove("invisible");
            access_token = authResponse.access_token;
            createPicker(authResponse);
        }
    );
}

function createPicker(authResult) {

    if (authResult && !authResult.error) {

        gapi.load('picker', function() {
            const picker = new google.picker.PickerBuilder().
            enableFeature(google.picker.Feature.MULTISELECT_ENABLED).
            // addView(google.picker.ViewId.DOCS). // all types
            addView(google.picker.ViewId.DOCS_IMAGES).
            setOAuthToken(access_token).
            setDeveloperKey(developerKey).
            setCallback(pickerCallback).
            build();
            picker.setVisible(true);
        });
    }
}

async function pickerCallback(_data) {

    if (_data[google.picker.Response.DOCUMENTS]) {

        const xhrArray = _data[google.picker.Response.DOCUMENTS].map(async doc => {

            try {
                const result = JSON.stringify(await postData(`/`, {token: access_token, doc: doc}));
                const resultFinal = JSON.parse(result);
                console.log(`Ответ от сервера: ${result}`);

                let imgCard = document.createElement('div');
                imgCard.className = "item";
                imgCard.innerHTML = `<img src="${resultFinal.path}"/>
                                    <span>${resultFinal.name}</span>`;
                document.getElementById('uploaded').appendChild(imgCard);

            } catch (err) {
                console.log(`Ошибка от fetch: ${err.message}`)
            }
        });
        await Promise.all(xhrArray);
    }
}

function postData(url = ``, data = {}) {

    return fetch(url, {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST'
    })
    .then(function(response) {

        if(response.ok) {
            return response.json();
        }
        return response.text();
    });
}