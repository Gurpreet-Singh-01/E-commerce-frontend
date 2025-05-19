const Input = ({
  label,
  type = 'text',
  name,
  register,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col space-y-1 font-text">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-neutral-dark font-headings"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        className={`border ${error ? 'border-error' : 'border-neutral-light'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...(register ? register(name) : {})}
        {...props}
      />
      {error && <p className="text-error text-xs">{error.message}</p>}
    </div>
  );
};

export default Input;
