import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../utils/api'

const Profile = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    age: currentUser?.age || '',
    gender: currentUser?.gender || '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Update form data when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        age: currentUser.age || '',
        gender: currentUser.gender || '',
      })
    }
  }, [currentUser])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await api.patch(`/profile/edit/${currentUser._id}`, formData)
      setSuccess(true)
      // Force refresh profile data
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Profile updated successfully!
        </div>
      )}
      
      <div className="mb-6 flex flex-col items-center">
        <img
          src={currentUser?.profileImageUrl || '/default-avatar.png'}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4"
        />
        <p className="text-gray-600">{currentUser?.emailId}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            className="w-full border rounded p-2"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="w-full border rounded p-2"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            name="age"
            min="18"
            max="120"
            className="w-full border rounded p-2"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            className="w-full border rounded p-2"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}

export default Profile
