import React from 'react'
import { useRouter } from 'next/router'
import {auth, db} from '../../firebase'
import {useState, useContext, useEffect, Fragment} from 'react'
import { collection, getDocs, doc, setDoc, addDoc, getDoc, deleteDoc, getCountFromServer, updateDoc  } from "firebase/firestore";
import {signOut, onAuthStateChanged, deleteUser, getAuth} from 'firebase/auth'
import styles from "../../styles/user.module.css"
import Select, { components } from 'react-select'

const Users = () => {
    const router = useRouter()

    const [userNamePath, setUserNamePath] = useState(router.asPath.substring(10,))
    const [docData, setDocData] = useState(null)
    const [currentUsertest, setCurrentUsertest] = useState(null)
    const [confirmed, setConfirmed] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null)
    const [changeAdminPopUp, setChangeAdminPopUp] = useState(false)
    const [teachersList, setTeachersList] = useState([])
    const [admin, setAdmin] = useState(false)
    const teachers = []
    console.log(router.asPath.substring(10,));
    const fetchUser = () => {
        onAuthStateChanged(auth, (user) => {
          if (user.uid == userNamePath) {
          setCurrentUsertest(user)
          const fetch = async() => {
            try{
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                  setDocData(docSnap.data())
                  setAdmin(docSnap.data().admin)
                  console.log("Document data:", docSnap.data());
                  if (docSnap.data().role == "teacher") {
                    if (docSnap.data().admin) {
                      console.log(docSnap.data().school_abbreviated+"_"+docSnap.data().school_id)
                      const collectionRef = collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teachers');
                    const snapshot = await getDocs(collectionRef);
                    const dataCount = await getCountFromServer(collectionRef)
                    console.log(dataCount.data().count)
                    snapshot.forEach(doc => {
                      if (!doc.data().test) {
                        if (dataCount.data().count > teachers.length+2) {
                          if (doc.data().user_id !== user.uid) {
                            const teacherData = doc.data()
                            teacherData["database_doc_name"] = doc.id
                            console.log(teacherData)
                            teachers.push(teacherData)
                          }
                        }
                      }
                        
                        console.log(teachers)
                        
                    })
                    setTeachersList(teachers)
                  }
                    
                  }
                  
                } else {
                  console.log("No such document!");
                }
                } catch (err){
                  console.log("ERROR: ", err)
                }
          }
          fetch()}
        });
        
        
    }
    
      useEffect(() => {
        if (!docData) {
          fetchUser()
        }
        setUserNamePath(router.asPath.substring(10,))
      }, [docData, router])

      const deletingUser = async(e) => {
        e.preventDefault()
        try {
            if (currentUsertest) {
                const docRefUser = doc(db, "users", userNamePath);
                if (docData.admin !== true) {
                  await deleteDoc(docRefUser)
                  if (docData.role == "teacher") {
                    const docRefTeacherAccount = doc(db, "schools", docData.school_abbreviated+"_"+docData.school_id, "teachers", docData.database_doc_name || currentUsertest.uid)
                    await deleteDoc(docRefTeacherAccount)
                  } else if (docData.role == "student") {
                    console.log(docData.school_abbreviated+"_"+docData.school_id)
                    const docRefStudentAccount = doc(db, "schools", docData.school_abbreviated+"_"+docData.school_id, "students", docData.database_doc_name)
                    await deleteDoc(docRefStudentAccount)
                  if (docData.waiting_approval) {
                    const docRefStudentAccountRequest = doc(db, "schools", docData.school_abbreviated+"_"+docData.school_id, "teacher_requests", currentUsertest.uid)
                    await deleteDoc(docRefStudentAccountRequest)
                  }
                  }
                console.log("Deleted")
                deleteUser(getAuth().currentUser).then(() => {router.replace("/")})
                }
                else if (docData.admin == true) {
                  if (selectedOption !== null) {
                  if (docData.role == "teacher") {
                    const docRefNewTeacherAccount = doc(db, "schools", docData.school_abbreviated+"_"+docData.school_id, "teachers", selectedOption.database_doc_name)
                    await updateDoc((docRefNewTeacherAccount), {
                      admin: true
                    })
                    const docRefNewTeacherAccountUser = doc(db, "users", selectedOption.user_id)
                    await updateDoc((docRefNewTeacherAccountUser), {
                      admin: true
                    })
                    const docRefTeacherAccount = doc(db, "schools", docData.school_abbreviated+"_"+docData.school_id, "teachers", docData.database_doc_name || currentUsertest.uid)
                    await deleteDoc(docRefTeacherAccount)
                    await deleteDoc(docRefUser)
                  }
                console.log("Deleted")
                deleteUser(getAuth().currentUser).then(() => {router.replace("/")})
                  }
                }
            }
            
        } catch (err){
            console.log(err)
        }
      }



  return (
    <div className={styles.container}>
    {docData &&
        <Fragment>
        {changeAdminPopUp &&
          <div>
            As admin, you must give another account admin privilleges before deleting this account
            
            <Select
    className={styles.selectMenu}
    isSearchable
    options={teachersList}
    onChange={setSelectedOption}
    getOptionLabel ={(option)=>option.name}
   getOptionValue ={(option)=>option.email}
    />
          </div>
        }
        <span className={styles.name}>{docData.name}</span>
            <br />
            <span className={styles.details}>{docData.school_name}</span>
            <br />
            <span className={styles.details}>{docData.school_id}</span>
            <br />
            <span className={styles.details}>{docData.dateAdded}</span>
            <br />
            <span className={styles.details}>
            {docData.role == "teacher" && 
              <Fragment>{docData.admin && "Admin "}</Fragment>}
              {docData.role}
            </span>
            <br />
            {
              !confirmed &&
              <button className={styles.button} onClick={(e) => {e.preventDefault();setConfirmed(true); if (admin) {setChangeAdminPopUp(true)}}}>Delete Account</button>
            }
            {confirmed &&
            <button className={styles.buttons} onClick={deletingUser}>Delete Account</button>
            }
        </Fragment>
        
    }
        
    </div>
  )
}

export default Users