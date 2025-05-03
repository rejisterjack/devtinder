import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      navigate('/login')
    }
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          DevTinder
        </Link>
        <div className="space-x-4">
          {currentUser ? (
            <>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
              <Link to="/connections" className="hover:underline">
                Connections
              </Link>
              <button 
                onClick={handleLogout}
                className="hover:underline"
              >
                Logout
              </button>
              <span className="ml-2 text-sm text-gray-300">
                Hello, {currentUser.firstName}
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
