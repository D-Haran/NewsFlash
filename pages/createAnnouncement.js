import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Select, { components } from 'react-select'
import TaskAdded from '../components/task/taskAdded/taskAdded'
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import {auth, db} from '../firebase'
import {onAuthStateChanged} from 'firebase/auth'
import styles from '../styles/createAnnouncement.module.css'
const CreateAnnouncement = () => {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [notes, setNotes] = useState([])
    const [options, setOptions] = useState([
        { value: 'createNew', label: 'Create a new club...' },
      ])
    const [selectedOption, setSelectedOption] = useState({})
    const [clubName, setClubName] = useState({})
    const [createNewClub, setCreateNewClub] = useState(false);
    const [confirmClub, setConfirmClub] = useState(null);
    const [released, setReleased] = useState(false)
    const [taskAdded, setTaskAdded] = useState(null)
    const [completeSchoolName, setCompleteSchoolName] = useState("")
    const [notesAdded, setNotesAdded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)

    const fetchUser = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
        const fetch = async() => {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
            setCompleteSchoolName(docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
            checkAnnouncementExist(docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
            setRole(docSnap.data().role)
            } else {
            router.replace("/login")
            }
        }
        fetch()} 
        else {
            router.replace("/login")
        }
    });
        
}
    

useEffect(() => {
    fetchUser()
}, [taskAdded, selectedOption])
useEffect(() => {
    if (role) {
      if (role !== "teacher") {
        router.replace("/")
    }  
    }
}, [role])

const checkAnnouncementExist = async(complete) => {
    const dateNow = new Date()
    var date = JSON.stringify(dateNow.getFullYear()+'.'+(dateNow.getMonth()+1)+'.'+dateNow.getDate()).replace("\"", "").replace("\"", "");
    const docSnap = await getDoc(doc(db, 'schools', complete, 'announcements', date))

    if (docSnap.exists()) {
        if (!notesAdded) {
            setNotes(notes.concat(docSnap.data().notes))
            const newOptions = [{ value: 'createNew', label: 'Create a new club...' }]
            docSnap.data().notes.map((item) => {
                newOptions.push({value: item.club.value, label:item.club.label})            
        })
            const uniqueDates = [];
            for (let date of newOptions){
                    let unique = true;
                    for (let uniqueDate of uniqueDates){
                        if (uniqueDate.label == date.label && uniqueDate.value == date.value){
                        unique = false; 
                        }
                    }
                    if(unique){
                        uniqueDates.push(date);
                    }
                }
            setOptions(uniqueDates)
            }
        setNotesAdded(true)
        } else {
        // console.log("No such announcement!");
        }
}
    

    const releaseAnnouncement = async(e) => {
        e.preventDefault()
        if (role == "teacher") {
          setLoading(true)
        try {
            if (notes.length == 0) {
                const dateNow = new Date()
                var date = JSON.stringify(dateNow.getFullYear()+'.'+(dateNow.getMonth()+1)+'.'+dateNow.getDate()).replace("\"", "").replace("\"", "");
                // console.log(completeSchoolName)
                await deleteDoc(doc(db, 'schools', completeSchoolName, 'announcements', date)).then(
                setReleased(true)
            ).then(router.replace("/")) }

            if (notes.length >= 1) {
                    const dateNow = new Date()
                var date = JSON.stringify(dateNow.getFullYear()+'.'+(dateNow.getMonth()+1)+'.'+dateNow.getDate()).replace("\"", "").replace("\"", "");
                await setDoc(doc(db, 'schools', completeSchoolName, 'announcements', date), {
                    notes: notes,
                    dateAdded: Date().toLocaleString(),
                    createdBy: {name: user.displayName, email: user.email}
                }).then(
                    setReleased(true)
                ).then(router.replace("/"))
            }
            
        } catch {
            setLoading(false)
            // console.log("Rejected")
        }  
        }
        else {
            alert("Only teachers may edit, delete or release announcments")
            router.replace("/")
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
    options={[...new Set(options)]}
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
                <TaskAdded view={true} note={item} number={idx} completeNotes={notes} notesAdded={item} setNotesAdded={setTaskAdded} setNote={setNotes}/>
            </div>
            
        )
    })
}
    
{
    loading &&
    <button disabled className={styles.createAnnouncement}>Loading...</button>
}
{!loading && notes.length > 0 &&
    <button className={styles.createAnnouncement} onClick={releaseAnnouncement}>Release Announcements</button>
}
{!loading && notes.length == 0 &&
    <button disabled className={styles.createAnnouncement} onClick={releaseAnnouncement}>Release Announcements</button>
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