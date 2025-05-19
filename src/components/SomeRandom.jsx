import React from 'react'
import Button from './Button'
import { toast } from 'react-toastify'

const SomeRandom = () => {
  return (
    <div>
        <Button onClick ={()=> toast.success("Test Successfull")}>Test toast</Button>
    </div>
  )
}

export default SomeRandom