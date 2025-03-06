import React from 'react'

const ExportList = ({ data }) => {
  const getStatusColor = (pdfFileName) => {
    return pdfFileName ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className='w-full bg-blue-800 min-h-[6vh] rounded flex justify-around items-center text-white py-2'>
      <p>{data.user?.indvid || 'N/A'}</p>
      <p>{data.user?.name || 'N/A'}</p>
      <p>{data.user?.department || 'N/A'}</p>
      <p>{data.user?.orgname || 'N/A'}</p>
      <div className={`h-[.8vh] w-[1.5vw] ${getStatusColor(data?.pdfname)} rounded-full`}></div>
    </div>
  )
}

export default ExportList