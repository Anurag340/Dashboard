import React, { useState } from 'react'
import { GoUpload } from "react-icons/go";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from 'buffer';
import Modal from '../Modal/Modal';
import axios from 'axios';
import { MdArrowRightAlt } from "react-icons/md";

window.Buffer = Buffer;

const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_KEY,
  },
});

const SixthPage = () => {
  const [file, setFile] = useState(null);
  const [indvid, setIndvid] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [indvdata, setIndvdata] = useState({});

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      setModalMessage("Please select a PDF file");
      setShowModal(true);
    }
  };

  const uploadFile = async () => {
    if (!file || !indvid) {
      setModalMessage("Please select a file and enter Individual ID");
      setShowModal(true);
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async () => {
        // Using the correct directory path and key format
        const fileName = file.name;
        const params = {
          Bucket: 'luxy.smile',
          Key: `diagnosis/${indvid}_${fileName}`, // Changed path to diagnosis/
          Body: reader.result,
          ContentType: 'application/pdf',
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Update database with the correct file name format
        await axios.post(`${import.meta.env.VITE_BASE_URL}/update-pdf`, {
          indvid,
          pdfname: `${indvid}_${fileName}` // Using original filename without prefix
        });

        setModalMessage("PDF uploaded successfully!");
        setShowModal(true);
        setFile(null);
        document.querySelector('input[type="file"]').value = '';
      };

      reader.onerror = () => {
        setModalMessage("File reading failed");
        setShowModal(true);
      };
    } catch (error) {
      setModalMessage("Upload failed: " + error.message);
      setShowModal(true);
    }
    setIndvid('');
    setIndvdata({});
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    axios.get(`${import.meta.env.VITE_BASE_URL}/get-individual-details`, { params: { indvid } })
      .then(response => {
        setIndvdata(response.data);
      })
      .catch(error => {
        setModalMessage("Error fetching individual details");
        setShowModal(true);
        console.error(error);
      });
  };

  return (
    <div className='h-screen w-full flex flex-col justify-around py-[8vw] items-center gap-[1vw]'>
      <div className='flex flex-col gap-[1vw] justify-center items-center'>
        <p className='text-white'>Enter Individual ID :</p>
        <form onSubmit={handlesubmit} className='flex w-fit gap-[2vh]'>
          <input 
            type="text" 
            className='rounded-md text-white bg-blue-600'
            placeholder='  Enter Individual ID'
            value={indvid}
            onChange={(e) => setIndvid(e.target.value)}
          />
          <button type="submit" className='p-1 px-2 text-white bg-blue-600 rounded'>Go</button>
        </form>
        <div className='text-white bg-blue-800 p-4 w-fit rounded-md'>
          <p>Name : {indvdata.name || 'N/A'}</p>
          <p>Orgname : {indvdata.orgname || 'N/A'}</p>
          <p>Department : {indvdata.department || 'N/A'}</p>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center gap-[2vw]'>
        <p className='text-white font-light text-lg'>You can upload your PDF file below :</p>
        <div className='flex justify-center items-center gap-[1vw]'>
          <input 
            type="file" 
            className='w-[6.5vw] font-light rounded-md'
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button 
            onClick={uploadFile}
            className='p-[.2vh] flex rounded-md justify-center items-center gap-[.5vh] px-[1vh] bg-white text-black'
          >
            Upload <GoUpload/>
          </button>
        </div>
      </div>

      <button 
        onClick={() => window.location.href = '/records'} 
        className='p-[.2vh] px-[1vh] bg-white text-zinc-800 text-sm rounded-full flex justify-center items-center '
      >
        Show all records
        <MdArrowRightAlt size={20} />
      </button>

      <Modal 
        isOpen={showModal}
        onClose={handleModalClose}
        message={modalMessage}
      />
    </div>
  )
}

export default SixthPage