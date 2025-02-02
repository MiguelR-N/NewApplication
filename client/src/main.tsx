import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import App from './App'; 
import UploadFiles from './pages/UploadFiles'; 
import SignInForm from './pages/SignInForm';

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <BrowserRouter> 
        <Routes>
          {/* Ruta principal */}
          <Route path="*" element={<App />} />
          
          {/* Otras rutas */}
          <Route path="/Content" element={<UploadFiles />} />
          <Route path="/SignInForm" element={<SignInForm />} />
        </Routes>
      </BrowserRouter>
    </StyledEngineProvider>
  </React.StrictMode>
);
