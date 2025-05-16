import useAuth from "./hooks/useAuth"

const App = () => {
  const { user, isAuthenticated, role, login, refresh, logout } = useAuth();
  const testUser = {
    id:'1',
    name:'test user',
    email: 'test@gmail.com',
    role:'customer'
  }
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center">
        Auth: {isAuthenticated ? `${user.name} (${role})` : 'Not Logged In'}
      </h1>

      <button
        className="px-4 py-2 rounded mr-2"
        onClick={() => login(testUser)}
      >Test Login</button>

      <button
        className="px-4 py-2 rounded mr-2"
        onClick={refresh}
      >Test refresh</button>
      <button
        className="px-4 py-2 rounded mr-2"
        onClick={logout}
      >Test Logout</button>

    </div>
  )
}

export default App