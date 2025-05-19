const Loader = ({ size = 'medium', className = '' }) => {
  const sizeStyles = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-20 h-20 border-6',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeStyles[size]} border-primary border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;
