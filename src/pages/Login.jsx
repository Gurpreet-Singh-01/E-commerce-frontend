import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';
import { loginUser } from '../services/userService';


const Login = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState(
    {
      email: '',
      password: ''
    }
  )

  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData.email, formData.password)
      if (response.success) {
        login(response.data.user)
        navigate(response.data.user.role === 'admin' ? '/admin' : '/')
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-text">
      <main className='container mx-auto px-4 py-8 flex-grow'>
        <div className='max-w-md mx-auto'>
          <h1 className="text-3xl font-bold text-center mb-8 font-headings">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
            />
            {error && <p className="text-error text-sm">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
