import React from 'react';
     import { Link } from 'react-router-dom';
     import { FaCheckCircle } from 'react-icons/fa';

     const ThankYou = () => {
       return (
         <div className="min-h-screen bg-background flex items-center justify-center font-text">
           <div className="text-center p-6 bg-surface rounded-lg shadow-xl max-w-md w-full mx-4">
             <FaCheckCircle className="text-primary text-6xl mx-auto mb-4" />
             <h1 className="text-2xl font-semibold text-neutral-dark font-headings mb-4">
               Order Placed Successfully
             </h1>
             <p className="text-neutral-dark mb-6">
               Thank you for your order! You'll receive a confirmation soon.
             </p>
             <Link
               to="/products"
               className="inline-flex items-center px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors font-text"
             >
               Continue Shopping
             </Link>
           </div>
         </div>
       );
     };

     export default ThankYou;