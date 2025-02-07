import React
// , { useRef } 
from 'react'
import { Doughnut } from 'react-chartjs-2'
import Link from 'next/link';

export default function AdminDashBDoughnut({title,data,option,link,extra}) {

  return (
    <>
    {/* <div> */}
    {/* <h1 className="text-[#313342] font-medium text-2xl mb-5 underline decoration-[#AEADEB] underline-offset-8">Dashboard</h1> */}
    <div className='text-center flex justify-center py-5 w-[70%]  sm:w-[332px] drop-shadow-custom3 rounded-[10px] bg-white '>
        <div className=' w-full sm:w-[60%] flex flex-col justify-between items-center gap-4'>
        <h2 className='font-sans text-base font-medium' >{title}</h2>
        {link?(<Link href={`${link}`}>
          <div className='w-[156px] h-[155px] flex justify-center items-center'>
    <Doughnut className='hover:cursor-pointer'  data={data} options={option} ></Doughnut>
    </div>
          </Link>):  <div className='w-[156px] h-[155px] flex justify-center items-center'>
    <Doughnut className='hover:cursor-pointer'  data={data} options={option} ></Doughnut>
    </div>}
     {
      extra==="Car Deatils"?(
        <ul className="list-none w-[80%] sm:w-full flex gap-3  flex-wrap">
        <li className="flex items-center  h-3">
          <span className="text-[#7483F3] text-4xl sm:text-6xl bg-transparent leading-none scale-50">•</span>
          <span className='text-[10px] sm:text-[8px] font-poppins font-normal'>Hired Cars</span>
        </li>
        <li className="flex  items-center h-3">
          <span className="text-[#404CA0] text-4xl sm:text-6xl bg-transparent scale-50">•</span>
          <span className='text-[10px] sm:text-[8px] font-poppins'>Ready for Hiring</span>
        </li>
        <li className="flex items-center h-3">
          <span className="text-[#27273AEB] text-4xl sm:text-6xl bg-transparent scale-50">•</span>
          <span className='text-[10px] sm:text-[8px] font-poppins'>Cars in Repair</span>
        </li>
      </ul>
      ):extra==="Data"?(
        <ul className="list-none w-[80%] sm:w-full flex gap-3  flex-wrap">
        <li className="flex items-center h-3">
          <span className="text-[#27273AEB] text-4xl sm:text-6xl bg-transparent scale-50">•</span>
          <span className='text-[10px] sm:text-[8px] font-poppins'>Total Number of cars</span>
        </li>
        <li className="flex  items-center h-3">
          <span className="text-[#404CA0] text-4xl sm:text-6xl bg-transparent scale-50">•</span>
          <span className='text-[10px] sm:text-[8px] font-poppins'>Rented Cars</span>
        </li>
        <li className="flex opacity-0 items-center h-3 ">
          <span className="text-[#404CA0] text-4xl sm:text-6xl bg-transparent scale-50">•</span>
          <span className='text-[10px] sm:text-[8px] font-poppins'>Rented Cars</span>
        </li>
      </ul>
      ):( 
        <ul className="list-none h-5 w-[80%] sm:w-full flex justify-between">
        <li className="flex h-full items-center space-x-2">
          <span className="text-[#27273AEB] text-4xl sm:text-6xl bg-transparent ">•</span>
          <span className='text-[12px] sm:text-sm font-poppins'>Active</span>
        </li>
        <li className="flex h-full items-center space-x-2">
          <span className="text-[#404CA0] text-4xl sm:text-6xl bg-transparent">•</span>
          <span className='text-[12px] sm:text-sm font-poppins'>Inactive</span>
        </li>
      </ul>)
     } 
   
    </div>
    </div>
    {/* </div> */}
    </>
  )
}
