import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const Connections = () => {
  const [connections, setConnections] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [activeTab, setActiveTab] = useState('connections')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingRequestIds, setProcessingRequestIds] = useState(new Set())

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true)
      setError(null)
      try {
        const [connectionsResponse, requestsResponse] = await Promise.all([
          api.get('/api/user/connections'),
          api.get('/api/user/requests/received')
        ])
        
        setConnections(connectionsResponse.data)
        setPendingRequests(requestsResponse.data)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load connections')
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [])

  const handleRequestAction = async (requestId, status) => {
    setProcessingRequestIds(prev => new Set(prev).add(requestId))
    
    try {
      await api.post(`/api/request/review/${status}/${requestId}`)
      
      // Update the UI based on action
      if (status === 'accepted') {
        // Find the request that was accepted
        const acceptedRequest = pendingRequests.find(req => req._id === requestId)
        if (acceptedRequest) {
          // Add the user from the request to connections
          setConnections(prev => [...prev, acceptedRequest.fromUserId])
        }
      }
      
      // Remove the request from pending requests
      setPendingRequests(prev => prev.filter(req => req._id !== requestId))
      
    } catch (error) {
      setError(`Failed to ${status} request`)
    } finally {
      setProcessingRequestIds(prev => {
        const updated = new Set(prev)
        updated.delete(requestId)
        return updated
      })
    }
  }
  
  if (loading && connections.length === 0 && pendingRequests.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Network</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Tab navigation */}
      <div className="border-b mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('connections')}
            className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'connections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Connections {connections.length > 0 && `(${connections.length})`}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`ml-8 py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'connections' && (
          <>
            {connections.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">You don't have any connections yet.</p>
                <p className="text-gray-500">Check the Feed to connect with other developers.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((connection) => (
                  <div
                    key={connection._id}
                    className="bg-white p-6 rounded shadow flex flex-col items-center"
                  >
                    <img
                      src={connection.profileImageUrl || '/default-avatar.png'}
                      alt={`${connection.firstName}'s profile`}
                      className="w-20 h-20 rounded-full mb-3 object-cover"
                    />
                    <h3 className="font-semibold text-lg">{`${connection.firstName} ${connection.lastName || ''}`}</h3>
                    <p className="text-gray-600 text-sm mb-3">{connection.emailId}</p>
                    <button className="mt-auto w-full py-2 px-4 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                      Message
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'requests' && (
          <>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">You don't have any pending connection requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white p-4 rounded shadow flex items-center"
                  >
                    <img
                      src={request.fromUserId.profileImageUrl || '/default-avatar.png'}
                      alt={`${request.fromUserId.firstName}'s profile`}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{`${request.fromUserId.firstName} ${request.fromUserId.lastName || ''}`}</h3>
                      <p className="text-sm text-gray-600">{request.fromUserId.emailId}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleRequestAction(request._id, 'accepted')}
                        disabled={processingRequestIds.has(request._id)}
                        className={`py-2 px-4 rounded ${
                          processingRequestIds.has(request._id)
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRequestAction(request._id, 'rejected')}
                        disabled={processingRequestIds.has(request._id)}
                        className={`py-2 px-4 rounded ${
                          processingRequestIds.has(request._id)
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Connections
