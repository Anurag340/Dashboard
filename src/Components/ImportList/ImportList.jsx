import React from 'react'
import './ImportList.css'

const ImportList = ({ data }) => {
    if (!data) return null;
    
    return (
        <div className='w-full grid grid-cols-4 gap-4 text-white py-3 px-4 bg-blue-800 rounded-md'>
            <div className='text-center'>{data.unitno}</div>
            <div className='text-center'>{data.department}</div>
            <div className='text-center'>{data.orgname}</div>
            <div className='text-center'>{data.name}</div>
        </div>
    )
}

export default ImportList