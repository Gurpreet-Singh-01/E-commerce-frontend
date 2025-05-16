import React from 'react';

const App = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-primary">
        API URL: {import.meta.env.VITE_API_BASE_URL}
      </h1>
    </div>
  );
};

export default App;
