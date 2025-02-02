import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Drawer,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoIcon from "@mui/icons-material/Info";
import Swal from "sweetalert2";

const Content = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const FILES_PER_PAGE = 5;
  const MAX_SIZE_MB = 300;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const currentFiles = [...files, ...newFiles];
      const newTotalSize = currentFiles.reduce((sum, file) => sum + file.size, 0);

      if (newTotalSize > MAX_SIZE_MB * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Límite Excedido",
          text: `El tamaño total de los archivos no puede exceder los ${MAX_SIZE_MB} MB.`,
          confirmButtonColor: "#ff1a1a",
          timer: 2000, 
        timerProgressBar: true,
        showConfirmButton: false,
        });
        return;
      }

      setFiles(currentFiles);
      setTotalSize(newTotalSize);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    const updatedTotalSize = updatedFiles.reduce((sum, file) => sum + file.size, 0);

    setFiles(updatedFiles);
    setTotalSize(updatedTotalSize);

    if (selectedFile === fileToRemove) {
      setDrawerOpen(false);
      setSelectedFile(null);
    }
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
    setTotalSize(0);
    setDrawerOpen(false);
    setSelectedFile(null);
  };

  const handleOpenDrawer = (file: File) => {
    setSelectedFile(file);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedFile(null);
  };

  const indexOfLastFile = currentPage * FILES_PER_PAGE;
  const indexOfFirstFile = indexOfLastFile - FILES_PER_PAGE;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(files.length / FILES_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "90vh",
        width: "140vh",
        background: "linear-gradient(45deg, #333, #000)",
        color: "white",
        paddingY: 2,
      }}
    >
      {/* Sección de Carga de Archivos */}
      <Box
        sx={{
          width: "50%",
          padding: 3,
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontFamily: "Arial, sans-serif" }}>
          Cargar Archivos
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          sx={{ color: "rgba(255, 255, 255, 0.7)", fontFamily: "Arial, sans-serif" }}
        >
          Nota: El tamaño total de los archivos no debe exceder los {MAX_SIZE_MB} MB.
        </Typography>
        <Typography
          variant="body2"
          sx={{ marginBottom: 2, fontFamily: "Arial, sans-serif" }}
        >
          Tamaño actual: {(totalSize / 1024 / 1024).toFixed(2)} MB
        </Typography>
        <input type="file" multiple onChange={handleFileChange} style={{ display: "none" }} id="file-upload" />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ background: "#ff1a1a", color: "white" }}
          >
            Subir Archivos
          </Button>
        </label>
      </Box>

      {/* Sección de Archivos Subidos */}
      <Box sx={{ width: "50%", padding: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: "Arial, sans-serif" }}>
          Archivos Subidos
        </Typography>
        <Box sx={{ height: "50%", overflowY: "auto" }}>
          <List>
            {currentFiles.map((file, index) => (
              <ListItem
                key={index}
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Avatar
                  variant="circular"
                  src={URL.createObjectURL(file)}
                  sx={{ width: 48, height: 48, marginRight: 2 }}
                />
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontSize: "0.85rem", fontFamily: "Arial, sans-serif" }}>
                      {file.name}
                    </Typography>
                  }
                  secondary={`Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  sx={{ fontFamily: "Arial, sans-serif" }}
                />
                <Tooltip title="Ver Detalles">
                  <IconButton color="primary" onClick={() => handleOpenDrawer(file)}>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <IconButton color="error" onClick={() => handleRemoveFile(file)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Paginación y Botones */}
        {files.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                variant="outlined"
                sx={{ color: "white" }}
              >
                Anterior
              </Button>
              <Typography variant="body2" sx={{ fontFamily: "Arial, sans-serif" }}>
                Página {currentPage} de {totalPages}
              </Typography>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outlined"
                sx={{ color: "white" }}
              >
                Siguiente
              </Button>
            </Box>
            <Button
              variant="contained"
              color="error"
              sx={{ marginTop: 2 }}
              onClick={handleRemoveAllFiles}
            >
              Eliminar Todo
            </Button>
          </Box>
        )}
      </Box>

      {/* Drawer de Detalles del Archivo */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        {selectedFile && (
          <Box sx={{ width: 250, padding: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontFamily: "Arial, sans-serif" }}
            >
              Detalles del Archivo
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Typography variant="body2" sx={{ fontFamily: "Arial, sans-serif" }}>
              <strong>Nombre:</strong> {selectedFile.name}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "Arial, sans-serif" }}>
              <strong>Tamaño:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default Content;
