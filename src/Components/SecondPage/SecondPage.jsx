import React, { useEffect, useState } from 'react';
import Back from '../Back/Back';
import { GoArrowRight } from "react-icons/go";
import TeamList from '../TeamList/TeamList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SecondPage = () => {
  const navigate = useNavigate();
  const [unitno, setunitno] = useState('');
  const [department, setDepartment] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const orgid = localStorage.getItem('orgid');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      console.log(orgid)
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/get-teams`, { params: { orgid } });
      console.log(response.data);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleCheckboxChange = (team) => {
    setSelectedTeam(selectedTeam?.id === team.id ? null : team);
  };

  const handleProceed =() => {
    if (!selectedTeam) {
      alert("Please select a team.");
      return;
    }

    console.log(selectedTeam);
    const { unitno, department, orgid } = selectedTeam;
    
      axios.post(`${import.meta.env.VITE_BASE_URL}/register-team`, {unitno, department, orgid});
      alert("Team successfully registered!");
      navigate('/individual-register');
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!unitno || !department) {
      alert("Both fields are required to add a team.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/add-team`, { unitno, department,orgid });
      alert("Team added successfully.");
      setunitno('');
      setDepartment('');
      fetchTeams(); // Refresh team list
    } catch (error) {
      alert("Error adding team.");
      console.error(error);
    }
  };

  return (
    <div className='h-screen w-full relative'>
      <Back />
      <div className='flex justify-center items-center h-full w-full'>
        <div className='herodiv h-[80%] w-[50%] flex flex-col justify-around'>
          <p className='herotext text-6xl px-[5vw] text-white'>Hello Org.name, Thanks for Choosing Oralens</p>
          <div className='proceed flex flex-col gap-[2vh] px-[5vw]'>
            <p className='proceedtext text-lg text-white'>To move ahead please complete the team selection process.</p>
            <button onClick={handleProceed} className='flex justify-center gap-[1vh] items-center w-fit bg-white px-[2vh] rounded-full'>
              Proceed <GoArrowRight />
            </button>
          </div>
          <div className='bulk flex text-white px-[5vw]'>
            <p className='bulktext'>To bulk import via CSV: </p>
            <button onClick={() => navigate('/bulk-import')} className='bg-white w-fit px-[1vh] mx-[1vh] rounded-xl text-black'>Click here</button>
          </div>
        </div>

        <div className='bar bg-white h-[80%] w-[1px]'></div>

        <div className='seconddiv h-[80%] w-[50%] flex justify-center items-center'>
          <div className='h-full w-[70%] bg-blue-900 rounded-xl py-[3vw] flex flex-col justify-around items-center'>

            {/* Add Team Form */}
            <form onSubmit={handleAddTeam} className='w-[80%] bg-blue-800 py-[2vw] rounded-xl flex flex-col gap-[2vh] justify-center items-center text-white'>
              <label>
                <p>Unit No :</p>
                <input 
                  placeholder='  Enter unit no' 
                  className='inputs bg-zinc-200 text-black rounded-md mt-[.5vh]' 
                  type="text" 
                  value={unitno} 
                  onChange={(e) => setunitno(e.target.value)} 
                />
              </label>

              <label>
                <p>Department :</p>
                <input 
                  type="text" 
                  placeholder='  Enter department' 
                  className='inputs bg-zinc-200 text-black rounded-md mt-[.5vh]' 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                />
              </label>

              <button type="submit" className='w-fit px-[2vh] bg-blue-600 rounded-lg'>Add</button>
            </form>

            {/* Team Selection List */}
            <div className='w-full flex flex-col gap-[2vh] items-center justify-center text-white'>
              <p>Select Team</p>
              <div className='w-[80%] h-[1px] bg-zinc-400'></div>

              <div className='h-[20vh] w-[80%] flex flex-col overflow-auto gap-[2vh]'>
                {teams.length > 0 ? (
                  teams.map((item, index) => (
                    <TeamList key={index} item={item} selectedTeam={selectedTeam} handleCheckboxChange={handleCheckboxChange} />
                  ))
                ) : (
                  <p>No teams available. Add a new team.</p>
                )}
              </div>

              <div className='w-[80%] h-[1px] bg-zinc-400'></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondPage;
