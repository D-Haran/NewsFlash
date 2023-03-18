import Head from 'next/head'
import Image from 'next/image'
import {auth, db} from '../firebase'
import {useState, useContext, useEffect, Fragment} from 'react'
import styles from '../styles/Home.module.css'
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import { useRouter } from 'next/router'
import Link from 'next/link'
import {signOut, onAuthStateChanged} from 'firebase/auth'



export default function Home() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isTeacher, setIsTeacher] = useState(false)
  const [schoolName, setSchoolName] = useState("")
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  function openModal() {
    setIsOpen(true);
  }

  const fetchUser = async () => {
    try{
      const docRef = doc(db, "users", auth.lastNotifiedUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      if (docSnap.data().role == "teacher") {
        setIsTeacher(true)
      }
      
      setSchoolName(docSnap.data().school_name)
    } else {
      console.log("No such document!");
    }
    } catch {

    }
    
}



  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true)
    }
  });

  console.log(auth)
  useEffect(() => {
    fetchUser()
    setDisplayName(localStorage.getItem('displayName'))
    console.log(auth.lastNotifiedUid)
  }, [])

  const options = [
    { value: 'createNew', label: 'Create a new club...' },
  ];
useEffect(() => {
    console.log(selectedOption)
}, [selectedOption])
  return (
    <div className={styles.container}>
      <Head>
        <title>NewsFlash</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>NewsFlash</a>
        </h1>

        <p className={styles.description}>
          For School/Business Purposes
        </p>
        {isLoggedIn &&
      <p>Hello {displayName}</p>
      }
        

        <div className={styles.grid}>
        {!isLoggedIn &&
        <Link href="/login" className={styles.card}>
              <h2>Sign-In&rarr;</h2>
              <p>Login with your google account</p>
            </Link>
      }
          {isLoggedIn &&
            <Fragment>
          <Link href="/today" className={styles.card}>
            <h2>Morning Announcements &rarr;</h2>
            <p>{"Check out the today's morning announcements"}</p>
          </Link>

          <Link href="/calendar" className={styles.card}>
            <h2>Past Announcements &rarr;</h2>
            <p>{"Check out the past announcements"}</p>
          </Link>
          
            
            <div className={styles.card} onClick={(e) => {signOut(auth).then(function() {
            e.preventDefault()
            console.log('Signed Out');
            localStorage.removeItem("displayName")
            router.reload()
          }, function(error) {
            console.error('Sign Out Error', error);
          });}}>
            <h2>Log out &rarr;</h2>
            <p>{"Log out of google account"}</p>
          </div>
          {
            isTeacher &&
            <Link href="/createAnnouncement" className={styles.card}>
          <h2>Create Announcement &rarr;</h2>
          <p>Create a new announcement in {schoolName}</p>
        </Link>
          }
          
            </Fragment>
          
        }
        </div>
      </main>

      <footer className={styles.footer}>
        <Link
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </Link>
      </footer>
    </div>
  )
}
