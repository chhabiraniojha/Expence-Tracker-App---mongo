import React, { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../context/userContext';
import JsFileDownloader from 'js-file-downloader';

function Navbar() {
  const { user, setUser, Logout } = useLogin()
  console.log(user.isPremium)
  const navigate = useNavigate();
  // console.log(user.isLoggedIn)


  const handlePurchase = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/purchase/premiummembership`, { headers: { Authorization: token } })
    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async (response) => {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/purchase/updatetransactionstatus`,
          {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            status: true
          }, { headers: { Authorization: token } })

        alert('you are a premium user')
        console.log(user)
        await setUser(prev => (
          { ...prev, isPremium: !user.isPremium }
        ))
        console.log(user)
      }
    }
    const rzp = new Razorpay(options)
    rzp.open()

    rzp.on('payment.failed', async (response) => {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/purchase/updatetransactionstatus`,
        {
          payment_id: response.error.metadata.payment_id,
          order_id: response.error.metadata.order_id,
          status: false
        }, { headers: { Authorization: token } })

      alert('payment failed')
    })

  }
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/expence/download`, { headers: { Authorization: token } })
      console.log(response.data.fileUrl.Location);
      const fileUrl = response.data.fileUrl.Location;

      new JsFileDownloader({
        url: fileUrl
      })
        .then(function () {
          alert('download successfully')
          // Called when download ended
        })
        .catch(function (error) {
          alert(error)
          // Called when an error occurred
        });
    } catch (error) {
      console.log(error)
    }

  }


  return (
    <div className=''>
      <div className=' bg-yellow-400 w-full h-14 justify-between flex px-4 md:px-8 pt-3'>
        <div className='font-bold text-md'>
          Expence Tracker
        </div>
        <div>
          <ul className='flex '>

            <li className='font-serif text-md text-blue-500 font-bold cursor-pointer px-1 hover:text-red-500 underline md:px-4'>
              <Link to='/'>
                Home
              </Link>
            </li>
            {/* <li className='font-serif text-md text-blue-500 font-bold cursor-pointer px-1 hover:text-red-500 underline md:px-4'>
              <Link to='/contactus'>
                Contact Us
              </Link>
            </li> */}
            <li className='font-serif text-md text-blue-500 font-bold cursor-pointer px-1 hover:text-red-500 underline md:px-4'>
              <Link to='/expences'>
                Expence
              </Link>
            </li>
            {user.isLoggedIn &&
              <li className='font-serif text-md text-blue-500 font-bold cursor-pointer px-1 hover:text-red-500 underline md:px-4'>
                <Link to='/leaderboard'>
                  LeaderBoard
                </Link>
              </li>
            }

            {user.isLoggedIn &&
              <li className='font-serif text-md text-blue-500 font-bold cursor-pointer px-1 hover:text-red-500 underline md:px-4'>
                <Link to='/report'>
                  Report
                </Link>
              </li>
            }
            {user.isLoggedIn &&
              <li className='font-serif text-md text-blue-500 font-bold cursor-pointer px-1 hover:text-red-500 underline md:px-4'>
                <Link to='/downloadhistory'>
                  Download History
                </Link>
              </li>
            }
          </ul>
        </div>
        {user.isLoggedIn && <div className='text-violet-600 text-xl'>hello, {user.name} !</div>}

        <div>
          {!user.isLoggedIn ?
            <div>

              <button className='bg-blue-300 px-4 mx-2 py-1 rounded-md font-bold'>
                <Link to='/signin'>
                  Login
                </Link>

              </button>
            </div>
            :
            <div>

              <div className='flex flex-row'>

                {!user.isPremium ?
                  <button onClick={handlePurchase} className='bg-blue-300 px-4 mx-2 py-1 rounded-md font-bold'>
                    <Link to='#'>
                      Buy Premium
                    </Link>

                  </button> :
                  <div>
                    <button className='bg-blue-300 px-4 mx-2 py-1 rounded-md font-bold'>Premium User</button>
                    <button onClick={handleDownload} className='bg-blue-300 px-4 mx-2 py-1 rounded-md font-bold'>Download</button>
                  </div>

                }

                <button onClick={() => {
                  Logout()
                  localStorage.removeItem('token')
                  navigate('/')
                }} className='bg-blue-300 px-4 mx-2 py-1 rounded-md font-bold'>Logout</button>
              </div>

            </div>

          }
        </div>
      </div>
    </div>
  )
}

export default Navbar
