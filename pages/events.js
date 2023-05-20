import Head from 'next/head'
import Image from 'next/image'
import {auth, db} from '../firebase'
import {useState, useEffect, Fragment} from 'react'
import styles from '../styles/events.module.css'
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc, addDoc, getDoc, get, getCountFromServer} from "firebase/firestore";
import { useRouter } from 'next/router'
import Event from '../components/event/event'
import {signOut, onAuthStateChanged} from 'firebase/auth'

const UpcomingEvents = () => {
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [dateTime, setDateTime] = useState("")
    const [location, setLocation] = useState("")
    const [club, setClub] = useState("")
    const [completeSchoolName, setCompleteSchoolName] = useState("")
    const [eventsList, setEventsList] = useState([])
    const [eventsCount, setEventsCount] = useState(0)
    const [isTeacher, setIsTeacher] = useState(false)
    const [schoolName, setSchoolName] = useState("")
    const [schoolAbbrev, setSchoolAbbrev] = useState("")
    const [schoolId, setSchoolId] = useState("")
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [refetch, setRefetch] = useState(false);
    const events = []
    const fetchUser = () => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setIsLoggedIn(true)
          
          const fetch = async() => {
            try{
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.data().role == "teacher") {
                    setIsTeacher(true)
                    if (docSnap.data().admin) {
                      setIsAdmin(true)
                    }
                  }
                if (docSnap.exists()) {
                  setUser(docSnap.data())
                    const collectionRef = collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'events');
                    const snapshot = await getDocs(collectionRef);
                    const dataCount = await getCountFromServer(collectionRef)
                    snapshot.forEach(doc => {
                        console.log(doc.data())
                        if (dataCount.data().count - 1 > events.length) {
                            
                            if (doc.data().__ == "__") {
                            
                            } else {
                                const eventData = doc.data()
                                eventData["id"] = doc.id
                            events.push(eventData)
                            }
                        }
                        setEventsList(events)
                        console.log(events)
                        setEventsCount(dataCount.data().count - 1)
                    })
                  setSchoolName(docSnap.data().school_name)
                  setSchoolId(docSnap.data().school_id)
                  setSchoolAbbrev(docSnap.data().school_abbreviated)
                  setCompleteSchoolName(docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
                  console.log(docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
                  setLoading(false)
                } else {
                  setLoading(false)
                  router.replace("/login")
                  console.log("No such document!");
                }
                } catch (err){
                  console.log(err)
                }
          }
          fetch()}
        });
        
        
    }

    useEffect(() => {
        fetchUser()
      }, [])
    useEffect(() => {
        fetchUser()
      }, [refetch])

      const handleCreateEvent = async(e) => {
        e.preventDefault()
        // const dateNow = new Date()
        //         var date = JSON.stringify(dateNow.getFullYear()+'.'+(dateNow.getMonth()+1)+'.'+dateNow.getDate()).replace("\"", "").replace("\"", "");
                await addDoc(collection(db, 'schools', completeSchoolName, 'events'), {
                    title: title,
                    description: description,
                    dateTime: dateTime,
                    location: location,
                    club: club,
                    dateAdded: Date().toLocaleString(),
                    // createdBy: {name: user.displayName, email: user.email}
                }).then(setTitle("")).then(setDescription("")).then(setDateTime("")).then(setLocation("")).then(setClub("")).then(fetchUser())
      }
    return (
        <div className={styles.container}>
            <h1>Upcoming Events at {schoolAbbrev}</h1>
            {isTeacher && 
                <div className={styles.createContainer}>
                <h3>Create Event</h3>
                <form onSubmit={handleCreateEvent}>
                <label>Title: </label>
                    <input className={styles.inputs} value={title} onChange={(e) => {e.preventDefault(); setTitle(e.target.value)}}/>
                    <br />
                    <div className={styles.formTextArea}>
                                    <label>Description: </label>
                    <textarea className={styles.inputs}value={description} onChange={(e) => {e.preventDefault(); setDescription(e.target.value)}} />

                    </div>
                    <br />
                <label>Date/Time: </label>
                    <input type="date" className={styles.inputs} value={dateTime} onChange={(e) => {e.preventDefault(); setDateTime(e.target.value); console.log(e.target.value)}} />
                    <br />
                <label>Location: </label>
                    <input className={styles.inputs} value={location} onChange={(e) => {e.preventDefault(); setLocation(e.target.value)}} />
                    <br />
                <label>Asscociated Club: </label>
                    <input className={styles.inputs} value={club} onChange={(e) => {e.preventDefault(); setClub(e.target.value)}} />
                <button type="submit">Submit</button>
                </form>
                </div>
                
            }
            <div className={styles.eventsContainer}>
            {eventsList.map((event, idx) => {
                return(
                    <div key={idx}>
                        <Event 
                        title={event.title} 
                        setTitle={event.setTitle} 
                        description={event.description}
                        setDescription={event.setDescription}
                        dateTime={event.dateTime}
                        setDateTime={event.setDateTime}
                        location={event.location}
                        setLocation={event.setLocation}
                        club={event.club}
                        setClub={event.setClub}
                        id={event.id}
                        admin={isAdmin}
                        completeSchoolName={completeSchoolName}
                        setRefetch={setRefetch}
                        refetch={refetch}
                        />
                    </div>
                )
            })}

            {
                eventsList.length == 0 &&
                <div className={styles.noAnnouncements}>
                <h2>No Upcoming Events Yet.
                </h2>
                
                </div>
            }
            </div>
            
            <br />
            
        </div>
    )
    }

export default UpcomingEvents