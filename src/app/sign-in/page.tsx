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
import React from 'react'
import Link from 'next/link'

//react-icons
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TriangleAlert } from 'lucide-react'
import { signIn } from "next-auth/react";

const SignIn = () => {

  const[email,setEmail] = useState<string>('')
  const[password,setPassword] = useState<string>('')
  const[pending,setPending] = useState<boolean>(false)
  const[error,setError] = useState<string>('')
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
  
    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });
  
    if (res?.ok) {
      toast.success("Login successful");
      router.push("/");
    } else if (res?.status === 401) {
      setError("Invalid credentials");
    } else {
      setError("Something went wrong");
    }
  
    setPending(false);
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(value,{callbackUrl: "/"})
  }
  
  
  return (
    <div className='h-full flex items-center justify-center  mt-[40px] text-white'>
      <Card className='md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8'>
        <CardHeader>
          <CardTitle className='text-center'>
            Sign in
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

            <Input type='email'
                   disabled={pending}
                   placeholder='Email'
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required>
            </Input>

            <Input type='password'
                   disabled={pending}
                   placeholder='password'
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required>
            </Input>

            <Button className='w-full bg-white text-black hover:bg-pink-100'
                    size='lg'
                    disabled={pending}>
                      Continue
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
                  onClick={(e) => handleProvider(e,"github")}
                  variant='outline'
                  size='lg'
                  className='bg-black hover:bg-slate-800 hover:scale-110'>
                    <FaGithub className='size-8 left-2.5 top-2.5'></FaGithub>
            </Button>
          </div>
          <p className='text-center text-sm mt-2 text-muted-foreground'>
            Create a new Account?
            <Link href={'sign-up'} className='text-sky-700 ml-4 hover:underline cursor-pointer'>SignUp</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn