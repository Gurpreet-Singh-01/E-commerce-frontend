import { useQuery } from "@tanstack/react-query";

const App = () => {
  // Testing react query
  const {data,isLoading} = useQuery(
    {
      queryKey:['test'],
      queryFn: async () => ({message:"It worksss!!"}) 
    }
  )
  return (
    <div className="min-h-screen bg-gray text-primary p-4">
      <h1 className="text-3xl font-bold text-center">
        {isLoading? 'Loading......' : data?.message}
      </h1>
    </div>
  );
};

export default App;
