import styles from './navbar.module.css';
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router';
import {useState} from 'react'

const Navbar = () => {
    const router = useRouter()
    const [profileClicked, setProfileClicked] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('Test User')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [samePass, setSamePass] = useState(false)

    const handleProfileClick = () => {
        setProfileClicked(!profileClicked)
    }

    const handleLoginClick = () => {
        setLoginModal(true) 
        setProfileClicked(false)
    }

    const handleRegisterClick = () => {
        setRegisterModal(true) 
        setProfileClicked(false)
    }

    const handleSubmitLogin = (event) => {
        event.preventDefault()
        const email = localStorage.getItem('user')
        const pass = document.getElementById('password').value
        setUsername(email)
        setEmail(email)
        setPassword(pass)
        setIsLoggedIn(true)
        setLoginModal(false)
        console.log(email, pass)
    }
    const handleSubmitSignUp = (event) => {
        event.preventDefault()
        const username = document.getElementById('username').value
        const email = document.getElementById('email').value
        const pass = document.getElementById('password').value
        setUsername(username)
        setEmail(email)
        setPassword(pass)
        setRegisterModal(false)
        setIsLoggedIn(true)
        console.log(email, pass, username)
    }

    const validatePassword = () => {
        const pass = document.getElementById('password')
        const confirmPass = document.getElementById('confirmPassword')
            if(pass.value != confirmPass.value) {
              confirmPass.setCustomValidity("Passwords Don't Match");
            } else {
              confirmPass.setCustomValidity('');
            }
          }

  return (
    <div>
        <div className={styles.container}>
            <div className={styles.navContainer}>
                <Image className={styles.profileIcon} onClick={() => {router.push("/")}} src="/static/LogoOrangeSlim.svg" alt="NoteShare Logo" width="40" height="40" />    
                    <input className={styles.search} placeholder="Search for Announcements" />
                <Image className={styles.profileIcon} onClick={handleProfileClick} alt="Logo Icon" src="/static/profileIconOrange.png" width="40" height="40" />
                
            </div>
            
        </div>
        {
            profileClicked && 
            <div className={styles.profileDropDown}>
            {
                isLoggedIn &&
                <div>
                    <Link href={`/profiles/${username}`}>
                        <p className={styles.dropDownText}>{username}</p>
                    </Link>
                    <p className={styles.dropDownText}>Sign Out</p>
                </div>
            }
            {
                isLoggedIn === false &&
                <div>
                    <div onClick={handleLoginClick}><p className={styles.dropDownText}>Login</p></div>
                    <div onClick={handleRegisterClick}><p className={styles.dropDownText}>Register</p></div>                    
                </div>

            }
            

            
        </div>
        }
        
 
    </div>

  )
}

export default Navbar