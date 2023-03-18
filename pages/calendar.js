import React, { Fragment, useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import {auth, db} from './firebase'
import {onAuthStateChanged} from 'firebase/auth'
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import Modal from 'react-modal';
import TaskAdded from '../components/task/taskAdded/taskAdded';
import styles from '../styles/calendar.module.css'

const PastAnnouncements = () => {
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
    },
  };

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

const getAnnouncementToday = async(clickedDate) => {
  try {
    const docRef = doc(db, 'schools', completeSchoolName, 'announcements', clickedDate);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAnnouncementBool(true)
        console.log("Today's Announcement:", docSnap.data());
        setDocData(docSnap.data())
    } else {
        console.log("no announcement", completeSchoolName)
        setAnnouncementBool(false)
    }
  } catch (err) {
    console.log(err)
  }

}


useEffect(() => {
    fetchUser()
}, [auth])



  return (
    <div>
      <Calendar 
      onClickDay={(value, event) => {
        var date = JSON.stringify(value.getFullYear()+'.'+(value.getMonth()+1)+'.'+value.getDate()).replace("\"", "").replace("\"", "");
        console.log(date);
        setClickedDayDate(value)
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
      <button onClick={closeModal}>close</button>
      <div>{String(clickedDay)}</div>
      <form>
      <div className={styles.buttons}>
        <button>Prev. &larr;</button>
        <button>Next &rarr;</button>
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
  )
}

export default PastAnnouncements