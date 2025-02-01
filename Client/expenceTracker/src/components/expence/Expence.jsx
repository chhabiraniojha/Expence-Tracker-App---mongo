import React from 'react'
import { useExpence } from '../context/ExpenceContext'

function Expence({expence}) {
    const {removeExpence}=useExpence();

    function handleClick(){
        removeExpence(expence.id)
    }

    return (
        <div>
            <div className='border borded-2 border-yellow-200 bg-yellow-200 p-8 m-3'>
                <li>
                    <div >
                        <h5 className='p-2'>Expence Amount:{expence.expenceAmount}</h5>
                        <h5 className='p-2'>Expence Description:{expence.expenceDescription}</h5>
                        <h5 className='p-2'>Expence Category:{expence.expenceCategory}</h5>

                    </div>
                </li>
                <div className=' text-center'>
                    <button  type='button' onClick={handleClick} className='bg-red-700 rounded-md px-4 py-2 font-bold'>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Expence
