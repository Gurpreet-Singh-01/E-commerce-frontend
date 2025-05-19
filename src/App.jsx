import React, { useEffect, useState } from 'react'
import Loader from './components/Loader'
const App = () => {
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    const timer = setTimeout( () =>setLoading(false),3000)
    return () => clearTimeout(timer)
  },[])
  return (
     <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      {loading ? (
        <Loader size="medium" />
      ) : (
        <p className="text-xl font-bold text-primary">Loaded!</p>
      )}
    </div>
  )
}

export default App