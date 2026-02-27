import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative'>
      <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden' />
      <div className='absolute flex inset-0 flex-col items-center md:items-start justify-end md:justify-center
       pb-24 px-4  lg:pl-24'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105
         leading-tight lg:leading-15'>Freshness You Can Trust, Savings You will Love! </h1>

        <div className='flex items-center mt-6 font-medium'>
          <Link to={"/products"} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull 
        transition rounded text-white cursor-pointer'>
            Shop now
          </Link>
          <Link to={"/products"} className='group flex items-center gap-2 px-7 md:px-9 py-3 transition rounded text-gray cursor-pointer'>
            Explore deals
            <img src={assets.black_arrow_icon} alt="arrow" className='transition group-hover:translate-x-1' />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
