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

    // Fetch individual details first
    axios.get(`${import.meta.env.VITE_BASE_URL}/get-individual-details`, { params: { indvid } })
      .then(response => {
        const individualDetails = response.data; // Assuming the API returns individual details
        setIndvdata(prevData => ({ ...prevData, details: individualDetails }));
      })
      .catch(error => {
        setModalMessage("Error fetching individual details");
        setShowModal(true);
        console.error(error);
      })
      .finally(() => {
        // Fetch images after individual details
        axios.get(`${import.meta.env.VITE_BASE_URL}/get-img`, { params: { indvid } })
          .then(async (response) => {
            const imgData = response.data; // Assuming the API returns an array of objects
            if (Array.isArray(imgData) && imgData.length > 0) {
              const imgUrls = imgData
                .filter(item => item.imgname) // Ensure imgname exists
                .map(item => 
                  `https://s3.ap-south-1.amazonaws.com/luxy.smile/registrations/${item.imgname}`
                );
              setIndvdata(prevData => ({ ...prevData, imgUrls }));
            } else {
              setIndvdata(prevData => ({ ...prevData, imgUrls: [] })); // Set an empty array if no images are returned
            }
          })
          .catch(error => {
            setModalMessage("Error fetching images");
            setShowModal(true);
            console.error(error);
          });
      });
  };

  const handleDownload = async (imgUrl, fileName) => {
    try {
      const response = await fetch(imgUrl, { method: 'GET' });
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      setModalMessage("Failed to download image");
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
          {indvdata.details ? (
            <div className='mb-4'>
              <p><strong>Name:</strong> {indvdata.details.name || 'N/A'}</p>
              <p><strong>Department:</strong> {indvdata.details.department || 'N/A'}</p>
              <p><strong>Unit No:</strong> {indvdata.details.unitno || 'N/A'}</p>
              <p><strong>Organization:</strong> {indvdata.details.orgname || 'N/A'}</p>
            </div>
          ) : (
            <p>No individual details available</p>
          )}
          {Array.isArray(indvdata.imgUrls) && indvdata.imgUrls.length > 0 ? (
            <div className='grid grid-cols-3 gap-4'>
              {indvdata.imgUrls.map((imgUrl, index) => (
                <div key={index} className='flex flex-col items-center mb-4'>
                  <img src={imgUrl} alt={`Individual ${index + 1}`} className='w-72 h-48 object-cover rounded-md' />
                  <button 
                    onClick={() => handleDownload(imgUrl, `individual_image_${index + 1}.jpg`)} 
                    className='mt-2 inline-block text-blue-400 underline'
                  >
                    Download Image {index + 1}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No images available</p>
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