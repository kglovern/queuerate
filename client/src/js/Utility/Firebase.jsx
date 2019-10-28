import firebase from "../../../config/firebase";
import { createUser } from "../APIs/Users";

export const get_uuid = () => window.localStorage.getItem("uuid");

const set_uuid = uuid => window.localStorage.setItem("uuid", uuid);

const remove_uuid = () => window.localStorage.removeItem("uuid")

export const login = user => {
    const { email, password } = user;
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(result => {
            set_uuid(result.user.uid);
            window.location.reload();
        })
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
            createUser(user).then(result => {
                const { data: { data: { user: { uuid } } } } = result;
                set_uuid(uuid);
                window.location.reload();
            })
        })
        .catch(error => {
            console.log(error);
        });
};

export const logout = () => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            remove_uuid();
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
};