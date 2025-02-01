import React, { useEffect, useState } from 'react'
import { useLogin } from '../context/userContext';
import DataTable from 'react-data-table-component'

function LeaderBoard() {
  const { user } = useLogin();
  const [leaderBoard, setLeaderBoard] = useState([])
  const columns = [

    {
      name: <div className='w-full text-lg '>Name</div>,
      cell: row => <div className='text-lg'>{row.name}</div>,
      width: '20%',
      maxWidth: 'auto',
    },
    {
      name: <div className='w-full text-lg'>Total Expence</div>,
      selector: row => <div className='text-lg'>{row.totalExpence?row.totalExpence:0}</div>
    }

  ];
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get(`${import.meta.env.VITE_BASE_URL}/leaderboard`, { headers: { Authorization: token } })
      .then(res => {
        if (res.status == 200) {
          setLeaderBoard(res.data.data)
        }
      })
  })
  console.log(leaderBoard)
  return (
    <div>
      {user.isPremium ?
        <div>
          <div>
            <DataTable
              title="Your Expence Lists"
              columns={columns}
              data={leaderBoard}
              fixedHeader
              fixedHeaderScrollHeight="400px"

              pagination
            />
          </div>

        </div> :
        <div className='text-4xl font-bold text-slate-700 h-screen flex flex-col items-center justify-center'>this is a premium feature please take premium</div>
      }

    </div>
  )
}

export default LeaderBoard
