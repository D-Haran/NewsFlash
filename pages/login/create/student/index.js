import React, { Fragment } from 'react'
import styles from './student.module.css'
import Select from 'react-select'
import {auth, db} from "../../../../firebase"
import {onAuthStateChanged} from 'firebase/auth'
import { collection, getDocs, doc, setDoc, addDoc } from "firebase/firestore";
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Student = () => {
  const router = useRouter()
  const [schools, setSchools] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);
  const [email, setEmail] = useState("")
  const [schoolCode, setSchoolCode] = useState("")
  const [wrongCode, setWrongCode] = useState(false)
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

  useEffect(() => {
    fetchPost()
}, [])
  useEffect(() => {
    console.log(selectedOption)
}, [selectedOption])

const options = [
  ...schools
];

const handleSubmit = async(e) => {
  e.preventDefault()
  if (schoolCode == selectedOption.value) {
    console.log("verified")
    const collectionName = selectedOption.id
      const userName = localStorage.getItem("displayName").replace(/\s+/g, '') + "_" + makeid(5)
      const userId = auth.lastNotifiedUid
          await setDoc(doc(db, 'users', userId), {
            name: localStorage.getItem("displayName"),
            role: 'student',
            email: email,
            school_id: selectedOption.value,
            school_name: selectedOption.label,
            school_abbreviated: selectedOption.abbreviated,
            dateAdded: Date().toLocaleString()
        })
          await setDoc(doc(db, 'schools', collectionName, 'students', userName), {
            name: localStorage.getItem("displayName"),
            dateAdded: Date().toLocaleString()
        })
      

      router.push("/")
  } else {
    setWrongCode(true)
  }
    

}

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
  return (
    <div>
      <h1>
        Welcome, join the NewsFlash Community!
      </h1>
      <form className={styles.form} onSubmit={handleSubmit}>
      <Select
        className={styles.selectMenu}
        isSearchable
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
        <label>School Access Code</label>
        <input type="code" onChange={(e) => {setSchoolCode(e.target.value)}}/>
        {
          wrongCode &&
          <p>School Code entered is incorrect. Please try again</p>

        }
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Student