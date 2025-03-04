import React from 'react'
import { GrGroup } from "react-icons/gr";

const TeamList = ({ item, selectedTeam, handleCheckboxChange }) => {
  return (
    <div className='w-full h-[5vh] min-h-[5vh] text-zinc-200 flex justify-between items-center'>
        <div className='h-full w-[90%] bg-blue-600 flex justify-around items-center rounded-md'>
            <GrGroup />
            <p>Department - {item.department}</p>
            <p>Unit - {item.unitno}</p>
        </div>
        <input 
          type="checkbox" 
          checked={selectedTeam?.id === item.id} 
          onChange={() => handleCheckboxChange(item)}
        />
    </div>
  )
}

export default TeamList;
