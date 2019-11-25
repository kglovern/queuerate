import firebase from "../../../config/firebase";
import { createUser } from "../APIs/Users";
import {toast} from "react-toastify";

export const get_uuid = () => window.localStorage.getItem("uuid");

const set_uuid = uuid => window.localStorage.setItem("uuid", uuid);

const remove_uuid = () => window.localStorage.removeItem("uuid")

export const login = async user => {
    const { email, password } = user;
    try {
        const result = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
        set_uuid(result.user.uid);
        return result;
    } catch (e) {
        console.log(e);
        return false;
    }
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

            toast.error("Unable to register - make sure you enter a valid email address", {
                position: "top-center"
            });
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

export const doPasswordReset = email => {
     firebase
         .auth()
         .sendPasswordResetEmail(email)
         .then(() => {
            window.location.href = ('/');
        })
         .catch(error => {
            console.log(error);
         });
}
