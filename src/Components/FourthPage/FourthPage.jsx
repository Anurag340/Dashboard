import React, { useState } from 'react'
import { CiImport } from "react-icons/ci";
import ImportList from '../ImportList/ImportList';
import Back from '../Back/Back';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import './FourthPage.css'
import Modal from '../Modal/Modal'
import axios from 'axios';

const FourthPage = () => {
    const navigate = useNavigate();
    const [csvData, setCsvData] = useState([]);
    const [file, setFile] = useState(null);
    const orgid = localStorage.getItem('orgid');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImport = () => {
        if (!file) {
            setModalMessage('Please select a file first');
            setShowModal(true);
            return;
        }

        Papa.parse(file, {
            complete: (results) => {
                setCsvData(results.data);
                setModalMessage(`Successfully imported ${results.data.length} records`);
                setShowModal(true);
            },
            header: true,
            skipEmptyLines: true
        });
    };

    const handleRegister = async () => {
        if (csvData.length === 0) {
            setModalMessage('Please import data first');
            setShowModal(true);
            return;
        }

        try {
            const users = csvData.map(record => ({
                ...record,
                orgid: orgid,
                indvid: Math.floor(1000 + Math.random() * 9000)
            }));

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/bulk-register`, users);
            if (response.status === 200) {
                setModalMessage('Records registered successfully');
                setShowModal(true);
            }
        } catch (error) {
            setModalMessage('Error registering records: ' + error.message);
            setShowModal(true);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className='totaldiv h-screen w-full relative py-[3vw] flex flex-col justify-around items-center'>
            <Back/>
            <div className='buttonelem flex flex-col gap-[2vw] justify-center items-center'>
                <div className='importdiv flex gap-[1vw] text-white justify-center items-center'>
                    <p>Choose your file : </p>
                    <input 
                        className='importfile text-xs w-fit h-fit' 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </div>
                <button 
                    onClick={handleImport}
                    className='w-[6vw] importbutton rounded-lg bg-white text-black flex justify-center items-center gap-[1vh]'
                >
                    Import<CiImport/>
                </button>
            </div>

            <div className='w-full flex flex-col gap-[2vh] justify-center items-center'>
                <div className='heading w-[40%] grid grid-cols-4 gap-4 text-white font-semibold px-4'>
                    <div className='text-center'>Unit no.</div>
                    <div className='text-center'>Department</div>
                    <div className='text-center'>Organisation</div>
                    <div className='text-center'>Name</div>
                </div>
                <div className='bg-zinc-300 barr w-[50%] h-[1px]'></div>
                <div className='importylist w-[40%] max-h-[20vw] overflow-auto flex flex-col items-center gap-[1vh]'>
                    {csvData.map((record, index) => (
                        <ImportList key={index} data={record} />
                    ))}
                </div>
                <div className='bg-zinc-300 barr w-[50%] h-[1px]'></div>
            </div>

            <div className='lowerbuttondiv flex gap-[2vh] justify-center items-center'>
                <button 
                    onClick={handleRegister} 
                    className='w-[6vw] registerbutton bg-blue-600 rounded-md text-white'
                >
                    Register
                </button>
                <button 
                    onClick={() => {navigate('/img-upload')}} 
                    className='w-[6vw] proceedbutton bg-white flex justify-center items-center rounded-md'
                >
                    Proceed
                </button>
            </div>
            <Modal 
                isOpen={showModal}
                onClose={handleModalClose}
                message={modalMessage}
            />
        </div>
    )
}

export default FourthPage