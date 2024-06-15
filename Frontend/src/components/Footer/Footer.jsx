import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faSquareInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <div className='bg-slate-100 overflow-hidden'>
        <div className='flex justify-between items-center py-6 lg:mx-20 md:mx-20 md:flex-row flex-col gap-4'>
            <p className=''>FInance Zen <span>by Sreedev &copy; 2024</span></p>
            <p>sreedev0612@gmail.com</p>
            <div className='text-3xl space-x-4'>
            <FontAwesomeIcon icon={faGithub} className='cursor-pointer'/>
            {/* <FontAwesomeIcon icon={faInstagram} /> */}
            <FontAwesomeIcon icon={faSquareInstagram} className='cursor-pointer'/>
            <FontAwesomeIcon icon={faLinkedin} className='cursor-pointer'/>
            </div>
        </div>
        <hr className='w-[95%] m-auto'/>
        <div>
            <h1 className='lg:text-9xl md:text-8xl text-4xl font-bold text-slate-300 text-center'>FINANCE ZEN</h1>
        </div>
    </div>
  )
}

export default Footer
