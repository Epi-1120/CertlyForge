import { auth } from './firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const googleProvider = new GoogleAuthProvider()
export function loginWithEmail(email, password) { return signInWithEmailAndPassword(auth, email, password) }
export function registerWithEmail(email, password) { return createUserWithEmailAndPassword(auth, email, password) }
export function loginWithGoogle() { return signInWithPopup(auth, googleProvider) }
export function logout() { return signOut(auth) }
export function onAuth(callback) { return onAuthStateChanged(auth, callback) }
