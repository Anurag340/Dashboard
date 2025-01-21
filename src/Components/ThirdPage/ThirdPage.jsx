import React, { useState } from 'react'
import Back from '../Back/Back'
import { useNavigate } from 'react-router-dom'
import './ThirdPage.css'

const ThirdPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [userdata, setuserData] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        setuserData({
            name: name,
            gender: gender,
            age: age,
            bloodGroup: bloodGroup
        });
        setName('');
        setGender('');
        setAge('');
        setBloodGroup('');
        console.log(userdata);
        navigate('/individual-register');
    }

    return (
        <div className='h-screen w-full relative flex justify-center items-center ' >
            <Back />
            <div className='maindiv h-[80%] w-[50%] flex flex-col justify-center items-center ' >
                <div className='h-[1px] w-[60%] bg-zinc-300 lining '></div>
                <form onSubmit={(e) => handleSubmit(e)} className='formidiv w-[60%] flex flex-col gap-[3vh] pl-[7vw] py-[3vw] justify-center text-white ' action="">

                    <label>
                        <span>Name : </span><input onChange={(e) => setName(e.target.value)} value={name} className='text-black ml-[1vw] rounded-md' placeholder=' Enter Name' type="text" />
                    </label>

                    <label>
                        <span>Gender : </span>
                        <select onChange={(e) => setGender(e.target.value)} value={gender} className='text-black rounded-md ml-[0.4vw] ' name="" id="">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                    </label>

                    <label>
                        <span>Age : </span><input onChange={(e) => setAge(e.target.value)} value={age} className='w-[3vw] ageinput text-black rounded-md ml-[2vw] ' type="number" placeholder='  Age' />
                    </label>

                    <label>
                        <span>Bld Gr : </span>
                        <select onChange={(e) => setBloodGroup(e.target.value)} value={bloodGroup} className=' text-black bldinput rounded-md ml-[0.9vw] w-[3vw] ' name="" id="">
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
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

        </div>
    )
}

export default ThirdPage