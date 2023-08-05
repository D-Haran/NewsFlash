import React from 'react'
import { useRouter } from 'next/router'
import {auth, db} from '../../firebase'
import {useState, useEffect, Fragment} from 'react'
import { collection, getDocs, doc, getDoc, deleteDoc, getCountFromServer, updateDoc  } from "firebase/firestore";
import {signOut, onAuthStateChanged, deleteUser, getAuth} from 'firebase/auth'
import styles from "../../styles/user.module.css"
import Select from 'react-select'

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
    const [dateAdded, setDateAdded] = useState("")
    const teachers = []
    const fetchUser = () => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setCurrentUsertest(user)
            if (user.uid == userNamePath) {
          const fetch = async() => {
            try{
                const docRef = doc(db, "users", userNamePath);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                  setDocData(docSnap.data())
                  setAdmin(docSnap.data().admin)
                  // var oldDate = new Date();
                  // var newDate = new Date(oldDate.toDateString());
                  setDateAdded(new Date(docSnap.data().dateAdded).toLocaleDateString())
                  if (docSnap.data().role == "teacher") {
                    if (docSnap.data().admin) {
                      const collectionRef = collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teachers');
                    const snapshot = await getDocs(collectionRef);
                    const dataCount = await getCountFromServer(collectionRef)
                    snapshot.forEach(doc => {
                      if (!doc.data().test) {
                        if (dataCount.data().count > teachers.length+2) {
                          if (doc.data().user_id !== user.uid) {
                            const teacherData = doc.data()
                            teacherData["database_doc_name"] = doc.id
                            teacherData["name"] = teacherData["name"] + " ("+teacherData["email"]+")"
                            teachers.push(teacherData)
                          }
                        }
                      }
                        
                    })
                    setTeachersList(teachers)
                  }
                    
                  }
                  
                } 
                } catch (err){
                }
          }
          fetch()}
          }
          
        });
        
        
    }
    
      useEffect(() => {
        fetchUser()
        setUserNamePath(router.asPath.substring(10,))
      }, [userNamePath, router.asPath])

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
                    const docRefStudentAccount = doc(db, "schools", docData.school_abbreviated+"_"+docData.school_id, "students", docData.database_doc_name)
                    await deleteDoc(docRefStudentAccount)
                  if (docData.waiting_approval) {
                    const docRefStudentAccountRequest = doc(db, "schools", docData.school_abbreviated+"_"+docData.school_id, "teacher_requests", currentUsertest.uid)
                    await deleteDoc(docRefStudentAccountRequest)
                  }
                  }
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
                deleteUser(getAuth().currentUser).then(() => {router.replace("/")})
                  }
                }
            }
            
        } catch (err){
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
            <span className={styles.details}><b>Email:</b> {docData.email}</span>
            <br />
            <br />
            <span className={styles.details}><b>School:</b> {docData.school_name}</span>
            <br />
            <span className={styles.details}><b>School ID:</b> {docData.school_id}</span>
            <br />
            <span className={styles.details}><b>Date Created:</b> {dateAdded}</span>
            <br />
            <span className={styles.details}>
            <b>Role: </b>
            {docData.role == "teacher" && 
              <Fragment>{docData.admin && " Admin "}</Fragment>}
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