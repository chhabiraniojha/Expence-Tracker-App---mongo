import { useCallback, useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './components/home/Home.jsx'
import Expences from './components/expences/Expences.jsx'
import Signin from './components/signin/Signin.jsx'
import Signup from './components/signup/Signup.jsx'
import { LoginProvider } from './components/context/userContext.js';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute.js';
import { Navigate } from 'react-router-dom';
import LeaderBoard from './components/leaderBoard/LeaderBoard.jsx'
import ForgottenPassword from './components/forgottenPassword/ForgottenPassword.jsx';
import PasswordReset from './components/passwordReset/PasswordReset.jsx';
import Test from './components/test/Test.jsx';
import History from './components/downloadHistory/History.jsx';





function App() {
 

  const [user, setUser] = useState({})


  const Login = useCallback(() => {
    setUser(prev => (
      { ...prev, isLoggedIn: !prev.isLoggedIn }
    ))
  }, [])

  const Logout = useCallback(() => {
    setUser(prev => (
      { ...prev, isLoggedIn: !prev.isLoggedIn,isPremium:false }
    ))
  }, [])



  useEffect(() => {

    console.log(user)
    const getData = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users`, { headers: { Authorization: token } })
        setUser(response.data.userDetails)
      } else {
        setUser({})
      }
    }
    getData()
  }, [setUser, Login, Logout]);

  return (
    <>
      <div>
        <LoginProvider value={{ user, setUser, Login, Logout }}>
          <Navbar />
          <Routes>
            <Route path="/" element={user.isLoggedIn ? <Expences /> : <Signin/>} />
            {/* <Route path="/contactus" element={<Home />} /> */}

            {/* // <ProtectedRoute user={user.isLoggedIn:}>
              //   <Expences />
              // </ProtectedRoute>} /> */}
            <Route path="/signin" element={!user.isLoggedIn ? <Signin /> : <Navigate to="/" />} />
            <Route path="/expences" element={user.isLoggedIn ? <Expences /> : <Signin/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/leaderboard" element={user.isLoggedIn?<LeaderBoard />:<Signin />} />
            <Route path="/forgotpassword" element={<ForgottenPassword />} />
            <Route path="/password/resetpassword/:id/:token" element={<PasswordReset />} />
            <Route path="/report" element={user.isLoggedIn?<Test/>:<Signin/>} />
            <Route path="/downloadhistory" element={user.isLoggedIn?<History/>:<Signin/>} />
            

          </Routes>
        </LoginProvider>
      </div>
    </>

  )

}

export default App


