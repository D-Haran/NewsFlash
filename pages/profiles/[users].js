import React from 'react'
import { useRouter } from 'next/router'
import {auth, db} from '../../firebase'
import {useState, useContext, useEffect, Fragment} from 'react'
import { collection, getDocs, doc, setDoc, addDoc, getDoc, deleteDoc  } from "firebase/firestore";
import {signOut, onAuthStateChanged, currentUser, deleteUser, getAuth} from 'firebase/auth'

const Users = () => {
    const router = useRouter()

    const [userNamePath, setUserNamePath] = useState(router.asPath.substring(10,))
    const [docData, setDocData] = useState(null)
    const [currentUsertest, setCurrentUsertest] = useState(null)
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
                  console.log("Document data:", docSnap.data());
                  setDocData(docSnap.data())
                } else {
                  console.log("No such document!");
                }
                } catch {
    
                }
          }
          fetch()}
        });
        
        
    }
    
      useEffect(() => {
        fetchUser()
      }, [])

      const deleteUser = async() => {
        try {
            if (currentUsertest) {
                const docRef = doc(db, "users", userNamePath);
                await deleteDoc(docRef).then(console.log("Deleted"))
                .then(router.replace("/"))
                .then(deleteUser(getAuth().currentUser))
                .then(signOut(auth).then(function() {
                    console.log('Signed Out');
                    localStorage.removeItem("displayName")
                  }, function(error) {
                    console.error('Sign Out Error', error);
                  }))
            }
            
        } catch (err){
            console.log(err)
        }
      }
  return (
    <div>
    {docData &&
        <Fragment>
        <span>{docData.name}</span>
            <br />
            <span>{docData.school_name}</span>
            <br />
            <span>{docData.school_id}</span>
            <br />
            <span>{docData.dateAdded}</span>
            <br />
            <span>{docData.role}</span>
            <br />
            <button onClick={deleteUser}>Delete Account</button>
        </Fragment>
        
    }
        
    </div>
  )
}

export default Users