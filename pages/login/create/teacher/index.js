import React, { Fragment } from 'react'
import styles from './teacher.module.css'
import Select from 'react-select'
import {auth, db} from "../../../../firebase"
import { collection, getDocs, doc, setDoc, addDoc } from "firebase/firestore";
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
    const fetchPost = async () => {
        await getDocs(collection(db, "schools"))
            .then((querySnapshot)=>{               
                const newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));
                setSchools(newData);                
                console.log(newData);
            })
       
    }

    const joinSchool = (() => {

    })
    const makeNewSchool = async () => {
      const collectionName = abbrev + "_" + randomId
      const userName = localStorage.getItem("displayName").replace(/\s+/g, '') + "_" + makeid(5)
      const userId = auth.lastNotifiedUid
      if (selectedOption.label == "Create a new School...") {
          await setDoc(doc(db, "schools", collectionName), {
            label: schoolName,
            value: randomId,
            abbreviated: abbrev,
          })
          await setDoc(doc(db, 'users', userId), {
            name: localStorage.getItem("displayName"),
            role: 'teacher',
            school_id: randomId,
            school_name: schoolName,
            school_abbreviated: abbrev,
            dateAdded: Date().toLocaleString()
        })
          await addDoc(collection(db, 'schools', collectionName, 'announcements'), {
            data: 'Hello there World',
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
      }
      else {
        await setDoc(doc(db, 'users', userId), {
          name: localStorage.getItem("displayName"),
          role: 'teacher',
          school_id: selectedOption.id,
          school_name: selectedOption.label,
          school_abbreviated: selectedOption.abbreviated,
          dateAdded: Date().toLocaleString()
      })
      await addDoc(collection(db, 'schools', selectedOption.id, 'teachers'), {
        name: localStorage.getItem("displayName"),
        dateAdded: Date().toLocaleString()
    })
      }

      router.push("/")
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
    useEffect(() => {
        console.log(schools)
    }, [selectedOption])
  return (
    <div className={styles.container}>
    <h1>
        Welcome, join the NewsFlash Community!
      </h1>
      <form className={styles.form} onSubmit={(e) => {e.preventDefault();makeNewSchool()}}>
        <label>Select School</label>
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
            <h3>Generate Access Code</h3>
            <input value={randomId} disabled/>
            <button onClick={(e) => {
              e.preventDefault();
              setRandomId(makeid(6))}}>Generate</button>
            <br />
            <label>Name of School</label>
            <input onChange={(e) => {setSchoolName(e.target.value); console.log(schoolName)}} />

            <label>Abbreviated Name</label>
            <input onChange={(e) => {setAbbrev(e.target.value); console.log(abbrev)}} />
        </div>
    }
        </Fragment>
      }
      
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Teacher