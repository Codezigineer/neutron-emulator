import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MultiView from "./MultiView";
import { useState } from 'react';

function App()
{

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

    const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
          <ListItem key={"Close"} disablePadding>
            <ListItemButton>
              <ListItemText primary={"Close"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Terminal"} disablePadding>
            <ListItemButton>
              <ListItemText primary={"Terminal"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Screen"} disablePadding>
            <ListItemButton>
              <ListItemText primary={"Screen"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"VMs"} disablePadding>
            <ListItemButton>
              <ListItemText primary={"VMs"} />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  return (
  <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          
        <IconButton
            onClick={toggleDrawer(true)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Neutron Emulator
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    <MultiView></MultiView>
    <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
  </>
  )
}

export default App;
