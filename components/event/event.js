import React, { Fragment } from 'react'
import styles from './event.module.css'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'

const Event = (props) => {
    const title = props.title
    const description = props.description
    const dateTime = props.dateTime
    const location = props.location
    const club = props.club
    const id = props.id
    const admin = props.admin
    const completeSchoolName = props.completeSchoolName
    const refetch = props.refetch
    const setRefetch = props.setRefetch

    const deleteEvent = async() => {
      console.log(completeSchoolName)
      try {
          await deleteDoc(doc(db, 'schools', completeSchoolName, "events", id)).then(console.log("deleted")).then(setRefetch(!refetch))
      } catch (err) {
        console.log(err)
      }
    }

  return (
    <div className={styles.card}>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    {admin &&
      <Fragment>
      <div onClick={() => {deleteEvent(id)}} className={styles.exit}>
    <p className={styles.ps}>X</p>
</div>
<div className={styles.edit}>
    <div  className={"fa fa-edit"}>
</div>
</div>
      </Fragment>
    }
    
    <label className={styles.labels}>Title: </label> {title}
    <br />
    <label className={styles.labels}>Description: </label> {description} 
    <br />
    <label className={styles.labels}>Associated Club: </label> {club}
    <br />
    <label className={styles.labels}>Location: </label>{location}
    <br />
    <label className={styles.labels}>Date: </label>{dateTime}
    </div>
  )
}

export default Event