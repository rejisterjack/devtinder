import React, { useEffect, useState } from 'react'
import api from '../utils/api'

const Feed = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [connectingUsers, setConnectingUsers] = useState(new Set())

  const fetchFeed = async (pageNum = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/api/feed?page=${pageNum}&limit=6`)
      setUsers(response.data.data)
      setPagination(response.data.pagination)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed(page)
  }, [page])

  const handleConnect = async (userId) => {
    setConnectingUsers(prev => new Set(prev).add(userId))
    try {
      await api.post(`/api/request/send/interested/${userId}`)
      // Remove user from the feed after sending a connection request
      setUsers(users.filter(user => user._id !== userId))
    } catch (error) {
      setError('Failed to send connection request')
    } finally {
      setConnectingUsers(prev => {
        const updated = new Set(prev)
        updated.delete(userId)
        return updated
      })
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPage(newPage)
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Developer Feed</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {users.length === 0 && !loading ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No more developers to connect with at the moment!</p>
          <p className="text-gray-500 mt-2">Check back later for new connections.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-6 rounded shadow flex flex-col items-center"
              >
                <img
                  src={user.profileImageUrl || '/default-avatar.png'}
                  alt={`${user.firstName}'s profile`}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <h2 className="text-lg font-bold">{`${user.firstName} ${user.lastName || ''}`}</h2>
                <p className="text-sm text-gray-600 mb-4">{user.emailId}</p>
                <button 
                  className={`w-full mt-auto py-2 px-4 rounded text-white ${
                    connectingUsers.has(user._id) 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => handleConnect(user._id)}
                  disabled={connectingUsers.has(user._id)}
                >
                  {connectingUsers.has(user._id) ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || loading}
                  className="px-3 py-1 mr-1 rounded border disabled:opacity-50"
                >
                  Previous
                </button>
                
                <div className="flex">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(pageNum => (
                      pageNum === 1 || 
                      pageNum === pagination.totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ))
                    .map((pageNum, index, array) => {
                      // Add ellipsis
                      if (index > 0 && pageNum > array[index - 1] + 1) {
                        return (
                          <React.Fragment key={`ellipsis-${pageNum}`}>
                            <span className="px-3 py-1 mx-1">...</span>
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
                              className={`px-3 py-1 mx-1 rounded ${
                                page === pageNum 
                                  ? 'bg-blue-500 text-white' 
                                  : 'border hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          </React.Fragment>
                        )
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`px-3 py-1 mx-1 rounded ${
                            page === pageNum 
                              ? 'bg-blue-500 text-white' 
                              : 'border hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                </div>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages || loading}
                  className="px-3 py-1 ml-1 rounded border disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Feed
