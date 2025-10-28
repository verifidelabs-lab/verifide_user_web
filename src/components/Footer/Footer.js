import React from 'react'
import Button from '../ui/Button/Button'

const Footer = ({ onClick }) => {
    return (
        <div className='glassy-card w-full  absolute left-0 h-20 shadow shadow-[#00000026]/10 flex justify-center items-center  z-50 bottom-0'>
            <div className='min-w-7xl  mx-auto flex justify-between place-items-center space-x-72'>
                <Button variant='outline'>Previous</Button>
                <Button onClick={onClick}>Continue</Button>

            </div>
        </div>
    )
}

export default Footer