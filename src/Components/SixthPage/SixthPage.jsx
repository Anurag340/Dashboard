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
    axios.get(`${import.meta.env.VITE_BASE_URL}/get-img`, { params: { indvid } })
      .then(response => {
        const imgUrl = `https://luxy.smile.s3.ap-south-1.amazonaws.com/registrations/${response.data.imgname}`;
        console.log(imgUrl);
        setIndvdata({ imgUrl });
      })
      .catch(error => {
        setModalMessage("Error fetching image");
        setShowModal(true);
        console.error(error);
      });
  };

  const handleDownload = async () => {
    if (indvdata.imgUrl) {
      try {
        const response = await fetch(indvdata.imgUrl, { method: 'GET' });
        if (!response.ok) {
          throw new Error("Failed to fetch the file");
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'individual_image.jpg'); // Set the file name
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Clean up the URL object
      } catch (error) {
        setModalMessage("Failed to download image");
        setShowModal(true);
      }
    } else {
      setModalMessage("No image available to download");
      setShowModal(true);
    }
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
          {indvdata.imgUrl ? (
            <>
              <img src={indvdata.imgUrl} alt="Individual" className='w-80 h-48 object-cover rounded-md' />
              <button 
                onClick={handleDownload} 
                className='mt-2 inline-block text-blue-400 underline'
              >
                Download Image
              </button>
            </>
          ) : (
            <p>No image available</p>
          )}
        </div>
      </div>

      <div className='flex flex-col justify-center items-center gap-[2vw]'>
        <p className='text-white font-light text-lg'>You can upload your PDF file below :</p>
        <div className='flex flex-col w-full justify-center items-center gap-[1vw]'>
          <input 
            type="file" 
            className='text-white ml-14 font-light rounded-md'
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
        className='p-[.2vh] px-[1vh] h-8 bg-white text-zinc-800 text rounded-full flex justify-center items-center '
      >
        Show all records
        <MdArrowRightAlt size={25} />
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