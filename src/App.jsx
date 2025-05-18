import { getCategories } from './services/categoryService'
import { useQuery } from '@tanstack/react-query'
const App = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>getCategories()
  })
  return (
    <div>
      <h2>Categories</h2>
      {isLoading && <h1>Loading.....</h1>}
      {error && <h1>Error: {error.message}</h1>}
      <ul>
        {
          data && data.data.map((item) =>(
            <li key={item._id}>{item.name}</li>
          ))
        }
      </ul>
      <p>Message:- {data?.message}</p>
    </div>
  )
}

export default App