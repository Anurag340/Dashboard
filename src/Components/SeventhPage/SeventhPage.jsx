import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Back from '../Back/Back'
import { CiSearch } from "react-icons/ci";
import { CiExport } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";
import ExportList from './ExportList';
import Papa from 'papaparse';

const orgid = localStorage.getItem('orgid');
const SeventhPage = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/get-records` , {params :{orgid}} );
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record => {
    const searchFields = [
      record.user?.indvid?.toString() || '',
      record.user?.name?.toLowerCase() || '',
      record.user?.department?.toLowerCase() || '',
      record.user?.orgname?.toLowerCase() || ''
    ];

    return searchFields.some(field => 
      field.includes(searchTerm.toLowerCase())
    );
  });

  const handleExportCSV = () => {
    const csvData = records.map(record => ({
      ID: record.user?.indvid || '',
      Name: record.user?.name || '',
      Department: record.user?.department || '',
      Organization: record.user?.orgname || '',
      PDF_Status: record.pdfname ? 'Uploaded' : 'Not Uploaded'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'records.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='h-screen w-full flex flex-col justify-center items-center gap-[1vw] relative ' >
        <Back/>
        <div className='h-[80%] w-[80%] flex flex-col justify-around gap-[1vw] '>
            <div className='w-full flex justify-between ' >
                <div className='text-white flex gap-[2vh] justify-center items-center' >
                    <CiSearch size={25} />
                    <input 
                      type="text" 
                      placeholder='  Search...' 
                      className='bg-zinc-300 rounded-lg px-2'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MdFilterList size={25} />
                </div>

                <button 
                  onClick={handleExportCSV}
                  className='flex justify-center items-center gap-[.5vh] h-[2vw] rounded-full px-[1vh] bg-white text-black ' 
                >
                  Export CSV <CiExport/> 
                </button>

            </div>

            <div className='flex flex-col w-full gap-[2vw]'>
                    <div className='flex justify-around items-center text-white font-light' >
                        <p>ID</p>
                        <p>Name</p>
                        <p>Department</p>
                        <p>Organisation</p>
                        <p>Status</p>
                    </div>
                    <div className='h-[1px] w-full bg-zinc-300 ' ></div>

            </div>

            <div className='w-full flex flex-col gap-[2vh] overflow-auto h-[25vw] ' >
                {filteredRecords.map((record, index) => (
                    <ExportList key={index} data={record} />
                ))}
            </div>

            <div className='w-full h-[1px] bg-zinc-300 '></div>

            <div className='w-full justify-around items-center text-white  font-light flex '>
                <div className='flex justify-center items-center gap-[1vh]' >
                    <p>PDF Not Uploaded</p>
                    <div className='h-[.8vh] w-[1.5vw] bg-red-500 rounded-full '></div>
                </div>
                <div className='flex justify-center items-center gap-[1vh]'>
                    <p>PDF Uploaded</p>
                    <div className='h-[.8vh] w-[1.5vw] bg-green-500 rounded-full '></div>
                </div>
            </div>

        </div>



    </div>
  )
}

export default SeventhPage