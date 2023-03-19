import React, { useEffect, useState } from 'react'
import Task from '../components/task/task'
import { useRouter } from 'next/router'
import Select, { components } from 'react-select'
import TaskAdded from '../components/task/taskAdded/taskAdded'
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import {auth, db} from '../firebase'
import {onAuthStateChanged} from 'firebase/auth'
import styles from '../styles/createAnnouncement.module.css'

const CreateAnnouncement = () => {
    const router = useRouter()
    const [numOfTasks, setNumOfTasks] = useState(3)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [notes, setNotes] = useState([])
    const [completeNotes, setCompleteNotes] = useState([])
    const [options, setOptions] = useState([
        { value: 'createNew', label: 'Create a new club...' },
      ])
    const [selectedOption, setSelectedOption] = useState({})
    const [clubName, setClubName] = useState({})
    const [createNewClub, setCreateNewClub] = useState(false)
    const [schoolName, setSchoolName] = useState(false)
    const [schoolAbbrev, setSchoolAbbrev] = useState("")
    const [schoolId, setSchoolId] = useState(null);
    const [confirmClub, setConfirmClub] = useState(null);
    const [released, setReleased] = useState(false)
    const [taskAdded, setTaskAdded] = useState(null)
    const [completeSchoolName, setCompleteSchoolName] = useState("")
    const [notesAdded, setNotesAdded] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchUser = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log(user.uid)
            }
        const fetch = async() => {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            
            setSchoolName(docSnap.data().school_name)
            setSchoolId(docSnap.data().school_id)
            setSchoolAbbrev(docSnap.data().school_abbreviated)
            setCompleteSchoolName(schoolAbbrev+"_"+schoolId)
            console.log("hey", docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
            checkAnnouncementExist(docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
            } else {
            console.log("No such document!");
            }
        }
        fetch()
    });
        
}
    

useEffect(() => {
    fetchUser()
}, [taskAdded, selectedOption])

const checkAnnouncementExist = async(complete) => {
    const dateNow = new Date()
    var date = JSON.stringify(dateNow.getFullYear()+'.'+(dateNow.getMonth()+1)+'.'+dateNow.getDate()).replace("\"", "").replace("\"", "");
    const docSnap = await getDoc(doc(db, 'schools', complete, 'announcements', date))

    if (docSnap.exists()) {
        console.log("Already Announced:", docSnap.data());
        if (!notesAdded) {
            setNotes(notes.concat(docSnap.data().notes))
        }
        setNotesAdded(true)
        } else {
        console.log("No such announcement!");
        }
}

    

    const releaseAnnouncement = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const dateNow = new Date()
        var date = JSON.stringify(dateNow.getFullYear()+'.'+(dateNow.getMonth()+1)+'.'+dateNow.getDate()).replace("\"", "").replace("\"", "");
        await setDoc(doc(db, 'schools', completeSchoolName, 'announcements', date), {
            notes: notes,
            dateAdded: Date().toLocaleString()
        }).then(
            setReleased(true)
        ).then(router.replace("/"))
        } catch {
            setLoading(false)
        }
        
    }

    useEffect(() => {
        if (selectedOption != null) {
        if (selectedOption.label == "Create a new club...") {
            setCreateNewClub(true)
        }
        else {
            setCreateNewClub(false)
        }}
    }, [selectedOption])

    const handleNewNote = (e) => {
        e.preventDefault()
        if (createNewClub) {
            setConfirmClub(true)
        } else {
            setConfirmClub(false)
            const newNote = {id: Math.random(), title: title, description: description, club: selectedOption}
            setTaskAdded(newNote)
            console.log(newNote)
        setNotes(notes.concat(newNote))
        setTitle("")
        setDescription("")
        };
        
    }
  return (
    <div className={styles.container}>
{    !released &&
    <form className={styles.main}>
    <h2 className={styles.title}>Create an Announcement</h2>
    <label className={styles.labels}>Announcement Title</label>
    <input className={styles.inputs} onChange={(e) => {setTitle(e.target.value)}} value={title} />
    <label className={styles.labels}>Announcement Description</label>
    <textarea className={styles.inputs} onChange={(e) => {setDescription(e.target.value)}} value={description} />
    <label className={styles.labels}>Associated Club</label>
    <Select
    className={styles.selectMenu}
    isSearchable
    defaultValue={selectedOption}
    onChange={setSelectedOption}
    options={options}
    />
    {
        createNewClub &&
        <div className={styles.createClubForm}>
            <label className={styles.label}>Club Name</label>
            <input className={styles.inputs} onChange={(e) => {setClubName(e.target.value)}} />
            
            <button className={styles.createClubButton} onClick={(e) => {
                e.preventDefault();
                const id = Math.random()
                setOptions(options.concat({value: id, label:clubName}))
                setSelectedOption({value: id, label:clubName})
            }}>Create Club</button>
        </div>
    }
    {confirmClub &&
        <h6 className={styles.error}>*Please Confirm an Associated Club*</h6>
    }
    <button className={styles.createTask} onClick={handleNewNote}>Create Task</button>
    {
    notes.map((item, idx) => {
        return (
            <div key={idx} className={styles.card}>
                <TaskAdded view={true} note={item} number={idx} setCompleteNotes={setNotes} completeNotes={notes} notesAdded={item} setNotesAdded={setTaskAdded} setNote={setNotes}/>
            </div>
            
        )
    })
}
{
    loading &&
    <button disabled className={styles.createAnnouncement}>Loading...</button>
}
{!loading &&
    <button className={styles.createAnnouncement} onClick={releaseAnnouncement}>Release Announcements</button>
}
</form>}

{
    released &&
    <div className={styles.releasedContainer}>
        <h2 className={styles.announced}>Announcement Released</h2>

    </div>
}
    </div>
  )
}

export default CreateAnnouncement