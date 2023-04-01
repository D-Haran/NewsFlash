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
    const router = useRouter()
    var requests = []
    const [allRequests, setAllRequests] = useState([])
    const [userId, setUserId] = useState("")
    const [admin, setAdmin] = useState(null)
    const [docData, setDocData] = useState(null)
    const [loading, setLoading] = useState(false)
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
                  setDocData(docSnap.data())
                  setAdmin(docSnap.data().admin)
                  console.log(docSnap.data().admin)
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
                  router.replace("/login")
                }
                } catch (err){
                  console.log(err)
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

  const handleApprove = (id, idx, name, email, database_doc_name) => {
    setLoading(true)
    onAuthStateChanged(auth, (user) => {
        if (user) {
          if (admin) {
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
                    admin: false,
                    role: "teacher",
                    waiting_approval: false,
                  })
                  console.log("editted")

                  await setDoc(doc(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teachers', database_doc_name), {
                    admin: false,
                    name: name,
                    email: email,
                    role: 'teacher',
                    user_id: id,
                    database_doc_name: database_doc_name,
                    dateAdded: Date().toLocaleString()
              })
                  console.log("added")

                requests.splice(idx, 1)
                setAllRequests(requests)
                setLoading(false)
                }
              } else {
                console.log("No such document!");
                setLoading(false)
              }
        }
        approve()
          }
        }
      });
  }

  const handleDeny = (id, idx) => {
    setLoading(true)
    onAuthStateChanged(auth, (user) => {
        if (user) {
        const deny = async() => {
              const docRef = doc(db, "users", user.uid);
              console.log({user})
              const docSnap = await getDoc(docRef);
  
              if (docSnap.exists()) {
                if (docSnap.data().role == "teacher") {
                  const collectionRefUser = doc(db, 'users', id)
                  await updateDoc((collectionRefUser), {
                    role: "student",
                    waiting_approval: false,
                  })
                  await deleteDoc(doc(db, 'schools', docSnap.data().school_abbreviated+"_"+docSnap.data().school_id, 'teacher_requests', id));
                  console.log('deleted')
                requests.splice(idx, 1)
                setAllRequests(requests)
                }
                setLoading(false)
              } else {
                console.log("No such document!");
                setLoading(false)
              }
        }
        deny()}
      });
  }

useEffect(() => {
    if (admin == false) {
          router.replace("/")
      }
}, [admin])

  return (
    <div className={styles.container}>
    <h1 className={styles.title}>Teacher Requests</h1>
    <div className={styles.main}>
        <div className={styles.cardContainer}>
        {
            allRequests.map((item, idx) => {
                console.log(item.id)
                if (!item.test) {
                    return (
                    <div key={idx} className={styles.card}>
                    {!loading &&
                        <div>
                            <button className={styles.approve} onClick={() => {handleApprove(item.user_id, idx, item.name, item.email, item.database_doc_name)}}>Approve</button>
                            <button className={styles.deny} onClick={() => {handleDeny(item.user_id, idx)}}>Deny</button>
                        </div>
                    }
                    {loading &&
                        <div>
                            <button diabled className={styles.approve} >Approve</button>
                            <button disabled className={styles.deny}>Deny</button>
                        </div>
                    }
                    
                        {item.name}
                        <br />
                        {item.email}
                        </div> 
                    )
                }
                
                
            })
        }

        {allRequests.length == 1 &&
          <div className={styles.noRequests}>
            <h2>No teacher requests at the moment.</h2>
          </div>
        }
        </div>
    </div>
    
    
    </div>
  )
}

export default TeacherRequests