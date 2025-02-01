import React, { useState, useEffect } from 'react'
import "./test.css"
import { useLogin } from '../context/userContext';
function Test() {
  const { user } = useLogin()
  const [expences, setExpences] = useState([]);
  // const [totelExpenceAmount, setTotalExpenceAmount] = useState(0)



  useEffect(() => {
    const token = localStorage.getItem("token")
    axios.get('/api/expence', { headers: { Authorization: token } })
      .then(res => setExpences(res.data))
  }, [setExpences])
  // console.log(expences)


  return (
    <>
    {user.isPremium?
    <div>
      <div className='expenses_container'>
        <h1 >Day to Day Expenses</h1>
        <h2> 2021</h2>
        <h3>March 2021</h3>
        <div className='first_table'>
          <table  >
            <tr>
              <th>Data</th>
              <th>Description</th>
              <th>Category</th>
              <th>Income</th>
              <th>Expense</th>
            </tr>
            {expences.map((expence) => {
              if (new Date(expence.createdAt).getMonth() == new Date().getMonth()) {
                return (
                  <tr key={expence.id}>
                    <td className='td'>{new Date(expence.createdAt).toDateString()}</td>
                    <td className='td'>{expence.expenceDescription}</td>
                    <td className='td'>{expence.expenceCategory}</td>
                    <td className='td'></td>
                    <td className='td'>{expence.expenceAmount}</td>
                  </tr>
                )
              }
            })}




            <tr>
              <td className='td'>Alfreds Futterkiste</td>
              <td className='td'>Maria Anders</td>
              <td className='td'>Germany</td>
              <td className='td'>20000</td>
              <td className='td'>5000</td>
            </tr>


            {/* >>>>>>>>>>>>>>>>>>>>>>> */}
            <tr>
              <td className='td'></td>
              <td className='td'></td>
              <td className='td'></td>
              <td className='td   font-bold  '>787</td>
              <td className='td font-bold  '>15000</td>
            </tr>
            <tr>
              <td className='td'></td>
              <td className='td'></td>
              <td className='td ' ></td>
              <td className='td text-red-500 font-bold   '> 7000</td>
              <td className='td text-green-500 font-bold   '>35000</td>
            </tr>
            <tr>
              <td ></td>
              <td ></td>
              <td ></td>
              <td > </td>
              <td className='text-blue-400 font-bold  '> Savings= 35000</td>
            </tr>

          </table>
        </div>
        <h3>Yearly Report</h3>
        <div className='first_table'>
          <table  >
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expense</th>
              <th>Savings</th>

            </tr>
            <tr>
              <td className='td'>Alfreds Futterkiste</td>
              <td className='td'>Maria Anders</td>
              <td className='td'>17870</td>
              <td className='td'>20000</td>

            </tr>

            {/* >>>>>>>>>>>>>>>>>>>>>>> */}

            <tr>
              <td className='td'></td>
              <td className='td text-green-500 font-bold  '>35000</td>
              <td className='td text-red-500 font-bold   '> 7000</td>
              <td className='text-blue-400 font-bold  '> 35000</td>
            </tr>


          </table>
        </div>
        <h3>Yearly Report</h3>
        <div className='first_table'>
          <table  >
            <tr>
              <th>Date</th>
              <th>Note</th>
            </tr>
            <tr>
              <td className='td'>12-4-2023</td>
              <td className='td'>Maria Anders</td>
            </tr>
            <tr>
              <td className='td'>12-4-2023</td>
              <td className='td'>Maria Anders</td>
            </tr>
            <tr>
              <td className='td'>12-4-2023</td>
              <td className='td'>Maria Anders</td>
            </tr>   <tr>
              <td className='td'>12-4-2023</td>
              <td className='td'>Maria Anders</td>
            </tr>
            <tr>
              <td className='td'>12-4-2023</td>
              <td className='td'>Maria Anders</td>
            </tr>

            {/* >>>>>>>>>>>>>>>>>>>>>>> */}



          </table>
        </div>
      </div>
    </div>:
    <div className='text-4xl font-bold text-slate-700 h-screen flex flex-col items-center justify-center'>this is a premium feature please take premium</div>
    }
    </>
  )
}

export default Test
