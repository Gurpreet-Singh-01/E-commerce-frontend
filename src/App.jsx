import React from 'react';
import Button from './components/Button'

const App = () => {
  return (
    <div className="space-y-4 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold">Button Variants</h2>

      <div className="space-x-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
      </div>

      <h2 className="text-xl font-bold mt-6">Button Sizes</h2>
      <div className="space-x-4">
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </div>

      <h2 className="text-xl font-bold mt-6">Disabled State</h2>
      <div className="space-x-4">
        <Button disabled>Disabled Primary</Button>
        <Button variant="danger" disabled>Disabled Danger</Button>
      </div>

      <h2 className="text-xl font-bold mt-6">Click Test</h2>
      <Button onClick={() => alert('Button clicked!')}>
        Click Me
      </Button>
    </div>
  );
};

export default App;
