import { Loader } from 'lucide-react'
import React from 'react'

const Loaing = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-bg-LightGreen to-emerald-900 flex items-center justify-center relative overflow-hidden'>
        <Loader className='animate-spin w-16 h-16 text-white' />
    </div>
  )
}

export default Loaing