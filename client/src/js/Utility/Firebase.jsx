import firebase from "../../../config/firebase";
import { createUser } from "../APIs/Users";

export function get_uuid() {
    return window.localStorage.getItem("uuid")
}

function set_uuid(uuid) {
    window.localStorage.setItem("uuid", uuid)
}

export const login = user => () => {
    const { email, password } = user;
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(result => set_uuid(result.user.uid))
        .catch(error => {
            console.log(error);
        });
};

export const signup = user_creds => {
    const { email, password } = user_creds;
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
            const user = {
                uuid: result.user.uid,
                email: result.user.email
            };
            //TODO: remove user from firebase if createUser fails
            createUser(user).then(result => {console.log(result); set_uuid(result.data.uuid)})
        })
        .catch(error => {
            console.log(error);
        });
};

export const logout = () => () => {
    firebase
        .auth()
        .signOut()
        .then(() => { set_uuid(null) })
        .catch(error => {
            console.log(error);
        });
};