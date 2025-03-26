import React, { useState } from 'react'
import Back from '../Back/Back'
import { useNavigate } from 'react-router-dom'
import './ThirdPage.css'
import axios from 'axios'
import Modal from '../Modal/Modal'

const ThirdPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateContactNo = (contactNo) => {
        const contactRegex = /^[0-9]{10}$/;
        return contactRegex.test(contactNo);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setModalMessage('Invalid email address');
            setShowModal(true);
            return;
        }
        if (!validateContactNo(contactNo)) {
            setModalMessage('Invalid contact number');
            setShowModal(true);
            return;
        }
        const orgid = localStorage.getItem('orgid');

        const userData = {
            name: name,
            gender: gender,
            age: age,
            email: email,
            contactno: contactNo,
            orgid: orgid
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/individual-register`, userData);

            if(response.status === 200 || response.status === "OK") {
                setModalMessage(`Data submitted successfully : Indvid : ${response.data.indvid}`);
                setShowModal(true);
            } else {
                setModalMessage('Failed to submit data');
                setShowModal(true);
            }

            setName('');
            setGender('');
            setAge('');
            setEmail('');
            setContactNo('');
        } catch (error) {
            setModalMessage('Error submitting data');
            setShowModal(true);
        }
    }

    const handleModalClose = () => {
        setShowModal(false);
        if (modalMessage.includes("successfully")) {
        }
    };

    return (
        <div className='h-screen w-full relative flex justify-center items-center'>
            <Back />
            <div className='maindiv h-[80%] w-[50%] flex flex-col justify-center items-center ' >
                <div className='h-[1px] w-[60%] bg-zinc-300 lining '></div>
                <form onSubmit={(e) => handleSubmit(e)} className='formidiv w-[60%] flex flex-col gap-[3vh] pl-[7vw] py-[3vw] justify-center text-white ' action="">

                    <label>
                        <span>Name : </span><input onChange={(e) => setName(e.target.value)} value={name} className='text-black ml-[1vw] rounded-md' placeholder=' Enter Name' type="text" required />
                    </label>

                    <label>
                        <span>Gender : </span>
                        <select onChange={(e) => setGender(e.target.value)} value={gender} className='text-black rounded-md ml-[0.4vw] ' name="" id="" required>
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                    </label>

                    <label>
                        <span>Age : </span><input onChange={(e) => setAge(e.target.value)} value={age} className='w-[20%] ageinput text-black rounded-md ml-[2vw] ' type="number" placeholder='  Age' required />
                    </label>

                    <label>
                        <span>Email : </span><input onChange={(e) => setEmail(e.target.value)} value={email} className='text-black ml-[1vw] rounded-md' placeholder=' Enter Email' type="email" required />
                    </label>

                    <label>
                        <span>Contact : </span><input onChange={(e) => setContactNo(e.target.value)} value={contactNo} className='text-black ml-[1vw] rounded-md' placeholder=' Enter Contact No' type="text" required />
                    </label>

                    <button className='bg-white w-[5vw] registerbutton rounded-full text-black '>Register</button>

                </form>

                <div className='h-[1px] w-[60%] bg-zinc-300 lining '></div>

            </div>

            <div className='h-[80%] w-[1px] bg-white bar '></div>

            <div className='sideediv h-[80%] w-[50%] flex flex-col justify-around items-center  text-white '>

                <div className='w-full herotext flex flex-col gap-[2vh] justify-center items-center'>
                    <p className='  text-6xl'>Thanks for registering</p>
                    <p className=' text-6xl' >with us</p>
                </div>

                <div className='flex clickhere justify-center items-center gap-[2vh]'>
                    <p>To proceed with individual details : </p>
                    <button onClick={() => { navigate('/img-upload') }} className='bg-white clickherebutton text-black px-[1vh] rounded-full' href="">Click here</button>
                </div>

            </div>
            <Modal 
                isOpen={showModal}
                onClose={handleModalClose}
                message={modalMessage}
            />
        </div>
    )
}

export default ThirdPage