import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Signup() {
  return (
    <div>
        Signup Page
        <form>
            <h3>Email</h3>
            <input placeholder="email"/>
            <h3>Password</h3>
            <input placeholder="password"/>
            <h3>Confirm Password</h3>
            <input placeholder="password"/>
            <button>Sign Up</button>
        </form>
    </div>
  )
}
