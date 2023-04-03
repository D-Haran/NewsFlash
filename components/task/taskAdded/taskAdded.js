import React, { Fragment, useEffect, useState } from 'react'
import styles from './taskAdded.module.css'

const TaskAdded = (props) => {
    const notes = props.note;
    const noteAdded = props.notesAdded;
    const setNotes = props.setNote
    const completeNote = props.completeNotes
    const numbered = props.number
    const setCompleteNote = props.setCompleteNotes
    const setNoteAdded = props.setNotesAdded
    const viewing =props.view

    const [individualNoteAdded, setIndividualNoteAdded] = useState(noteAdded)
    const [editting, setEditting] = useState(false)
    const [title, setTitle] = useState(noteAdded.title)
    const [description, setDescription] = useState(noteAdded.description)

    const deleteTask = (id) => {
        const newList = completeNote.filter((item) => item.id !== id);
        setNotes(newList);
    }

    const handleEdit = (e) => {
        completeNote[numbered].title = title
        completeNote[numbered].description = description
        setEditting(false)
    }

    useEffect(() => {
    }, [completeNote, numbered])
    
  return (
    <div className={styles.container}>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        {viewing &&
            <Fragment>
                <div onClick={() => {deleteTask(individualNoteAdded.id)}} className={styles.exit}>
                    <p className={styles.ps}>X</p>
                </div>
                <div className={styles.edit}>
                    <div onClick={setEditting} className={"fa fa-edit"}>
                </div>
                </div>
            </Fragment>
        
        }
        
        {!editting &&
            <Fragment>
                <h6 className={styles.hsix}>{noteAdded.club.label}</h6>
                <p className={styles.ps}><b>{noteAdded.title}</b></p>
                <br />
                <p className={styles.ps}>{noteAdded.description}</p>
            </Fragment> 
        }
        {editting &&
            <Fragment>
                <label className={styles.labels}>Club:</label>
                <h6 className={styles.hsix}>{noteAdded.club.label}</h6>
                <br />
                <label className={styles.labels}>Title:</label>
                <input defaultValue={noteAdded.title} className={styles.inputs} onChange={(e) => {setTitle(e.target.value)}} />
                <br />
                <label className={styles.labels}>Description:</label>
                <br />
                <textarea onChange={(e) => {setDescription(e.target.value)}} className={styles.inputs} defaultValue={notes.description}/>
                <br />
                <div classNames={styles.buttons}>
                    <button onClick={(e) => {e.preventDefault(); setEditting(false)}}>Cancel</button>
                    <button className={styles.buttons} onClick={handleEdit}>Update</button>
                </div>
            </Fragment> 
        }
        
    </div>
  )
}

export default TaskAdded