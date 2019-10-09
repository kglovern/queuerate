import { authRef, provider } from '../../../config/firebase';
import { FETCH_USER } from './types';

export const fetchUser = () => dispatch => {
    authRef.onAuthStateChanged(user => {
        if (user) {
            dispatch({
                type: FETCH_USER,
                payload: user
            });
        } else {
            dispatch({
                type: FETCH_USER,
                payload: null
            });
        }
    });
};
export const login = (email, password) => dispatch => {
    authRef.signInWithEmailAndPassword(email, password)
        .then(result => {})
        .catch(error => {
            console.log(error);
        });
};

export const createUser = (email, password) => dispatch => {
    authRef.createUserWithEmailAndPassword(email, password)
        .then(result => {})
        .catch(error => {
            console.log(error);
        });
};

export const logOut = () => dispatch => {
    authRef.signOut()
        .then(() => {
            
        })
        .catch(error => {
            console.log(error);
        });
};

