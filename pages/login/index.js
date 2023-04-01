import Image from 'next/image'
import styles from '../../styles/login.module.css'
import { Fragment, useState } from 'react'
import {signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo, onAuthStateChanged, getAuth } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import { useRouter } from 'next/router'
import {auth, db} from "../../firebase"
import { createContext, useEffect } from 'react'

export default function Login() {
    const router = useRouter()
    const [user, setUser] = useAuthState(auth)
    const [buttonclicked, setButtonclicked] = useState(false)
    const [errorCode, setErrorCode] = useState(false)
    const googleAuth=new GoogleAuthProvider();

    const login = async() => {
        setButtonclicked(true)
        try {
const result = await signInWithPopup(auth, googleAuth) || null;
        if (result) {
            setButtonclicked(false)
            if (localStorage.getItem("displayName") === null) {
                localStorage.setItem("displayName", result.user.displayName)
            }
            else if (localStorage.getItem("displayName")) {
                localStorage.removeItem("displayName")
                localStorage.setItem("displayName", result.user.displayName)
            }
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetch = async() => {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                
                    if (docSnap.exists()) {
                        router.push("/")
                        
                    } else {
                    router.replace("/login/create")
                    }
                } 
                fetch()
                // ...
            }
            else {
                
            }
});
            
            
        }
        } catch(err) {
            setButtonclicked(false)
            setErrorCode(err.code.slice(5, ).replace(/-/g, " "))
        }
        
    }
    return (
    <div className={styles.container}>
    <h2 className={styles.title}>Welcome!
    </h2>
        
        {!buttonclicked &&
        <button className={styles.signInWithGoogleButton} onClick={login}>Login with Google</button>
        }
        {buttonclicked &&
        <button className={styles.signInWithGoogleButton} disabled>Loading...</button>
        }
        {errorCode &&
            <div className={styles.error}  onClick={() => {setErrorCode(null)}}>
            <p className={styles.errorText}>{errorCode}</p>
            </div>
            
        }
        
    </div>
  )
}
