import React, { useEffect, useState } from 'react'
import JsFileDownloader from 'js-file-downloader';
import { useLogin } from '../context/userContext';

function History() {
  const [downloadHistory, setDownlosdHistory] = useState([]);
  const { user, setUser, Logout } = useLogin();
  console.log(user)
  const getDownloadHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/expence/downloadedreports`, { headers: { Authorization: token } })
      setDownlosdHistory(response.data.response)
    } catch (error) {
      console.log(error)
      setDownlosdHistory([])
    }
  }
  useEffect(() => {
    getDownloadHistory()
  }, [setUser, Logout])
  const handleDownload = (url) => {
    console.log(url)
    new JsFileDownloader({
      url: url
    })
      .then(function () {
        alert('download successfully')
        // Called when download ended
      })
      .catch(function (error) {
        alert(error)
        // Called when an error occurred
      });
  }
  return (
    <div>
      {!user.isPremium ?
        <div className='text-4xl font-bold text-slate-700 h-screen flex flex-col items-center justify-center'>this is a premium feature please take premium</div>
        :


        <div>
          {
            downloadHistory.length > 0 ?
              <div>
                {downloadHistory.map((history) => {
                  return (
                    <div className='flex flex-row flex-wrap p-1 m-1' key={history.id}>
                      <div className='flex-none w-52 '>{new Date(history.createdAt).toDateString()}</div>
                      <div className='flex-none max-w-2xl '><p>{history.expenceUrl}</p></div>
                      <div className='ml-2'><button onClick={() => { handleDownload(history.expenceUrl) }} className='bg-red-700 rounded-md text-center text-white px-1'>download</button></div>

                    </div>
                  )
                })}
              </div> :
              <div className='text-4xl font-bold text-slate-700 h-screen flex flex-col items-center justify-center'>You have no download history</div>
          }
        </div>
      }


    </div>
  )
}

export default History;
