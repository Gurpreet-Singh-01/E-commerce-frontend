import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);

  const [allCategories, setAllCategories] = useState([])

  useEffect(()=>{
    const fetchCategories = async() =>{
      try {
        const res = await axios.get('/api/v1/category')
        setAllCategories(res.data?.data)
      } catch (error) {
        console.log("Error: ",error.response?.data?.message)
      }
    }
    fetchCategories();
  },[])
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/user/login_user',

        { email, password },
        { withCredentials: true }
      )
      console.log(res?.data?.data?.user?.name)
      setIsLoggedIn(true)
    } catch (error) {
      console.log("Error: ", error.response?.data?.message)
      alert("Login Falied.....")
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name)
    formData.append('description',description)
    formData.append('price', price)
    formData.append('category', category)
    formData.append('stock', stock)
    formData.append('image', image)
    try {

      const res = await axios.post('/api/v1/product/', formData,{
        withCredentials:true,
        headers:{'content-Type':'multipart/form-data'}
      })
      alert("Product Added Successfully")

    } catch (error) {
      const err = error.response?.data?.message
      console.log("Error", err)
      alert("Product Addition Failed", err)

    }finally{
      setName("");
      setDescription("")
      setPrice("")
      setStock("")
      setImage(null)
    }
  }

  return (
    <div>
      {!isLoggedIn ?
        (<>
          <form onSubmit={handleLogin}>
            <h2>Admin Login</h2>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <button type="submit">Login</button>
          </form>
        </>) : (<>
          <form onSubmit={handleAddProduct}>
            <h2>Add Product</h2>
            <input
              type='text'
              placeholder='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type='number'
              placeholder='Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            {/* category */}
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}  
              required
            >
              <option value="">Select Category</option>
              {
                allCategories.map((cat) => (
                  <option key={cat?._id} value={cat?._id}>{cat?.name}</option>
                ))
              }
            </select>

            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />

            <input
              type='file'
              onChange={(e) => setImage(e.target.files[0])}
              required
            />

            <button type='submit'>Add Product</button>
          </form>
        </>)}

    </div>



  )
}

export default App
