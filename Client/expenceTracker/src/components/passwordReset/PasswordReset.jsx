import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function PasswordReset() {
    const [password,setPassword]=useState("");
    const [message,setMessage]=useState("");
    const { id, token } = useParams();
    const navigate = useNavigate();
    async function handleSubmit(e){
        e.preventDefault();
        
             try {
                const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/password/updatepassword/${id}/${token}`,{password})
                if(response.status==201){
                    setPassword("")
                    setMessage(response.data.message)
                    alert("pasword successfully changed")
                    navigate('/signin')
                    console.log(response)
                }
             } catch (error) {
                console.log(error)
             }
             
    }

    const validateUser = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/password/resetpassword/${id}/${token}`)
            if (response.status == 201) {
               null
            }
        } catch (error) {
            navigate('/forgotpassword')
        }

    }
    useEffect(() => {
        validateUser()
    }, [])
    return (
        <div className='max-h-full bg-blue-300'>
            <div className='h-screen flex flex-col items-center justify-center'>
            <h1 className='text-xl text-green-800 font-medium'>{message}</h1>
                <div className='  rounded-md p-8  shadow-xl'>
                    <form onSubmit={handleSubmit}>
                        <div className=''>
                            <h1 className='font-bold font-serif text-center text-3xl'>Enter Your New Password</h1>
                        </div>
                        <div className='text-2xl m-4'>
                            <label htmlFor='password'>Enter New Password:</label><br></br>
                            <input onChange={(e)=>{setPassword(e.target.value)}} type='password'
                            value={password} placeholder='Enter New Password' id='email' className='rounded-md' required />
                        </div>
                        <div className='text-2xl text-center'>
                            <button type="submit" className=' bg-sky-800 p-1 px-5 rounded-lg text-white '>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <div></div>
        </div>
    )
}

export default PasswordReset
