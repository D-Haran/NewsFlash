import Image from 'next/image'
import styles from '../../styles/login.module.css'
import { useState } from 'react'
import {signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo, onAuthStateChanged } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import { useRouter } from 'next/router'
import {auth, db} from "../../firebase"
import { createContext, useEffect } from 'react'

export default function Login() {
    const router = useRouter()
    const [user, setUser] = useAuthState(auth)
    const [buttonclicked, setButtonclicked] = useState(false)
    const googleAuth=new GoogleAuthProvider();

    const fetchUser = async () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log(user.uid)
            }
                const fetch = async() => {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
            
                if (docSnap.exists()) {
                    router.replace("/")
                } else {
                    console.log("No such document!");
                }
          }
          fetch()
    
            });
    }
    
    useEffect(() => {
      fetchUser()
    }, [])
    const login = async() => {
        setButtonclicked(true)
        const result = await signInWithPopup(auth, googleAuth) || null;
        console.log(result)
        if (result) {
            setButtonclicked(false)
            console.log(result.user.displayName)
            if (localStorage.getItem("displayName") === null) {
                localStorage.setItem("displayName", result.user.displayName)
            }
            else if (localStorage.getItem("displayName")) {
                localStorage.removeItem("displayName")
                localStorage.setItem("displayName", result.user.displayName)
            }
            const isFirstLogin = getAdditionalUserInfo(result).isNewUser
            console.log(isFirstLogin)
            if (isFirstLogin) {
                router.replace("/login/create")
            }
            else{
                router.push("/")
            }
            
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
        
    </div>
  )
}
