import styles from './navbar.module.css';
import Image from 'next/legacy/image'
import Link from 'next/link'
import {useRouter} from 'next/router';
import {auth, db} from '../../firebase'
import {useState, useEffect, Fragment} from 'react'
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
    const [user, setUser] = useState(null)
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
          setUser(user)
          const fetch = async() => {
            try{
                setUserId(user.uid)
                } catch {
    
                }
          }
          fetch()} else {
            console.log("navbar 43")
            router.push("/")
          }
        });
        
        
    }
      useEffect(() => {
        fetchUser()
      }, [])
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
            <div className={styles.LogoIcon}>
              <Image onClick={() => {router.push("/")}} src={"/static/LogoOrangeSlim.svg"} alt="NewsFlash Logo" width={200} height={200} objectFit='fill' layout='fill' />               
            </div>
                {router.asPath != "/login" &&
              <div onClick={() => {router.push("/today")}} className={styles.searchContainer}>
                <button className={styles.search}>Morning Announcements</button>
                </div> 
              }
                   
              {router.asPath != "/login" &&
              <Fragment>
               {
                user?.photoURL &&
                <div className={styles.profileIconUrl} >
                <Image onClick={handleProfileClick} alt="Profile Icon" src={user.photoURL} width="50" height="50" objectFit='contain' layout='responsive' />
              </div>
            }
              </Fragment>
              }
            {
              !user &&
              <Image className={styles.profileIcon} onClick={() => {router.push("/")}} src="/static/profileIconOrange.png" alt="NewsFlash Logo" width={200} height={200} objectFit='contain' layout='responsive' />    
            } 
                
            </div>
            
        </div>
        {
            profileClicked && 
            <div className={styles.profileDropDown}>
            <div>
            {
                isLoggedIn &&
                <div>
                    <Link href={`/profiles/${userId}`}>
                        <h3 className={styles.dropDownText}>{localStorage.getItem("displayName")}</h3>
                    </Link>
                    <ul>
                      <p className={styles.dropDownText} onClick={(e) => {signOut(auth).then(function() {
                          e.preventDefault()
                          console.log('Signed Out');
                          localStorage.removeItem("displayName")
                          router.reload()
                        }, function(error) {
                          console.error('Sign Out Error', error);
                        });}}>Sign Out</p>
                    </ul>
                    
                </div>
            } 
            {
                isLoggedIn === false &&
                <div>
                    <div onClick={()=>{router.push("/login"); setProfileClicked(false)}}><p className={styles.dropDownText}>Login</p></div>                
                </div>

            }
            </div>
        </div>
        }
        
 
    </div>

  )
}

export default Navbar