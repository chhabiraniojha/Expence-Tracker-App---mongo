import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/userContext';
import { Link } from 'react-router-dom'


function Signin() {

  const { user, setUser, Login } = useLogin();

  // console.log(Login)
  const Navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState(null);

  const handleSubmit = (e) => {

    e.preventDefault();
    const userDetails = { email: email, password: password }
    setErrMessage(null)
    axios.post(`${import.meta.env.VITE_BASE_URL}/users/signin`, userDetails)
      .then(res => {
        console.log(res)
        if (res.status == 200) {
          localStorage.setItem("token", res.data.token)
          alert("logged in successfully")

          Navigate('/expences')

          setUser(res.data.data)
          Login();

        }
      })
      .catch(err => {
        if (err.response.status == 401) {
          setErrMessage(err.response.data)

        } else {
          setErrMessage(err.response.data)
        }
      })


  }


  return (
    <div className='max-h-full bg-blue-300'>
      <div className='h-screen flex flex-col items-center justify-center'>
        <div className='  rounded-md p-8  shadow-xl'>
          {errMessage != null && <p className='text-red-600 text-xl'> error : {errMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className=''>


              <h1 className='font-bold font-serif text-center text-3xl'>Expence Tracker</h1>
            </div>

            <div className='text-2xl m-4'>
              <label htmlFor='email'>Enter Your Email:</label><br></br>
              <input onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Enter Your Email' id='email' value={email} className='rounded-md' required />
            </div>
            <div className='text-2xl m-4'>
              <label htmlFor='password'>Enter Your Password:</label><br></br>
              <input onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Enter Your Password' id='password'
                value={password} className='rounded-md' required />
            </div>
            <div className='text-2xl text-center'>
              <button type="submit" className=' bg-sky-800 p-1 px-5 rounded-lg text-white '>Sign In</button>
            </div>
          </form>

        </div>
        <div className='p-2 m-2'>
          <Link to='/forgotpassword'>
            <h1 className='text-blue-800'>Forgotten Password?</h1>
          </Link>
        </div>
        <div>-------or-------</div>
        <div>
          <Link to='/signup'>
            <button className='p-2 m-2 rounded-md font-medium border-1 border-solid bg-slate-400'>Create Account</button>
          </Link>
        </div>


      </div>
      <div></div>
    </div>
  )
}

export default Signin;
