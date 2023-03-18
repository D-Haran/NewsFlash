import React from 'react'
import styles from "./student.module.css"

const Student = () => {
  return (
    <div>
      <h1>
        Welcome, join the NewsFlash Community!
      </h1>
      <form className={styles.form}>
        <label>School Access Code</label>
        <input type="code"/>
        <label>Full Name</label>
        <input type="text"/>
        
      </form>
    </div>
  )
}

export default Student