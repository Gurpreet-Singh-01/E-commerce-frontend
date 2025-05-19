import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/index.js';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './services/queryClient.js';
import './index.css';
import App from './App.jsx';
import Toast from './components/Toast.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toast />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);
