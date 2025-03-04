import React, { useState } from 'react'
import Back from '../Back/Back'
import { BsFillCameraFill } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import './FifthPage.css'
import axios from 'axios';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Modal from '../Modal/Modal'

const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_KEY,
  },
});

const Fifth = () => {
  const [indvid, setindvid] = useState("");
  const [indvdata, setindvdata] = useState({});
  const [file, setFile] = useState(null); // Store selected file
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Store file but do NOT upload yet
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setModalMessage("No file selected");
      setShowModal(true);
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async () => {
        const params = {
          Bucket: 'luxy.smile',
          Key: file.name,
          Body: reader.result,
          ContentType: file.type,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        setModalMessage("Image uploaded successfully!");
        setShowModal(true);
        setFile(null); // Reset file input
      };

      reader.onerror = () => {
        setModalMessage("File reading failed");
        setShowModal(true);
      };
    } catch (error) {
      setModalMessage("Upload failed: " + error.message);
      setShowModal(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`${import.meta.env.VITE_BASE_URL}/get-individual-details`, { params: { indvid } })
      .then(response => {
        setindvdata(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    setindvid('');
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const navigate = useNavigate();

  return (
    <div className='relative h-screen w-full flex flex-col justify-center items-center gap-[3vh]'>
      <Back />

      <form onSubmit={handleSubmit} className='flex flex-col justify-center w-fit items-center gap-[2vh]'>
        <p className='text-white'>Enter Individual ID:</p>
        <input
          type="text"
          value={indvid}
          onChange={(e) => setindvid(e.target.value)}
          className='rounded-md bg-blue-600 text-white'
          placeholder='  Enter Individual ID'
        />
        <button className='p-[.2vh] rounded-md bg-white w-full'>Go</button>
      </form>

      <div className='w-full flex flex-col justify-center items-center gap-[1vw]'>
        <p className='text-white'>Details</p>
        <div className='w-[40%] h-[1px] bg-zinc-300'></div>
      </div>

      <div className='flex flex-col bothdiv gap-[1vw] text-white justify-center items-center w-[40%]'>
        <div className='bg-blue-800 innerdiv rounded-md flex flex-col gap-[1vh] w-[55%] py-[4vh] pl-[1.5vw]'>
          <div className='flex justify-between items-center w-full'>
            <p>Name - {indvdata.name}</p>
          </div>

          <div className='flex justify-between items-center w-full'>
            <p>Orgname - {indvdata.orgname}</p>
          </div>

          <div className='flex justify-between items-center w-full'>
            <p>Department - {indvdata.department}</p>
           
          </div>
        </div>

        <div className='w-[35%] h-[1px] bg-zinc-300 my-[2vh]'></div>

        <form className='bg-blue-800 innerdiv rounded-md flex flex-col justify-center items-center gap-[3vh] w-[55%] py-[2vh]'>
          <div className='flex flex-col justify-center items-center gap-[1vw]'>
            <p>Upload Image</p>
            <div className='flex justify-center items-center gap-[1vh]'>
              <BsFillCameraFill className='icons' size={25} />
              <div className='h-[2.3vw] w-[1px] bg-zinc-300'></div>
              <GrGallery className='icons' size={25} />
              <input
                type="file"
                className='imginput w-[11vw] text-xs'
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={uploadFile} // Upload on button click
            className='p-[.2vh] px-[1vh] uploadimgbutton rounded-full bg-white text-black'
          >
            Upload Img
          </button>
        </form>
      </div>

      <div className='w-[40%] h-[1px] bg-zinc-300'></div>
      <Modal 
        isOpen={showModal}
        onClose={handleModalClose}
        message={modalMessage}
      />
    </div>
  );
};

export default Fifth;
