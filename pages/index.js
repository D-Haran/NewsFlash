import Head from 'next/head'
import Image from 'next/image'
import {auth, db} from '../firebase'
import {useState, useEffect, Fragment} from 'react'
import styles from '../styles/Home.module.css'
import { collection, getDocs, doc, setDoc, addDoc, getDoc,getCountFromServer } from "firebase/firestore";
import { useRouter } from 'next/router'
import Link from 'next/link'
import {signOut, onAuthStateChanged} from 'firebase/auth'



export default function Home() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isTeacher, setIsTeacher] = useState(false)
  const [schoolName, setSchoolName] = useState("")
  const [schoolAbbrev, setSchoolAbbrev] = useState("")
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [docData, setDocData] = useState(null);
  const [teacherRequestLength, setTeacherRequestLength] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [loading, setLoading] = useState(true);

  function openModal() {
    setIsOpen(true);
  }

  const fetchUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true)
      
      const fetch = async() => {
        try{
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setDocData(docSnap.data())
              if (docSnap.data().role == "teacher") {
                setIsTeacher(true)
                const collectionRef = collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teacher_requests');
                const snapshot = await getCountFromServer(collectionRef);
                setTeacherRequestLength(snapshot.data().count - 1)
              }
              
              setSchoolName(docSnap.data().school_name)
              setSchoolAbbrev(docSnap.data().school_abbreviated)
              if (docSnap.data().role == "teacher") {
                if (docSnap.data().admin) {
                  const collectionRef = collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'students');
                const dataCount = await getCountFromServer(collectionRef)
                setStudentCount(dataCount.data().count)
                }
              }
              if (docSnap.data().role == "teacher") {
                if (docSnap.data().admin) {
                  const collectionRef = collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teachers');
                const dataCount = await getCountFromServer(collectionRef)
                setTeacherCount(dataCount.data().count)
                }
              }
              setLoading(false)
            } else {
              setLoading(false)
              router.replace("/login")
              // console.log("No such document!");
            }
            } catch (err){
              // console.log(err)
            }
      }
      fetch()}
    });
    
    
}

  useEffect(() => {
    fetchUser()
    setDisplayName(localStorage.getItem('displayName'))
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>NewsFlash</title>
        <meta 
        name="description" 
        content="NewsFlash is your one-stop platform to stay informed about all the latest school announcements and upcoming events at FMM School. Accessible through your school Google account, this virtual bulletin board allows students to easily find information on club activities, meetings, and other events. Say goodbye to missed morning announcements and low attendance rates. Be part of the NewsFlash revolution, and never miss an important event again!"
        key="desc" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>NewsFlash.</a>
        </h1>

        <p className={styles.description}>
        {docData && <Fragment>{docData.school_name}</Fragment>}
        {!docData &&
          <Fragment>Connected Classrooms, Informed Students.</Fragment>
        }
          
        </p>
        {isLoggedIn &&
      <p>Hello <b>{displayName}</b> {!loading &&  <Fragment>({docData && <Fragment>{docData.role == "teacher" && <Fragment>{docData.admin && "Admin "}</Fragment>}{docData.role}{docData.waiting_approval && <Fragment> waiting for teacher approval</Fragment>}</Fragment> }</Fragment>}) {loading && "(loading...)"}</p>
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
          <Link href="/events" className={styles.card}>
            <h2>Events &rarr;</h2>
            <p>{`Check out upcoming events in ${schoolName}`}</p>
          </Link>
          
            
          {
            isTeacher &&
            <Fragment>
            <Link href="/createAnnouncement" className={styles.card}>
          <h2>Create Announcement &rarr;</h2>
          <p>Create a new announcement in {schoolName}</p>
        </Link>
        {docData.admin == true &&
          <Fragment>
            <Link href="/teacherRequests" className={styles.card}>
              <h2>Teacher Requests &rarr;</h2>
              <p>You have <b>{teacherRequestLength}</b> teacher requests at the moment</p>
            </Link>
            <Link href="/schoolList" className={styles.card}>
              <h2>Student & Teacher List &rarr;</h2>
              <p>Get list of all <b>{studentCount+teacherCount - 2}</b> teachers & students at {schoolAbbrev}</p>
            </Link>
          </Fragment>
        }
            
            </Fragment>
            
          }       
          <div className={styles.card} onClick={(e) => {signOut(auth).then(function() {
            e.preventDefault()
            // console.log('Signed Out');
            localStorage.removeItem("displayName")
            router.reload()
          }, function(error) {
            console.error('Sign Out Error', error);
          });}}>
            <h2>&larr; Log out </h2>
            <p>{"Log out of google account"}</p>
          </div>   

            
            </Fragment>
            
        }
        <div className={styles.card} onClick={(e) => {
            e.preventDefault()
            router.push("/about")}}>
            <h2>About </h2>
            <p>{"Find out what NewsFlash is all about!"}</p>
          </div> 
        </div>
      </main>

      <footer className={styles.footer}>
        <Link
          href="https://github.com/D-Haran/"
          target="_blank"
          rel="noopener noreferrer"
        >Made by Derrick Ratnaharan
          <span className={styles.logo}>
            <Image src={"/static/github.png"} width={"20"} height={"20"} />
          </span>
        </Link>
      </footer>
    </div>
  )
}
