import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Game from "./components/Game";
import Menu from "./components/Menu";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Menu />} />
        <Route path='/game/:id' element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
