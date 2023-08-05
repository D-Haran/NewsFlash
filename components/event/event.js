import React, { Fragment, useState } from 'react'
import styles from './event.module.css'
import { deleteDoc, doc, endAt, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useRouter } from 'next/router'

const Event = (props) => {
  const router = useRouter()
    const eventTitle = props.title
    const eventDescription = props.description
    const eventDateTime = props.dateTime
    const startDate = props.startDate
    const endDate = props.endDate
    const eventLocation = props.location
    const eventClub = props.club
    const id = props.id
    const admin = props.admin
    const completeSchoolName = props.completeSchoolName
    const refetch = props.refetch
    const setRefetch = props.setRefetch

    const [editting, setEditting] = useState(false)
    const [title, setTitle] = useState(eventTitle)
    const [description, setDescription] = useState(eventDescription)
    const [dateTime, setDateTime] = useState(eventDateTime)
    const [startDateTime, setStartDateTime] = useState(startDate)
    const [endDateTime, setEndDateTime] = useState(endDate)
    const [location, setLocation] = useState(eventLocation)
    const [club, setClub] = useState(eventClub)

    const deleteEvent = async() => {
      // console.log(completeSchoolName)
      try {
          await deleteDoc(doc(db, 'schools', completeSchoolName, "events", id)).then(router.reload)
          const chosenDate = new Date(dateTime)
          var dateNow = new Date(chosenDate)
          dateNow.setDate(chosenDate.getDate() + 1)
          const date = JSON.stringify(dateNow.getFullYear()+'.'+(dateNow.getMonth()+1)+'.'+dateNow.getDate()).replace("\"", "").replace("\"", "")
          await deleteDoc(doc(db, 'schools', completeSchoolName, 'announcements', date))
      } catch (err) {
        // console.log(err)
      }
    }

    const handleCancel = async(e) => {
      e.preventDefault()
      setTitle(eventTitle)
      setDescription(eventDescription)
      setDateTime(eventDateTime)
      setStartDateTime(startDate)
      setEndDateTime(endDate)
      setLocation(eventLocation)
      setClub(eventClub)
      setEditting(false)
    }
    const handleUpdate = async(rangeBool) => {
      if (rangeBool == false) {
        await updateDoc(doc(db, 'schools', completeSchoolName, 'events', id), {
          title: title,
          description: description,
          club:club,
          location: location,
          dateTime: dateTime,
          club: club,
          dateAdded: Date().toLocaleString(),
        }).then(setEditting(false)).then(setRefetch(!refetch))

      } else {
        await updateDoc(doc(db, 'schools', completeSchoolName, 'events', id), {
          title: title,
          description: description,
          club:club,
          location: location,
          startDate: startDateTime,
          endDate: endDateTime,
          club: club,
          dateAdded: Date().toLocaleString(),
        }).then(setEditting(false)).then(setRefetch(!refetch))
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
<div onClick={() => {setEditting(true)}} className={styles.edit}>
    <div  className={"fa fa-edit"}>
</div>
</div>
      </Fragment>
    }
    {!editting &&
      <Fragment>
        <label className={styles.labels}>Title: </label> {title}
        <br />
        <label className={styles.labels}>Description: </label> {description} 
        <br />
        <label className={styles.labels}>Associated Club: </label> {club}
        <br />
        <label className={styles.labels}>Location: </label>{location}
        <br />
        {dateTime &&
          <Fragment>
            <label className={styles.labels}>Date: </label>{dateTime}
          </Fragment>
        }
        {!dateTime &&
          <Fragment>
            <label className={styles.labels}>Start Date: </label>{startDate}
            <label className={styles.labels}>End Date: </label>{endDate}
          </Fragment>
        }
        
      </Fragment>
    }
    
    {editting &&
      <Fragment>
      <form onSubmit={() => {startDate == null ? handleUpdate(false): handleUpdate(true)}}>
        <label className={styles.labels}>Title: </label> 
        <input value={title} onChange={(e) => {setTitle(e.target.value)}}/>
        <br />
        <label className={styles.labels}>Description: </label>
        <input value={description} onChange={(e) => {setDescription(e.target.value)}}/>
        <br />
        <label className={styles.labels}>Associated Club: </label>
        <input value={club} onChange={(e) => {setClub(e.target.value)}}/>
        <br />
        <label className={styles.labels}>Location: </label>
        <input value={location} onChange={(e) => {setLocation(e.target.value)}}/>
        <br />
        {dateTime &&
          <Fragment>
            <label className={styles.labels}>Date: </label>
            <input type='date' value={dateTime} onChange={(e) => {setDateTime(e.target.value)}}/>
          </Fragment>
        }
        {!dateTime &&
          <Fragment>
            <label className={styles.labels}>Start Date: </label>
            <input type='date' value={startDateTime} onChange={(e) => {setStartDateTime(e.target.value)}}/>
            <label className={styles.labels}>End Date: </label>
            <input type='date' min={startDateTime} value={endDateTime} onChange={(e) => {setEndDateTime(e.target.value)}}/>
          </Fragment>
        }
        
        <div className={styles.buttons}>
          <button type="submit">Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
        
      </form>
    </Fragment>
    }
    </div>
  )
}

export default Event