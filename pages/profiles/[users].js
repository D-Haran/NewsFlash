import React from 'react'
import { useRouter } from 'next/router'
import {auth, db} from '../../firebase'
import {useState, useContext, useEffect, Fragment} from 'react'
import { collection, getDocs, doc, setDoc, addDoc, getDoc, deleteDoc  } from "firebase/firestore";
import {signOut, onAuthStateChanged, deleteUser, getAuth} from 'firebase/auth'
import styles from "../../styles/user.module.css"

const Users = () => {
    const router = useRouter()

    const [userNamePath, setUserNamePath] = useState(router.asPath.substring(10,))
    const [docData, setDocData] = useState(null)
    const [currentUsertest, setCurrentUsertest] = useState(null)
    const [confirmed, setConfirmed] = useState(false)
    console.log(router.asPath.substring(10,));
    const fetchUser = () => {
        onAuthStateChanged(auth, (user) => {
          if (user.uid == userNamePath) {
          setCurrentUsertest(user)
          const fetch = async() => {
            try{
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                  console.log("Document data:", docSnap.data());
                  setDocData(docSnap.data())
                } else {
                  console.log("No such document!");
                }
                } catch {
    
                }
          }
          fetch()}
        });
        
        
    }
    
      useEffect(() => {
        if (!docData) {
          fetchUser()
        }
      }, [router])

      const deletingUser = async(e) => {
        e.preventDefault()
        try {
            if (currentUsertest) {
                const docRef = doc(db, "users", userNamePath);
                await deleteDoc(docRef)
                console.log("Deleted")
                deleteUser(getAuth().currentUser).then(() => {router.replace("/")})
            }
            
        } catch (err){
            console.log(err)
        }
      }
  return (
    <div className={styles.container}>
    {docData &&
        <Fragment>
        <span className={styles.name}>{docData.name}</span>
            <br />
            <span className={styles.details}>{docData.school_name}</span>
            <br />
            <span className={styles.details}>{docData.school_id}</span>
            <br />
            <span className={styles.details}>{docData.dateAdded}</span>
            <br />
            <span className={styles.details}>{docData.role}</span>
            <br />
            {
              !confirmed &&
              <button className={styles.button} onClick={(e) => {e.preventDefault();setConfirmed(true)}}>Delete Account</button>
            }
            {confirmed &&
            <button className={styles.buttons} onClick={deletingUser}>Delete Account</button>
            }
        </Fragment>
        
    }
        
    </div>
  )
}

export default Users