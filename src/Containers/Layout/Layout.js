import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import PrivateRoute from '../../Components/Auth/PrivateRoute';
import {Link} from 'react-router-dom';

import Appointment from '../Appointment/Appointment';
import Home from '../../Containers/Home/Home';
import AppointmentSingle from '../../Containers/AppointmentSingle/AppointmentSingle';
import Bank from '../../Containers/Bank/Bank';
import Inventory from '../../Containers/Inventory/Inventory';
import MenuItem from '@mui/material/MenuItem';

import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useAuth } from '../../contexts/AuthContext';



const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const {currentUser, logout} = useAuth();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
            <Link to="/">
                <ListItem button>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Dashboard"} />
                </ListItem> 
            </Link>

            <Link to="/appointments">
                <ListItem button>
                        <ListItemIcon>
                            <AccessTimeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Appointments" />
                </ListItem> 
            </Link>
        </List>
        <Divider />

        <List>
            <Link to="/banks">
                <ListItem button>
                        <ListItemIcon>
                            <AccountBalanceIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Banks"} />
                </ListItem> 
            </Link>

            <Link to="/inventory">
                <ListItem button>
                        <ListItemIcon>
                            <ShoppingCartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Inventory" />
                </ListItem> 
            </Link>
        </List>

        <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >

            <MenuIcon />
          </IconButton>

            <Typography variant="h6" noWrap component="div">
              CarJutsu
            </Typography>
            
            {currentUser ? <div style={{display: 'flex', alignItems: 'center'}}>
              
              <Typography noWrap component="div" sx={{ flexGrow: 1 }}>
                {currentUser.email}
              </Typography>
              <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => {handleClose(); logout()}}>Signout</MenuItem>
                </Menu>
              </div>: null}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}

          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop:'3rem'}}>
        <div style={{overflowX: 'hidden'}}>
          <PrivateRoute exact path="/appointments/:id" component={AppointmentSingle} />
          <PrivateRoute exact path="/appointments" component={Appointment}/>
          <PrivateRoute exact path="/banks" component={Bank} />
          <PrivateRoute exact path="/inventory" component={Inventory} />
          <PrivateRoute exact path="/" component={Appointment}/>
        </div>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
