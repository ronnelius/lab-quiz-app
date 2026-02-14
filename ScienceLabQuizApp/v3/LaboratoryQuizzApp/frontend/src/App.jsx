import React, { use } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import Signup from  './components/SignUp'
import MyResult from './components/MyResult'
import MyResultPage from './pages/MyResultPage'
import { Navigate, useLocation } from 'react-router-dom';
//private route imports
function RequiredAuth({ children }) {
  const islLoggedIn = Boolean(localStorage.getItem('authToken')); // Check if the user is authenticated
  const location = useLocation();

  if (!islLoggedIn) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the child components
  return children;
}


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>

      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/result' element={
        <RequiredAuth>
          <MyResultPage/>
        </RequiredAuth>
      }/>
    </Routes>
  )
}

export default App