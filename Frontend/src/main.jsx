import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import User from './pages/User';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import ProtectedRoute from './utils/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      {
        path: '/user',
        element: (
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        ),
      },
      {
        path: '/add-transaction',
        element: (
          <ProtectedRoute>
            <AddTransaction />
          </ProtectedRoute>
        ),
      },
      {
        path: '/edit/:transactionType/:transactionId',
        element: (
          <ProtectedRoute>
            <EditTransaction />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
