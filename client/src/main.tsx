import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Importa BrowserRouter, Routes y Route para gestionar rutas
import App from './App'; // Importa el componente principal de la aplicación
import Content from './pages/Content'; // Importa la página de prueba

// Renderiza la aplicación en el elemento raíz del DOM
ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>

      <BrowserRouter> 
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Content" element={<Content />} />
        </Routes>
      </BrowserRouter>
    </StyledEngineProvider>
  </React.StrictMode>
);