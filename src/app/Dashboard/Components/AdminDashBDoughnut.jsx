import React, { useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useEffect } from 'react';
import { Chart } from 'chart.js';

export default function AdminDashBDoughnut({title,data,option}) {

  return (
    <>
    {/* <div> */}
    {/* <h1 className="text-[#313342] font-medium text-2xl mb-5 underline decoration-[#AEADEB] underline-offset-8">Dashboard</h1> */}
    <div className='text-center flex justify-center py-5 w-[70%] sm:h-[290px] sm:w-[332px] drop-shadow-custom3 rounded-[10px] bg-white '>
        <div className=' w-full sm:w-[60%] flex flex-col justify-between items-center'>
        <h2 className='font-sans text-base font-medium' >{title}</h2>
        <div className='w-[156px] h-[155px] flex justify-center items-center'>
    <Doughnut className='hover:cursor-pointer'  data={data} options={option} ></Doughnut>
    </div>
    <ul className="list-none h-5 w-[80%] sm:w-full flex justify-between">
  <li className="flex h-full items-center space-x-2">
    <span className="text-[#27273AEB] text-4xl sm:text-6xl bg-transparent ">•</span>
    <span className='text-[12px] sm:text-sm font-poppins'>Active</span>
  </li>
  <li className="flex h-full items-center space-x-2">
    <span className="text-[#404CA0] text-4xl sm:text-6xl bg-transparent">•</span>
    <span className='text-[12px] sm:text-sm font-poppins'>Inactive</span>
  </li>
</ul>
    </div>
    </div>
    {/* </div> */}
    </>
  )
}
