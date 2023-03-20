import Link from 'next/link'
import React, { useEffect } from 'react'
import { Fragment } from 'react'
import styles from './create.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPersonChalkboard, faUserGraduate} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import {onAuthStateChanged} from 'firebase/auth'
import {auth, db} from "../../../firebase"

const Create = () => {
  const router = useRouter()
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
  return (
    <div className={styles.container}>
    <h2 clssName={styles.title}>
    You seem new! Are you a Student or Teacher?
    </h2>
    <div className={styles.grid}>
    <Link href="/login/create/student" className={styles.card}>
                <h2>Student &rarr;</h2>
                <FontAwesomeIcon className={styles.icons} icon={faUserGraduate}></FontAwesomeIcon>
        </Link>
        <Link href="/login/create/teacher" className={styles.card}>
                <h2>Teacher &rarr;</h2>
                <FontAwesomeIcon className={styles.icons} icon={faPersonChalkboard}></FontAwesomeIcon>
        </Link>
    </div>
    </div>
  )
}

export default Create