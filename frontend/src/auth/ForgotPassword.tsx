import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const loading = false;

  return (
    <div className='flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50'>
      <form className='flex flex-col gap-6 bg-white shadow-xl md:p-8 p-6 w-full max-w-md rounded-xl mx-4'>
        <div className='text-center'>
          <h1 className='font-extrabold text-3xl text-gray-800 mb-2'>Forgot Password</h1>
          <p className='text-sm text-gray-600'>Enter your email address to reset your password</p>
        </div>

        <div className='relative w-full'>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            className='pl-10'
          />
          <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5' />
        </div>

        {loading ? (
          <Button disabled className='bg-orange-500 hover:bg-orange-600'>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Please wait
          </Button>
        ) : (
          <Button className='bg-orange-500 hover:bg-orange-600'>
            Send Reset Link
          </Button>
        )}

        <span className='text-center text-sm text-gray-600'>
          Back to{" "}
          <Link to="/login" className='text-blue-600 font-semibold hover:underline'>Login</Link>
        </span>
      </form>
    </div>
  )
}

export default ForgotPassword
