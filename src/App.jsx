import useAuth from "./hooks/useAuth"
import api from "./services/api"

const App = () => {
  const testAPI = async() =>{
    try {
      const response = await api.get("/user/user");
      console.log(response.data)
    } catch (error) {
      console.log("In Error Block")
      console.log("API Error", error)
    }
  }
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center">
        Testing API
      </h1>

      <button
        className="px-4 py-2 rounded mr-2 border-2 border-black"
        onClick={testAPI}
      >Test</button>

      

    </div>
  )
}

export default App