import Head from 'next/head'
import Image from 'next/image'
import {auth, db} from '../firebase'
import {useState, useContext, useEffect, Fragment} from 'react'
import styles from '../styles/teacherRequests.module.css'
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc, addDoc, getDoc, get, getCountFromServer} from "firebase/firestore";
import { useRouter } from 'next/router'
import Link from 'next/link'
import {signOut, onAuthStateChanged} from 'firebase/auth'

const TeacherRequests = () => {
    var requests = []
    const [allRequests, setAllRequests] = useState([])
    const [userId, setUserId] = useState("")
    const fetchUser = () => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid)
          const fetch = async() => {
            try{
                const docRef = doc(db, "users", user.uid);
                console.log({user})
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                  console.log("Document data:", docSnap.data());
                  if (docSnap.data().role == "teacher") {
                    const collectionRef = collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teacher_requests');
                    const snapshot = await getDocs(collectionRef);
                    const dataCount = await getCountFromServer(collectionRef)
                    snapshot.forEach(doc => {
                        if (dataCount.data().count > requests.length) {
                           requests.push(doc.data())
                        }
                        console.log(requests) 
                    })
                    setAllRequests(requests)
                  }
                } else {
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

  const handleApprove = (id, idx, name, email) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
        const approve = async() => {
              const docRef = doc(db, "users", user.uid);
              console.log({user})
              const docSnap = await getDoc(docRef);
  
              if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                if (docSnap.data().role == "teacher") {
                  await deleteDoc(doc(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teacher_requests', id));
                  console.log('deleted')

                  const collectionRefUser = doc(db, 'users', id)
                  await updateDoc((collectionRefUser), {
                    role: "teacher",
                    waiting_approval: false,
                  })
                  console.log("editted")

                  await addDoc(collection(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teachers'), {
                    name: name,
                    email: email,
                    role: 'teacher',
                    user_id: id,
                    dateAdded: Date().toLocaleString()
              })
                  console.log("added")

                requests.splice(idx, 1)
                setAllRequests(requests)
                }
              } else {
                console.log("No such document!");
              }
        }
        approve()}
      });
  }

  const handleDeny = (id, idx) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
        const deny = async() => {
              const docRef = doc(db, "users", user.uid);
              console.log({user})
              const docSnap = await getDoc(docRef);
  
              if (docSnap.exists()) {
                if (docSnap.data().role == "teacher") {
                  await deleteDoc(doc(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teacher_requests', id));
                  console.log('deleted')
                requests.splice(idx, 1)
                setAllRequests(requests)
                }
              } else {
                console.log("No such document!");
              }
        }
        deny()}
      });
  }

  return (
    <div className={styles.container}>
    <div className={styles.main}>
        <h1 className={styles.title}>Teacher Requests</h1>
        <div className={styles.cardContainer}>
        {
            allRequests.map((item, idx) => {
                console.log(item.id)
                if (!item.test) {
                    return (
                    <div key={idx} className={styles.card}>
                    <div>
                        <button className={styles.approve} onClick={() => {handleApprove(item.user_id, idx, item.name, item.email)}}>Approve</button>
                        <button className={styles.deny} onClick={() => {handleDeny(item.user_id, idx)}}>Deny</button>
                    </div>
                        {item.name}
                        <br />
                        {item.email}
                        </div> 
                    )
                }
                
                
            })
        }
        </div>
    </div>
    
    
    </div>
  )
}

export default TeacherRequests