import React, { useState } from "react";
import { Box, Button, Typography, List, ListItem, ListItemText, IconButton, Snackbar, Alert, Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const Content = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Para controlar la página activa

  const FILES_PER_PAGE = 4; 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      
      // Calcular el tamaño total de los archivos nuevos y existentes
      const currentFiles = [...files, ...newFiles];
      const totalSize = currentFiles.reduce((sum, file) => sum + file.size, 0);
  
      // Limitar el tamaño total de los archivos a 300MB
      if (totalSize > 300 * 1024 * 1024) {
        setErrorMessage("El tamaño total de los archivos no puede exceder los 300MB.");
        setOpenSnackbar(true);
        return;
      }
  
      // Si el tamaño es válido, actualizar la lista de archivos
      setErrorMessage(null);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  

//Aun Trabajando ...

  // Función para eliminar un archivo
  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  // Función para enviar archivos por correo
  const handleSendFiles = () => {
    alert("Los archivos han sido enviados por correo (AUN NO FUNCIONA ES UN EJEMPLO, MAS ADELANTE LE DAREMOS USO)");
  };

  // Cerrar la snackbar de error
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Calcular el tamaño total de los archivos en MB
  const getTotalFileSizeInMB = () => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    return (totalSize / (1024 * 1024)).toFixed(2); // Convertir bytes a MB
  };

  //Variables de paginacion 
  // Calcular el índice de inicio y fin para los archivos que se deben mostrar
  const indexOfLastFile = currentPage * FILES_PER_PAGE;
  const indexOfFirstFile = indexOfLastFile - FILES_PER_PAGE;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(files.length / FILES_PER_PAGE);

  // Cambiar a la página anterior
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Cambiar a la siguiente página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "50px auto", padding: 3, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          color: "black",
          textShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // Brillo en el texto
        }}
      >
        ¡Hola! Aquí puedes subir los archivos que deseas y enviarlos a cualquier destino.
      </Typography>

      {/* Error Message */}
      {errorMessage && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      )}

      {/* Carga de Archivos */}
      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept=".pdf, .doc, .docx, .txt, .jpg, .png, .jpeg, .zip" // No incluye videos
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            sx={{
              color: "white",
              background: "linear-gradient(45deg, #ff1a1a, #000000)", // Degradado negro y rojo
              fontWeight: "bold",
              textTransform: "none",
              padding: "12px 24px",
              borderRadius: "30px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)", // Sombra sutil
              "&:hover": {
                background: "linear-gradient(45deg, #000000, #ff1a1a)",
                boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)", // Efecto al pasar el cursor
              },
              transition: "all 0.3s ease", // Animación de transición
            }}
            startIcon={<CloudUploadIcon />}
          >
            Cargar Archivos
          </Button>
        </label>
      </Box>

      {/* Mostrar tamaño total de los archivos */}
      <Box sx={{ marginBottom: 2, textAlign: "center" }}>
        <Typography variant="body1" color="textSecondary">
          Tamaño total: {getTotalFileSizeInMB()} MB
        </Typography>
      </Box>

      {/* Listado de Archivos */}
      <List>
        {currentFiles.map((file, index) => (
          <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Vista previa de imagen si es una imagen */}
              {file.type.startsWith("image") && (
                <Avatar
                  sx={{ width: 40, height: 40, marginRight: 2 }}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                />
              )}
              <ListItemText primary={file.name} />
            </Box>
            <IconButton color="error" onClick={() => handleRemoveFile(file)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Paginación */}
      {totalPages > 1 && (
        <Box sx={{ textAlign: "center", marginTop: 2 }}>
          <Button
            variant="outlined"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          <Typography sx={{ display: "inline", marginX: 2 }}>
            Página {currentPage} de {totalPages}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
        </Box>
      )}

      {/* Botón para enviar archivos */}
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        {files.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendFiles}
            sx={{
              padding: "10px 20px",
              textTransform: "none",
              borderRadius: "30px",
              background: "linear-gradient(45deg, #ff1a1a, #000000)", // Degradado negro y rojo
              "&:hover": {
                background: "linear-gradient(45deg, #000000, #ff1a1a)",
                boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)", // Efecto al pasar el cursor
              },
              transition: "all 0.3s ease", // Animación de transición
            }}
          >
            Enviar Archivos
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Content;
