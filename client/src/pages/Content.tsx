import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Drawer,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CloudUpload as CloudUploadIcon, Info as InfoIcon } from "@mui/icons-material";
import Swal from "sweetalert2";

const Content = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState(0); // Tamaño total de los archivos en bytes
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const FILES_PER_PAGE = 4;
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
      {/* Panel de carga de archivos */}
      <Box
        sx={{
          width: "50%",
          padding: 3,
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Cargar Archivos
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Nota: El tamaño total de los archivos no debe exceder los {MAX_SIZE_MB} MB.
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Tamaño actual: {(totalSize / 1024 / 1024).toFixed(2)} MB
        </Typography>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept=".pdf, .doc, .docx, .txt, .jpg, .png, .jpeg, .zip"
          style={{ display: "none" }}
          id="file-upload"
        />
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

      {/* Panel de archivos subidos */}
      <Box sx={{width: "50%",  padding: 3}} >
        <Typography variant="h5" gutterBottom>
          Archivos Subidos
        </Typography>
        {currentFiles.length > 0 ? (
          <>
            <List>
              {currentFiles.map((file, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingY: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    {file.type.startsWith("image") && (
                      <Avatar
                        sx={{ width: 40, height: 40, marginRight: 2 }}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />
                    )}
                    <ListItemText
                      primaryTypographyProps={{
                        sx: {
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: { fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" },
                      }}
                      primary={file.name}
                      secondary={`Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    <IconButton
                      color="info"
                      onClick={() => handleOpenDrawer(file)}
                    >
                      <InfoIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFile(file)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Anterior
              </Button>
              <Typography display="inline" mx={2}>
                Página {currentPage} de {totalPages}
              </Typography>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Siguiente
              </Button>
            </Box>
          </>
        ) : (
          <Typography>No se han subido archivos.</Typography>
        )}
      </Box>

      {/* Drawer para detalles de archivos */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box sx={{ width: 300, padding: 3 }}>
          <Typography variant="h6">Detalles del Archivo</Typography>
          <Divider sx={{ marginY: 2 }} />
          {selectedFile && (
            <>
              <Typography>
                <b>Nombre:</b> {selectedFile.name}
              </Typography>
              <Typography>
                <b>Tamaño:</b> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              <Typography>
                <b>Tipo:</b> {selectedFile.type || "Desconocido"}
              </Typography>
              <Typography>
                <b>Última Modificación:</b>{" "}
                {selectedFile.lastModified
                  ? new Date(selectedFile.lastModified).toLocaleString()
                  : "Desconocida"}
              </Typography>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Content;
