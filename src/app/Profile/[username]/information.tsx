// src/app/profile/[username]/information.tsx
import React, { useEffect, useState } from 'react'
import InfoCard from '../components/InfoCard'
import { FiSave } from 'react-icons/fi'

interface UserInfo {
  name: string;
  username: string;
  email: string;
  location: string;
}

const Information = ({ username }: { username: string }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [editedInfo, setEditedInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`/api/users/${username}/information`)
        if (!response.ok) {
          throw new Error('Failed to fetch user information')
        }
        const data = await response.json()
        setUserInfo(data)
        setEditedInfo(data)
      } catch (error) {
        console.error('Error fetching user information:', error)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchUserInfo()
    }
  }, [username])

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setEditedInfo(prev => ({
      ...prev!,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${username}/information`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedInfo)
      })

      if (!response.ok) {
        throw new Error('Failed to update user information')
      }

      const data = await response.json()
      setUserInfo(data)
    } catch (error) {
      console.error('Error updating user information:', error)
    }
  }

  if (loading) {
    return (
      <div className='ml-[18px] mt-[25px] h-[400px] w-full mb-[20px]'>
        <div className='font-tektur font-semibold text-[30px] text-white ml-3'>Personal Info</div>
        <div className='text-white'>Loading...</div>
      </div>
    )
  }

  if (!userInfo || !editedInfo) {
    return (
      <div className='ml-[18px] mt-[25px] h-[400px] w-full mb-[20px]'>
        <div className='font-tektur font-semibold text-[30px] text-white ml-3'>Personal Info</div>
        <div className='text-white'>Failed to load user information</div>
      </div>
    )
  }

  return (
    <div className='ml-[18px] mt-[25px] h-[400px] w-full mb-[20px]'>
      <div className='font-tektur font-semibold text-[30px] text-white ml-3'>Personal Info</div>

      <div className='w-[500px] h-[500px] flex flex-col ml-[65px] mt-[25px]'>
        <InfoCard 
          label="Name" 
          value={editedInfo.name} 
          onChange={(value) => handleInputChange('name', value)}
        />
        <InfoCard 
          label="U-Name" 
          value={editedInfo.username} 
          onChange={(value) => handleInputChange('username', value)}
        />
        <InfoCard 
          label="Email" 
          value={editedInfo.email} 
          onChange={(value) => handleInputChange('email', value)}
        />
        <InfoCard 
          label="Location" 
          value={editedInfo.location} 
          onChange={(value) => handleInputChange('location', value)}
        />
        
        <button
          onClick={handleSave}
          className='flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md w-[150px] mt-4'
        >
          <FiSave /> Save
        </button>
      </div>
    </div>
  )
}

export default Information