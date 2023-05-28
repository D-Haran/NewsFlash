import React, { Fragment, useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import {auth, db} from '../firebase'
import {onAuthStateChanged} from 'firebase/auth'
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import Modal from 'react-modal';
import TaskAdded from '../components/task/taskAdded/taskAdded';
import styles from '../styles/calendar.module.css'
import 'react-calendar/dist/Calendar.css'
import { useRouter } from 'next/router';



const PastAnnouncements = () => {
  const router = useRouter()
  const [value, onChange] = useState(new Date());
  const [clickedDay, setClickedDay] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [clickedDayDate, setClickedDayDate] = useState(null)
  const locale = 'fr-CA'; 
  const [notes, setNotes] = useState(null)
  const [completeSchoolName, setCompleteSchoolName] = useState("_null")
  const [returned, setReturned] = useState(false)
  const [docData, setDocData] = useState(null)
  const [currentDate, setCurrentDate] = useState("")
  const [announcementBool, setAnnouncementBool] = useState(false)

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      color: 'black',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: "12px",
      textAlign: "center",
    },
  };

  const fetchUser = async () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const fetch = async() => {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
        
            if (docSnap.exists()) {
                setCompleteSchoolName(docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
                
                setReturned(true)
                
            } else {
              router.replace("/login")
                console.log("No such document!");
            }
      }
      fetch()
} else {
  router.replace("/login")
}
        });
    
}

const getAnnouncementToday = async(clickedDate) => {
  try {
    const docRef = doc(db, 'schools', completeSchoolName, 'announcements', clickedDate);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAnnouncementBool(true)
        setDocData(docSnap.data())
        Modal.setAppElement(el)
    } else {
        setAnnouncementBool(false)
    }
  } catch (err) {
    console.log(err)
  }

}

useEffect(() => {
  Modal.setAppElement('body');
}, [])

useEffect(() => {
    fetchUser()
}, [auth])



  return (
    <div className={styles.container}>
    <div className={styles.main}>
      <Calendar 
      className={styles.calendar}
      onClickDay={(value, event) => {
        var date = JSON.stringify(value.getFullYear()+'.'+(value.getMonth()+1)+'.'+value.getDate()).replace("\"", "").replace("\"", "");
        setClickedDayDate(value.toDateString())     
        var nextDay = new Date(value);
        nextDay.setDate(value.getDate() + 1);      
        setClickedDay(date); 
        setIsOpen(true)
        getAnnouncementToday(date)
        }
      } 
      onChange={onChange} 
      value={value} />
      <Modal
      isOpen={modalIsOpen}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <button onClick={closeModal}>&#10006;</button>
      <div>{String(clickedDayDate)}</div>
      <form>
      <div className={styles.buttons}>
        <button onClick={(e) => {
          e.preventDefault()
          var nextDay = new Date(clickedDayDate);
          nextDay.setDate(nextDay.getDate() - 1);   
          setClickedDayDate(nextDay.toDateString()) 
          setIsOpen(true)
          var date = JSON.stringify(nextDay.getFullYear()+'.'+(nextDay.getMonth()+1)+'.'+nextDay.getDate()).replace("\"", "").replace("\"", "");
          setClickedDay(date) 
          getAnnouncementToday(date) 
        }}>&larr; Prev.</button>
        <button onClick={(e) => {
          e.preventDefault()
          var nextDay = new Date(clickedDayDate);
          nextDay.setDate(nextDay.getDate() + 1);   
          setClickedDayDate(nextDay.toDateString()) 
          setIsOpen(true)
          var date = JSON.stringify(nextDay.getFullYear()+'.'+(nextDay.getMonth()+1)+'.'+nextDay.getDate()).replace("\"", "").replace("\"", "");
          setClickedDay(date) 
          getAnnouncementToday(date) 
        }}>Next &rarr;</button>
      </div>
        
        {announcementBool && 
          <Fragment>
            {docData && 
              <div className={styles.cardContainer}>
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
            }
          </Fragment>
          
        }
        

        {
          !announcementBool &&
          <div className={styles.noAnnounce}>
            No announcements were released on this day :()
          </div>

        }
        
        
      </form>
    </Modal>
    </div>
    </div>
  )
}

export default PastAnnouncements