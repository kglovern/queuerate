import firebase from "../../../config/firebase";
import { createUser, getUser } from "../../js/APIs/Users";

export const LOGIN = "LOGIN";
export const SIGNUP = "SIGNUP";

export const login = user => dispatch => {
  const { email, password } = user;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(result => {
      // local storage
      dispatch(login_action(result.user));
      
    })
    .catch(error => {
      console.log(error);
    });
};

export const signup = user_creds => (dispatch, getState) => {
  const { email, password } = user_creds;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(result => {
      const user = {
        uuid: result.user.uid,
        email: result.user.email
      };

      createUser(user).then(returned_user => {
        dispatch(signup_action(returned_user));
        })
      
    })
    .catch(error => {
      console.log(error);
    });
};

export const logout = () => () => {
  firebase
    .auth()
    .signOut()
    .then(() => {})
    .catch(error => {
      console.log(error);
    });
};

function set_uuid(uuid) {
  window.localStorage.setItem("uuid", uuid)
}
