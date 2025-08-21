import React from 'react'
import { FaUser } from 'react-icons/fa'

function AppName() {
  return (
    <div>
      <h1 className="text-2xl font-bold flex items-start gap-4">
        <FaUser className='hidden sm:block mt-5 text-xl' />
        <div>
          <div>
            <span className='font-bold text-primary'>Full Stack</span>
            <span className='text-4xl font-bold inline-block transform translate-y-2'>{" "}CRUD</span>
          </div>
          <div className="text-xs text-slate-500 -mt-2">{" "}vibe coding version</div>
        </div>
      </h1>
    </div>

  )
}

export default AppName