'use client'

//shadcn
import { Button } from '@/components/ui/button'
import { Card,
         CardHeader,
         CardDescription,
         CardContent,
         CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


//react-icons
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'
import { TriangleAlert } from 'lucide-react'

const SignUp = () => {
  const [form,setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [pending,setPending] = useState(false)
  const [error,setError] = useState('')
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    const res = await fetch('/api/auth/signup',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });
    setPending(true);
const data = await res.json();

        if (res.ok) {
          toast.success(data.message);
          router.push('/sign-in');
        } else {
          setError(data.message || "Something went wrong");
        }
        setPending(false);
  }
  
  return (
    <div className='h-full flex items-center justify-center  mt-[70px] text-white'>
      <Card className='md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8'>
        <CardHeader>
          <CardTitle className='text-center'>
            Sign up
          </CardTitle>
          <CardDescription className='text-small text-center text-accent-foreground'>
            Use email or service, to create account
          </CardDescription>
        </CardHeader>
      {!!error && (
        <div  className='bg-red-300 p-3 rounded-md flex items-center gap-x-2 text-sm mb-6 text-red-500'>
          <TriangleAlert/>
          <p>{error}</p>
        </div>
      )}
        <CardContent className='px-2 sm:px-6'>
          <form onSubmit={handleSubmit} className='space-y-3'>
            <Input type='text'
                   disabled={pending}
                   placeholder='Full name'
                   value={form.name}
                   onChange={(e) => setForm({...form,name: e.target.value})}
                   required>
            </Input>

            <Input type='email'
                   disabled={pending}
                   placeholder='Email'
                   value={form.email}
                   onChange={(e) => setForm({...form,email: e.target.value})}
                   required>
            </Input>

            <Input type='password'
                   disabled={pending}
                   placeholder='password'
                   value={form.password}
                   onChange={(e) => setForm({...form,password: e.target.value})}
                   required>
            </Input>

            <Input type='password'
                   disabled={pending}
                   placeholder='Confirm password'
                   value={form.confirmPassword}
                   onChange={(e) => setForm({...form,confirmPassword: e.target.value})}
                   required>
            </Input>
            <Button className='w-full bg-white text-black hover:bg-pink-100'
                    size='lg'
                    disabled={false}>
                      Submit
            </Button>
          </form>
          <Separator/>
          <div className='flex my-2 justify-evenly mx-auto items-center'>
            <Button 
                  disabled={false}
                  onClick={() => {}}
                  variant='outline'
                  size='lg'
                  className='bg-black hover:bg-slate-800 hover:scale-110'>
                    <FcGoogle className='size-8 left-2.5 top-2.5'></FcGoogle>
            </Button>
            <Button 
                  disabled={false}
                  onClick={() => {}}
                  variant='outline'
                  size='lg'
                  className='bg-black hover:bg-slate-800 hover:scale-110'>
                    <FaGithub className='size-8 left-2.5 top-2.5'></FaGithub>
            </Button>
          </div>
          <p className='text-center text-sm mt-2 text-muted-foreground'>
            Already have an account 😍?
            <Link href={'sign-in'} className='text-sky-700 ml-4 hover:underline cursor-pointer'>Signin</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp;