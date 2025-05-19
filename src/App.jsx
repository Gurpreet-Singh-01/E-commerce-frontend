import { useForm } from "react-hook-form";
import Input from "./components/Input";

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        name="email"
        type="email"
        register={register}
        error={errors.email}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        register={register}
        error={errors.password}
      />
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default App;
