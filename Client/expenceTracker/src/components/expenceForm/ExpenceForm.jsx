import React,{useState} from 'react'
import { useExpence } from '../context/ExpenceContext';

function ExpenceForm() {
    const [expenceAmount, setExpenceAmount] = useState('');
    const [expenceDescription, setExpenceDescription] = useState('');
    const [expenceCategory, setExpenceCategory] = useState('Movie');
    const { addExpence } = useExpence();
    async function handleSubmit(e) {
        e.preventDefault();
        const token=localStorage.getItem("token")
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/expence/addExpence`,{ expenceAmount, expenceDescription, expenceCategory },{headers:{Authorization:token}})

        if (response.status == 200) {
            addExpence({ expenceAmount, expenceDescription, expenceCategory })
            setExpenceAmount('');
            setExpenceDescription('');
            setExpenceCategory('Movie')
        }

    }

    return (
        <div>
            <div className='bg-slate-600'>
                <form onSubmit={handleSubmit} className=' bg-yellow-200 flex flex-col justify-center items-center md:flex md:flex-row md:justify-normal'>
                    <div className='md:flex md:p-8'>
                        <div className='md:p-4'>
                            <label className=' text-xl text-blue-500 font-bold' htmlFor='expenceAmount'>Chooe Expence Amount:</label>
                        </div>
                        <div className='md:p-4'>
                            <input type='number' id='expenceAmount'
                                value={expenceAmount}
                                onChange={(e) => setExpenceAmount(e.target.value)}
                                placeholder='expence Amount...' className='block w-full rounded-md border-0 py-1.5  text-gray-900
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' />
                        </div>
                    </div>
                    <div className='md:flex'>
                        <div className='md:p-4'>
                            <label className=' text-xl text-blue-500 font-bold' htmlFor='expenceDesc'>Expence Description:</label>
                        </div>
                        <div className='md:p-4'>
                            <input type='text' id='expenceDesc'
                                value={expenceDescription}
                                onChange={(e) => setExpenceDescription(e.target.value)}
                                placeholder='expence Desc...'
                                className='block w-full rounded-md border-0 py-1.5  text-gray-900
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' />
                        </div>
                    </div>
                    <div className='md:flex'>
                        <div className='md:p-4'>
                            <label className=' text-xl text-blue-500 font-bold' htmlFor="expenceCat">Choose Category:</label>
                        </div>
                        <div className='md:p-4'>
                            <select name="expenceCat" id="expenceCat" value={expenceCategory}
                                onChange={(e) => setExpenceCategory(e.target.value)}
                                className='block w-full rounded-md border-0 py-1.5  text-gray-900
                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                                <option value="Mivie">Movie</option>
                                <option value="Fuel">Fuel</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Travel">Travel</option>
                            </select>
                        </div>
                    </div>
                    <div className='p-3'>
                        <button type="submit" className='bg-blue-600 rounded-md text-center text-lg text-zinc-50 p-1 px-4' >Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ExpenceForm
