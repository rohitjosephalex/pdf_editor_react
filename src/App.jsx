// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Pdf from './pdf';
// import MyFiles from './pages/MyFilesFiles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';




function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/newpage" component={NewPageComponent} /> */}
          <Route index element={<Pdf />} />
          {/* <Route path="/userfiles" element={<MyFiles />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
