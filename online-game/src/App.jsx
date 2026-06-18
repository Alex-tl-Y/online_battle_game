import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HomeScreen from "./screenviews/HomeScreen";
import PlayScreen from "./screenviews/PlayScreen";
import './App.css'

function App() {
  return (
    <div id = "App">
      <BrowserRouter>
        <Routes>
          <Route  path = "/" element = {<HomeScreen />}></Route>
          <Route path = "/play" element = {<PlayScreen />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
    
  );
}

export default App
