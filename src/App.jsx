import {useQuery} from '@tanstack/react-query'
import { getProducts } from './services/productService';
const App = () => {
  const {data,isLoading,error} = useQuery({
    queryKey:['products'],
    queryFn: () =>getProducts({search:'cover'})
  });
  return (
    <div className='min-h-screen'>
      <h1>Products</h1>
      {isLoading && <p>Loading....</p>}
      {error && <p>Error:{error.message}</p>}
      {data && (
        <ul>
          {data.data.map((product) =>(
            <li key={product._id}>{product.name}</li>
          ))}
        </ul>
      )}
      {data?.message}
    </div>
  )
}

export default App