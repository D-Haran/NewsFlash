import React, { Fragment } from 'react'
import styles from './teacher.module.css'
import Select from 'react-select'
import {auth, db} from "../../../../firebase"
import {onAuthStateChanged} from 'firebase/auth'
import { collection, getDocs, doc, setDoc, addDoc , getDoc} from "firebase/firestore";
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Teacher = () => {
  const router = useRouter()
    const [schools, setSchools] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);
    const [randomId, setRandomId] = useState("")
    const [schoolName, setSchoolName] = useState("")
    const [abbrev, setAbbrev] = useState("")
    const [email, setEmail] = useState("")
    const [wrong, setWrong] = useState("")
    const [inputedCode, setInputedCode] = useState("")
    const [loading, setLoading] = useState("")


    const fetchPost = async () => {
        await getDocs(collection(db, "schools"))
            .then((querySnapshot)=>{               
                const newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));
                setSchools(newData);                
                console.log(newData);
            })
       
    }

    
    useEffect(() => {
    onAuthStateChanged(auth, (user) => {
          if (user) {
            setEmail(user.email)
          }})
    }, [auth])
    
    const makeNewSchool = async () => {
      setLoading(true)
      const collectionName = abbrev + "_" + randomId
      const userName = localStorage.getItem("displayName").replace(/\s+/g, '') + "_" + makeid(5)
      const userId = auth.lastNotifiedUid
      try {
        if (selectedOption.label == "Create a new School...") {
          await setDoc(doc(db, "schools", collectionName), {
            label: schoolName,
            value: randomId,
            abbreviated: abbrev,
          })
          await setDoc(doc(db, 'users', userId), {
            name: localStorage.getItem("displayName"),
            role: 'teacher',
            email: email,
            school_id: randomId,
            school_name: schoolName,
            school_abbreviated: abbrev,
            dateAdded: Date().toLocaleString()
        })
          await addDoc(collection(db, 'schools', collectionName, 'announcements'), {
            data: 'Hello there World',
        })
          await addDoc(collection(db, 'schools', collectionName, 'teacher_requests'), {
            data: 'test',
        })
          await addDoc(collection(db, 'schools', collectionName, 'students'), {
            name: 'nothing yet',
            dateAdded: Date().toLocaleString()
        })
          await addDoc(collection(db, 'schools', collectionName, 'teachers'), {
            name: localStorage.getItem("displayName"),
            dateAdded: Date().toLocaleString()
        })
          await setDoc(doc(db, 'schools', collectionName, 'teachers', userName), {
            name: localStorage.getItem("displayName"),
            dateAdded: Date().toLocaleString()
        })
        router.push("/")
      }
      else {
        if (inputedCode == selectedOption.value) {
          setWrong(false)
          await setDoc(doc(db, 'users', userId), {
          name: localStorage.getItem("displayName"),
          email: email,
          role: 'student',
          school_id: selectedOption.id.slice(-6),
          school_name: selectedOption.label,
          school_abbreviated: selectedOption.abbreviated,
          dateAdded: Date().toLocaleString(),
          waiting_approval: true
      })
      await setDoc(doc(db, 'schools', selectedOption.id, 'teacher_requests', userId), {
          name: localStorage.getItem("displayName"),
          email: email,
          role: 'teacher',
          user_id: userId,
          school_id: selectedOption.id.slice(-6),
          school_name: selectedOption.label,
          school_abbreviated: selectedOption.abbreviated,
          dateAdded: Date().toLocaleString()
          
    })
    
    router.push("/")
      } else {
        setWrong(true)
        setLoading(false)
      }
        }
      } catch {
        setLoading(false)
      }
    }

    useEffect(() => {
        fetchPost()
    }, [])

    const makeid = (length) => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result
  }
  

    const options = [
        { value: 'createNew', label: 'Create a new School...' }, ...schools
      ];
  return (
    <div className={styles.container}>
    <h1 className={styles.title}>
        Welcome, join the NewsFlash Community!
      </h1>
      <form className={styles.form} onSubmit={(e) => {e.preventDefault();makeNewSchool()}}>
        <label className={styles.labels}>Select School</label>
        <Select
        className={styles.selectMenu}
        isSearchable
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
      {selectedOption &&
        <Fragment>
        {selectedOption.value == "createNew" &&
        <div>
            <h3 className={styles.labels}>Generate Access Code</h3>
            <input className={styles.inputs} value={randomId} disabled/>
            <button onClick={(e) => {
              e.preventDefault();
              setRandomId(makeid(6))}}>Generate</button>
            <br />
            <label className={styles.labels}>Name of School</label>
            <input className={styles.inputs} onChange={(e) => {setSchoolName(e.target.value); console.log(schoolName)}} />

            <label className={styles.labels}>Abbreviated Name</label>
            <input className={styles.inputs} onChange={(e) => {setAbbrev(e.target.value); console.log(abbrev)}} />
        </div>
    }
        </Fragment>
      }

      {selectedOption &&
        <Fragment>
        {selectedOption.value !== "createNew" &&
      <Fragment>
        <label className={styles.labels}>School Code</label>
          <input className={styles.inputs} onChange={(e) => {setInputedCode(e.target.value)}} />
      </Fragment>
      
    }
        </Fragment>
      
      }
      
      {
        wrong &&
        <p className={styles.wrong}>School code is incorrect. Please try again</p>
      }
      {loading &&
        <button disabled className={styles.buttons}>loading...</button>
      }
      {!loading &&
        <button className={styles.buttons} type="submit">Register</button>
      }
        
      </form>
    </div>
  )
}

export default Teacher