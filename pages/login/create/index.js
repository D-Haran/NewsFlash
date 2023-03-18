import Link from 'next/link'
import React from 'react'
import { Fragment } from 'react'
import styles from './create.module.css'
const Create = () => {
  return (
    <div className={styles.container}>
    <h2>
    Are you a Student or Teacher?
    </h2>
    <div className={styles.grid}>
    <Link href="/login/create/student" className={styles.card}>
                <h2>Student &rarr;</h2>
                <p>{"Check out the today's morning announcements"}</p>
        </Link>
        <Link href="/login/create/teacher" className={styles.card}>
                <h2>Teacher &rarr;</h2>
                <p>{"Check out the today's morning announcements"}</p>
        </Link>
    </div>
    </div>
  )
}

export default Create