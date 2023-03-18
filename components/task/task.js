import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import styles from './task.module.css'

const Task = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const options = [
        { value: 'createNew', label: 'Create a new club...' },
      ];
    useEffect(() => {
        console.log(selectedOption)
    }, [selectedOption])
  return (
    <div>
        <form className={styles.main}>
        <h2>Create an Announcement</h2>
        <label>Announcement</label>
        <input />
        <label>Associated Club</label>
        <Select
        className={styles.selectMenu}
        isSearchable
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
    />
    </form>
  </div>
  )
}

export default Task