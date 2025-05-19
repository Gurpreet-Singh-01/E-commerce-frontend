import React, { useState } from 'react'
import Button from './components/Button'
import Modal from './components/Modal'

const App = () => {
  const [isOpen, setIsOpen] = useState()
  return (
    <div>
      <p>There has to be something right</p>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Checking Modal"
        footer={
          <>
            <Button variant='success' onClick={() => { alert('Yes !!!'); setIsOpen(false) }}>Confirm</Button>
            <Button variant='danger' onClick={() => setIsOpen(false)}>Cancel</Button>

          </>
        }
      >
        <p>Are you sure this Modal is working fine?</p>
      </Modal>
      <p>There has to be something right</p>
    </div>
  )
}

export default App