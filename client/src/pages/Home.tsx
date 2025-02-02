import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, Box, Typography, Avatar, Divider, Card, CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../components/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoIosConstruct } from "react-icons/io";

const drawerWidth = 240;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const fullName = user ? `${user.name} ${user.lastname}` : '';

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleUploadFiles = () => {
    navigate('/UploadFiles');
  };

  return (
    <Box sx={{ display: 'flex' }}>

      {/* AppBar con botón de menú */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#000', 
          color: '#fff',           
          transition: 'all 0.3s',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
          DocFM
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar animado */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#000', 
            color: '#fff',           
            transition: 'transform 0.3s ease-out',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>

          {/* Tarjeta de perfil animada */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#FF0000' }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {fullName}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          <Divider sx={{ backgroundColor: '#FF0000' }} />

          {/* Botón UploadFiles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <List>
              <ListItem button onClick={handleUploadFiles}>
                <ListItemIcon sx={{ color: '#FF0000' }}>
                  <CloudUploadIcon />
                </ListItemIcon>
                <ListItemText
                  primary="UploadFiles"
                  primaryTypographyProps={{ sx: { fontWeight: 600, color: '#fff' } }}
                />
              </ListItem>
            </List>
          </motion.div>
        </Box>
      </Drawer>

      {/* Contenido principal animado */}
      <Box component="main" 
      sx={{ 
        flexGrow: 1, 
        p: 3, 
        backgroundColor: '#111', 
        width: '1000px',  
        height: '600px',  
        marginRight: '40px', 
        borderRadius: '12px', 
        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.5)' 
      }}>
        <Toolbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#fff' }}>
            Building...<IoIosConstruct /> {fullName}
          </Typography>
        
        </motion.div>
      </Box>
    </Box>
  );
};

export default Home;
