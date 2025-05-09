import './App.css'
import Login from './auth/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './auth/Signup'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import VerifyEmail from './auth/VerifyEmail'
import Home from './components/Home'
import { Children } from 'react'
import Profile from './components/Profile'
import SeachPage from './components/SeachPage'
import RestaurantDetail from './components/RestaurantDetail'
import Cart from './components/Cart'
import Restaurant from './admin/Restaurant'
import AddMenu from './admin/AddMenu'
import Orders from './admin/Orders'
import Success from './components/success'
import CheckoutConfirmPage from './components/CheckoutConfirmPage'

const appRouter = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path:"/forgot-password",
    element: <ForgotPassword />
  },
  {
    path:"/reset-password",
    element: <ResetPassword />
  },
  {
    path:"/verify-email",
    element:<VerifyEmail />
  },
  {
    path:"/",
    element:<Home />
  },
  {
    path: "/profile",
    element:<Profile />
  },
  {
    path: "/search",
    element: <SeachPage />
  },
  {
    path: "/restaurant/detail",
    element: <RestaurantDetail />
  },
  {
    path: "/cart",
    element: <Cart />
  },
  {
    path: "/order/status",
    element: <Success />
  },

  // admin service start from here
  {
    path: "/admin/Restaurant",
    element: <Restaurant />
  },
  {
    path: "/admin/menu",
    element: <AddMenu />
  },
  {
    path: "/admin/orders",
    element: <Orders />
  }
])

function App(){
  return(
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  )
}

export default App;