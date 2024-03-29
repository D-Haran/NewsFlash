import React, { useEffect, useState } from 'react'
import Member from '../components/member/member'
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc, addDoc, getDoc, get, getCountFromServer} from "firebase/firestore";
import {auth, db} from '../firebase'
import {signOut, onAuthStateChanged} from 'firebase/auth'
import styles from "../styles/schoolList.module.css"
import { useRouter } from 'next/router'
import { Fragment } from 'react';

const SchoolList = () => {
  const router = useRouter()
  const [docData, setDocData] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [user, setUser] = useState(null)
  const [deleteMember, setDeleteMember] = useState(null)
  const [studentsList, setStudentsList] = useState([])
  const [teachersList, setTeachersList] = useState([])
  const [teacherCount, setTeacherCount] = useState(0)
  const [deletePopUp, setDeletePopUp] = useState(false)
  const [studentCount, setStudentCount] = useState(0)
  const [schoolUserName, setSchoolUserName] = useState(null)
  const students = []
  const teachers = []
  const fetchUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      const fetch = async() => {
        try{
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setDocData(docSnap.data())
              setSchoolUserName(docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
              setAdmin(docSnap.data().admin)
              if (docSnap.data().role == "teacher") {
                if (docSnap.data().admin) {
                  const collectionRef = collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'students');
                const snapshot = await getDocs(collectionRef);
                const dataCount = await getCountFromServer(collectionRef)
                snapshot.forEach(doc => {
                    if (dataCount.data().count - 1 > students.length) {
                      if (doc.data().test == "test") {
                        
                      } else {
                        students.push(doc.data())
                      }
                    }
                    setStudentsList(students)
                    setStudentCount(dataCount.data().count - 1)
                })
                }
                
              }
              if (docSnap.data().role == "teacher") {
                if (docSnap.data().admin) {
                  const collectionRef = collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teachers');
                const snapshot = await getDocs(collectionRef);
                const dataCount = await getCountFromServer(collectionRef)
                snapshot.forEach(doc => {
                    if (dataCount.data().count > teachers.length) {
                      const teacherData = doc.data()
                      if (doc.data().test == "test") {
                        
                      } else {
                      if (doc.data().user_id == user.uid) {
                        teacherData["name"] = teacherData["name"] + " (You)"
                        teacherData["you"] = true
                        teachers.push(teacherData)
                      } else {
                        teacherData["userName"] = doc.id
                        teachers.push(teacherData)
                      }
                    }
                  }
                    setTeachersList(teachers)
                    setTeacherCount(dataCount.data().count - 1)
                    
                })
              }
                }
                
            } else {
              // console.log("No such document!");
              router.replace("/login")
            }
            } catch (err){
              // console.log(err)
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
}, [])
  const getStudents = async() => {
    if (docData) {
      const collectionRef = collection(db, 'schools', docData.school_abbreviated+"_"+docData.school_id, 'students');
    const snapshot = await getDocs(collectionRef);
    }
  }
  useEffect(() => {
    getStudents()
  }, [])

  useEffect(() => {
    if (admin == false) {
          router.replace("/")
      }
}, [admin])

const deleteUser = async(userInfo) => {
  if (userInfo[0] == "student") {
    await deleteDoc(doc(db, 'schools', schoolUserName, 'students', userInfo[1]))
    await deleteDoc(doc(db, 'users', userInfo[2]))
  }
  else if (userInfo[0] == "teacher") {
    await deleteDoc(doc(db, 'schools', schoolUserName, 'teachers', userInfo[1]))
    await deleteDoc(doc(db, 'users', userInfo[2])).then(console.log("deleted"))
  }
}
  
  return (
    <div className={styles.container}>
    <main className={styles.main}>
    {deletePopUp &&
      <div className={styles.deleteUserPopup}>
        <div>
          Are you sure you want to remove user?
        </div>
        <button onClick={() => {
          deleteUser(deleteMember).then(setDeletePopUp(false)).then(fetchUser())
        }}>Remove user</button>
        <button onClick={() => {setDeletePopUp(false)}}>Cancel</button>
      </div>
    }
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <h1>School List</h1>
        <h2>Teachers: <b>{teacherCount}</b></h2>
        <div className={styles.cardContainer}>
        {teachersList.map((teacher, idx) => {
          if (teacher.email) {
            // console.log(teacher)
            return(
            <div key={idx} className={styles.card}>
            {!teacher.you &&
              <p onClick={() => {
              setDeleteMember(["teacher", teacher.userName, teacher.user_id])
              setDeletePopUp(true)
            }} className={styles.delete}>x</p>
            }
            
              <p>{teacher.name}</p>
              <p>{teacher.email}</p>
            </div>
          )
          }
          
        })
      }
        </div>
        
        <h2>Students: <b>{studentCount}</b></h2>
        <div className={styles.cardContainer}>
        {studentsList.map((student, idx) => {
          if (student.email) {
            // console.log(student)
            return(
            <div key={idx} className={styles.card}>
            <p onClick={() => {
              setDeleteMember(["student", student.userName, student.user_id])
              setDeletePopUp(true)
            }} className={styles.delete}>x</p>
                <p>{student.name}</p>
              <p>{student.email}</p>
            </div>
          )
          }
          
        })
      }
        </div>
    </main>
    </div>
  )
}

export default SchoolList