import React, { useEffect, useState } from 'react';
import Expence from "../expence/Expence";
import axios from "axios";
import { ExpenceProvider } from '../context/ExpenceContext';
import ExpenceForm from '../expenceForm/ExpenceForm';
import ReactPaginate from 'react-paginate';
import "../test/test.css";

function Expences() {
  const [expences, setExpences] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(8); // Use state instead of useRef
  const [currentPage, setCurrentPage] = useState(0);

  const addExpence = (expence) => {
    setExpences((prev) => [expence, ...prev]);
  };

  async function removeExpence(id) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/expence/${id}`, { headers: { Authorization: token } });
    if (response.status == 200) {
      setExpences((prevExpences) => prevExpences.filter((prevExpence) => prevExpence.id !== id));
    }
  }

  useEffect(() => {
    getPaginatedExpence();
  }, [limit, currentPage]); // Trigger effect on limit or currentPage change

  const handlePageClick = (e) => {
    setCurrentPage(e.selected); // Update page number
  };

  const getPaginatedExpence = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/expence/pagination?page=${currentPage}&limit=${limit}`, { headers: { Authorization: token } })
      .then((res) => {
        setExpences(res.data.expenses);
        setPageCount(Math.ceil(res.data.count / limit));
      });
  };

  const handleLimit = (e) => {
    setLimit(parseInt(e.target.value)); // Set limit as an integer
    setCurrentPage(0); // Reset to the first page when the limit changes
  };

  return (
    <ExpenceProvider value={{ addExpence, removeExpence }}>
      <div>
        <div>
          {/* Expences */}
          <ExpenceForm />
          {expences.length > 0 ? (
            <div>
              <div className='first_table w-full pt-6'>
                <table className='p-4'>
                  <thead>
                    <tr>
                      <th className='p-2'>Data</th>
                      <th className='p-2'>Description</th>
                      <th className='p-2'>Category</th>
                      <th className='p-2'>Income</th>
                      <th className='p-2'>Expense</th>
                      <th className='p-2'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expences.map((expence) => (
                      <tr key={expence.id}>
                        <td className='td p-2'>{new Date(expence.createdAt).toDateString()}</td>
                        <td className='td p-2'>{expence.expenceDescription}</td>
                        <td className='td p-2'>{expence.expenceCategory}</td>
                        <td className='td'></td>
                        <td className='td p-2'>{expence.expenceAmount}</td>
                        <td>
                          <div className='text-center'>
                            <button
                              onClick={() => removeExpence(expence._id)}
                              className='bg-red-700 px-2 rounded-md text-white'>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='container'>
                <div className='w-full text-center p-4'>
                  <label className='text-lg px-2'>Limit Per Page</label>
                  <select className='border-2 border-gray-700 px-2 text-blue-800' onChange={handleLimit} value={limit}>
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-4xl font-bold text-slate-700 h-screen flex flex-col items-center justify-center'>You have no Expenses</div>
          )}
        </div>
      </div>
    </ExpenceProvider>
  );
}

export default Expences;
