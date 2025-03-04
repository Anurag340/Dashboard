import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FirstPage.css'
import axios from 'axios'

const FirstPage = () => {
    const navigate = useNavigate();
    const [login,setlogin] = useState('');
    const [orgname,setorgname] = useState('');
    const [orgloc,setorgloc] = useState('');

    const handlelogin = async(e) => {
        e.preventDefault();
        try {
           const orgid = login;
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/org-login`, { params: { orgid } });
            if (response.status === 200 || response.status == "OK") {
                localStorage.setItem('orgid', response.data.orgid);
                setlogin(0);
                alert("Successfully logged in");
                navigate('/login');
            }
            else{
                alert("Invalid credentials");
                navigate('/');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const handleregister = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/org-register`, { orgname, orgloc });
            if (response.status === 200) {
                const orgid = response.data.orgid;
                localStorage.setItem('orgid', orgid);
                alert(`Successfully registered : Orgid - ${orgid} `);
                setorgname('');
                setorgloc('');
                navigate('/login');
            } else {
                alert("Registration failed");
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    }

  return (
    <div className='firstpage h-screen w-full flex flex-col relative '>
        <p className=' brand absolute text-white text-lg left-[3vw] top-[3vw] '>Oralens</p>
        <div className='h-full w-full flex justify-center items-center'>
            <div className=' herotext w-[50%] h-full flex flex-col justify-center items-start pl-[8vw] gap-[1vh]' >
                <p className='text-8xl text-white font-medium' >WE ARE</p>
                <p className='text-8xl text-white font-medium' >ORALENS</p>
            </div>

            <div className='bar h-[80%] w-[1px] bg-white ' ></div>

            <div className=' formdiv w-[50%] h-full flex justify-center items-center ' >
                <div className=' formy h-[80%] w-[70%] bg-blue-900 rounded-xl flex flex-col gap-[3vh]'>
                    <p className=' info text-center text-white text-lg pt-[6vh]' >Sign in / Register</p>
                    <div className='flex flex-col justify-center items-center gap-[3vh]' >

                        <form onSubmit={ (e)=>{handlelogin(e)}} className=' box flex flex-col justify-center items-center gap-[3vh] w-fit bg-blue-800 p-[4vh] rounded-md ' >
                            <label className='text-white  '>
                                <span>Org.ID : </span><input onChange={(e)=>{setlogin(e.target.value)}} value={login} className=' inputs text-black bg-zinc-300 rounded-md' placeholder='  Enter ID' type="number" />
                            </label>

                            <button className='bg-zinc-200 w-[8vh] rounded-full h-[3vh] ' >Sign in</button>
                        </form>

                    </div>
                    <p className='text-white text-center' >Or</p>

                    <p className='text-white text-center' >Register here</p>
                    <div className='flex flex-col justify-center items-center gap-[3vh]' >
                        <form onSubmit={(e)=>{handleregister(e)}} className=' box flex flex-col justify-center items-center gap-[3vh] w-fit bg-blue-800 p-[4vh] rounded-md ' >
                            <label className='text-white' >
                                <span>Org.Name : </span><input onChange={(e)=>{setorgname(e.target.value)}} value={orgname} className=' inputs text-black bg-zinc-300 rounded-md' placeholder='  Enter Org. Name' type="text" />
                            </label>
                            <label className='text-white'>
                                <span>Org.Locat. : </span><input onChange={(e)=>{setorgloc(e.target.value)}} value={orgloc} className=' inputs text-black bg-zinc-300 rounded-md' placeholder='  Enter Org. Location' type="text" />
                            </label>
                            <button className='bg-zinc-200 w-[9vh] h-[3vh] rounded-full' >Register</button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default FirstPage