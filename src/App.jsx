import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminRoute from './components/AdminRoute';
import ManageOrders from './pages/ManageOrders';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProductDetails from './pages/ProductDetails';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col font-text">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>

        } />
        <Route path="/products" element={
          <>
            <Navbar />
            <Products />
            <Footer />
          </>
        } />
        <Route path="/products/:id" element={
          <>
            <Navbar />
            <ProductDetails />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <Login />
            <Footer />
          </>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <Register />
            <Footer />
          </>
        } />

        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
              <Footer />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
              <Footer />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Navbar />
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
              <Footer />

            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <Navbar />
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
              <Footer />

            </>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <>
              <Navbar />
              <AdminRoute>
                <ManageOrders />
              </AdminRoute>
              <Footer />

            </>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
