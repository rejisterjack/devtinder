import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    age: '',
    gender: '',
  })
  const [error, setError] = useState(null)
  
  const { signup, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    const result = await signup(formData)
    
    if (result.success) {
      navigate('/login')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        {['firstName', 'lastName', 'emailId', 'password'].map(
          (field) => (
            <div className="mb-4" key={field}>
              <label className="block text-sm font-medium mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                className="w-full border rounded p-2"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          )
        )}
        
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
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            className="w-full border rounded p-2"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-green-300"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}

export default Signup
