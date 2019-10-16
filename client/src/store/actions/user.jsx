import firebase from "../../../config/firebase";
import { createUser } from "../../js/APIs/Users";

export const LOGIN = "LOGIN";
export const SIGNUP = "SIGNUP";

export const login = user => dispatch => {
  const { email, password } = user;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(result => {
      dispatch({ type: LOGIN, payload: result.user });
    })
    .catch(error => {
      console.log(error);
    });
};

export const signup = user => (dispatch, getState) => {
  const { email, password } = user;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(result => {
      const user = {
        uuid: result.user.uid,
        email: result.user.email
      };

      createUser(user).then(() => {
        dispatch(store_user(user));
        })
      
    })
    .catch(error => {
      console.log(error);
    });
};

export const logout = () => dispatch => {
  firebase
    .auth()
    .signOut()
    .then(() => {})
    .catch(error => {
      console.log(error);
    });
};

const store_user = (data) => {
  return { type: SIGNUP, payload: data };
}
