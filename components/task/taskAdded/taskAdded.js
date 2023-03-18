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
        console.log(newList)
        console.log(noteAdded)
    }

    const handleEdit = (e) => {
        e.preventDefault()
        setCompleteNote(noteAdded => ({...noteAdded, title: title}))
        setCompleteNote(noteAdded => ({...noteAdded, description: description}))
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
                    <p>X</p>
                </div>
                <div className={styles.edit}>
                    <div onClick={setEditting} className={"fa fa-edit"}>
                </div>
                </div>
            </Fragment>
        
        }
        
        {!editting &&
            <Fragment>
                <h6>{noteAdded.club.label}</h6>
                <p><b>{noteAdded.title}</b></p>
                <br />
                <p>{noteAdded.description}</p>
            </Fragment> 
        }
        {editting &&
            <Fragment>
                <label>Club:</label>
                <h6>{noteAdded.club.label}</h6>
                <br />
                <label>Title:</label>
                <input defaultValue={noteAdded.title} onChange={(e) => {setTitle(e.target.value)}} />
                <br />
                <label>Description:</label>
                <br />
                <textarea onChange={(e) => {setDescription(e.target.value)}} defaultValue={notes.description}/>
                <br />
                <div classNames={styles.buttons}>
                    <button onClick={(e) => {e.preventDefault()}}>Cancel</button>
                    <button>Update</button>
                </div>
            </Fragment> 
        }
        
    </div>
  )
}

export default TaskAdded