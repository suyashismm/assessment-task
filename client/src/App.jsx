import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {

  
  return (
    <>
<BrowserRouter>
        <Routes>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/Blog" index element={<Dashboard/>}></Route>
          {/* <Route path="/home" index element={<Home/>}></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
