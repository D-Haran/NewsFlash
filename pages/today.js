import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import {auth, db} from '../firebase'
import { useEffect, useState } from 'react'
import TaskAdded from '../components/task/taskAdded/taskAdded'
import Task from "../components/task/task";
import {onAuthStateChanged} from 'firebase/auth'
import styles from '../styles/today.module.css'

const Today = () => {
    const [notes, setNotes] = useState(null)
    const [completeSchoolName, setCompleteSchoolName] = useState("_null")
    const [returned, setReturned] = useState(false)
    const [docData, setDocData] = useState(null)
    const [currentDate, setCurrentDate] = useState("")
    const [displayDate, setDisplayDate] = useState("")

    const fetchUser = async () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log(user.uid)
            }
                const fetch = async() => {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
            
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                    setCompleteSchoolName(docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
                    
                    setReturned(true)
                    
                } else {
                    console.log("No such document!");
                }
          }
          fetch()

            });
        
    }

    
    useEffect(() => {
        fetchUser()
    }, [auth])
    

    const getAnnouncementToday = async() => {
        var nowDate = new Date(); 
        var date = new String(nowDate.getFullYear()+'.'+(nowDate.getMonth()+1)+'.'+nowDate.getDate());
        setCurrentDate(date)
        setDisplayDate(nowDate.toDateString())
        const docRef = doc(db, 'schools', completeSchoolName, 'announcements', date);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Today's Announcement:", docSnap.data());
            setDocData(docSnap.data())
        } else {
            console.log("no announcement", completeSchoolName)
        }
    }

useEffect(() => {
    if (completeSchoolName !== "_null") {
        getAnnouncementToday()
        console.log({completeSchoolName})
    }
    }, [returned, completeSchoolName])
    
  return (
    <div className={styles.container}>
    
        <div className={styles.title}>
            <h1>Todays Morning Announcements:  {displayDate}</h1>
        </div>
      <main className={styles.main}>  
            {docData &&
                <div>
                    {
                        docData.notes.map((task, idx) => {
                            return(
                                <div key={idx} className={styles.card}>
                                    <TaskAdded view={false} notesAdded={task} completeNote={docData.notes} />
                                </div>
                                
                        )
                    })
                    }
                </div>
            }</main>
    </div>
  )
}

export default Today