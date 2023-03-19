import Link from 'next/link'
import React from 'react'
import { Fragment } from 'react'
import styles from './create.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPersonChalkboard, faUserGraduate} from '@fortawesome/free-solid-svg-icons'

const Create = () => {
  return (
    <div className={styles.container}>
    <h2 clssName={styles.title}>
    You seem new! Are you a Student or Teacher?
    </h2>
    <div className={styles.grid}>
    <Link href="/login/create/student" className={styles.card}>
                <h2>Student &rarr;</h2>
                <FontAwesomeIcon icon={faUserGraduate}></FontAwesomeIcon>
        </Link>
        <Link href="/login/create/teacher" className={styles.card}>
                <h2>Teacher &rarr;</h2>
                <FontAwesomeIcon icon={faPersonChalkboard}></FontAwesomeIcon>
        </Link>
    </div>
    </div>
  )
}

export default Create