import React from 'react'

const TeamCard = ({ name, role, image, position }) => {
    return (
        <div>
            <div
                className={`absolute bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${position}`}
                style={{ width: '180px' }}
            >
                <div className="flex flex-col items-center text-center">
                    <img
                        src={image}
                        alt={name}
                        className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                    <h3 className="font-semibold text-[#000000E6] text-sm mb-1">{name}</h3>
                    <p className="text-gray-600 text-xs leading-tight">{role}</p>
                </div>
            </div>
        </div>
    )
}

export default TeamCard