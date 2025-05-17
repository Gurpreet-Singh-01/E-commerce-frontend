import React from 'react'
import useAuth from './hooks/useAuth'
import { loginUser } from './services/userService'

const App = () => {
  const { isAuthenticated, login, logout, refresh, role, user } = useAuth()
  const handleLogin = async() =>{
    try {
      const response = await loginUser('techtrendz103@gmail.com','techtrendz103@gmail.com_AdminPassword');
      console.log(response.user)
      login(response.user)
    } catch (error) {
      console.log('Login Error',error)
    }
  }
  return (
    <div className='min-h-screen p-4'>
      <h1>
        AUTH: {isAuthenticated ? `${user.name} (${role})`: "Not logged in "}
      </h1>
      <button className='border-2 border-amber-800' onClick={handleLogin}>Login</button>
      <button className='border-2 border-amber-800' onClick={refresh}>Refresh Token</button>
      <button className='border-2 border-amber-800' onClick={logout}>Logout</button>


    </div>
  )
}

export default App