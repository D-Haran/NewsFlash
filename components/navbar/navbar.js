import styles from './navbar.module.css';
import Image from 'next/legacy/image'
import Link from 'next/link'
import {useRouter} from 'next/router';
import {auth, db} from '../../firebase'
import {useState, useContext, useEffect, Fragment} from 'react'
import { collection, getDocs, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import {signOut, onAuthStateChanged} from 'firebase/auth'
import LoadingBar from 'react-top-loading-bar'

const Navbar = () => {
    const router = useRouter()
    const [profileClicked, setProfileClicked] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('Test User')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userId, setUserId] = useState('')
    const [progress, setProgress] = useState(0)
    useEffect(() => {
      router.events.on('routeChangeStart', () => {setProgress(20); setProfileClicked(false)})
      router.events.on('routeChangeComplete', () => {setProgress(100)})
    })

    const handleProfileClick = () => {
        setProfileClicked(!profileClicked)
    }
    const fetchUser = () => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setIsLoggedIn(true)
          
          const fetch = async() => {
            try{
                setUserId(user.uid)
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                  console.log("Document data:", docSnap.data());
                } else {
                  console.log("No such document!");
                }
                } catch {
    
                }
          }
          fetch()}
        });
        
        
    }
    
      console.log(auth)
      useEffect(() => {
        fetchUser()
      })
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
                if (user) {
                setIsLoggedIn(true)
                setUsername(localStorage.getItem("displayName"))
                } else {
                    setIsLoggedIn(false)
                }
            });
    }, [auth])
    

  return (
    <div>        
    <LoadingBar color='#fffff' progress={70} height={4} waitingTime={500} onLoaderFinished={() => {setProgress(0)}} />

        <div className={styles.container}>
            <div className={styles.navContainer}>
                <Image className={styles.profileIcon} onClick={() => {router.push("/")}} src="/static/LogoOrangeSlim.svg" alt="NewsFlash Logo" width="-1" height="-1" objectFit='contain' layout='responsive' />    
                    <input disabled className={styles.search} placeholder="Search for Announcements" />
                <Image className={styles.profileIcon} onClick={handleProfileClick} alt="Profile Icon" src="/static/profileIconOrange.png" width="50" height="50" objectFit='contain' layout='responsive' />
                
            </div>
            
        </div>
        {
            profileClicked && 
            <div className={styles.profileDropDown}>
            {
                isLoggedIn &&
                <div>
                    <Link href={`/profiles/${userId}`}>
                        <p className={styles.dropDownText}>{localStorage.getItem("displayName")}</p>
                    </Link>
                    <p className={styles.dropDownText} onClick={(e) => {signOut(auth).then(function() {
                        e.preventDefault()
                        console.log('Signed Out');
                        localStorage.removeItem("displayName")
                        router.reload()
                      }, function(error) {
                        console.error('Sign Out Error', error);
                      });}}>Sign Out</p>
                </div>
            }
            {
                isLoggedIn === false &&
                <div>
                    <div onClick={()=>{router.push("/login"); setProfileClicked(false)}}><p className={styles.dropDownText}>Login</p></div>                
                </div>

            }
            

            
        </div>
        }
        
 
    </div>

  )
}

export default Navbar