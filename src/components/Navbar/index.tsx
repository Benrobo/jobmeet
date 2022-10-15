import React from 'react'
import { Button } from '../UI-COMP'

interface NavbarProps{
  toggleCreateSchedule?: ()=> void
}

function Navbar({toggleCreateSchedule}: NavbarProps) {
  return (
    <div className="w-full p-4 flex flex-row items-center justify-between ">
      <div className="left"></div>
      <div className="right flex flex-row items-end justify-end gap-2">
        <Button text='Schedule Appointment' type='primary' onClick={toggleCreateSchedule} />
      </div>
    </div>
  )
}

export default Navbar