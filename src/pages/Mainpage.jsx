import React from 'react'
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Signinpage from './signinpage';
import Profilepage from './Profilepage';
import Propertiespage from './Propertiespage';
import Addproperty from './Addproperty';

const mainpage = () => {
    const pages = ['Properties Available', 'Add Property'];
    const settings = ['Profile', 'Logout'];
    const bgcolor = '#008cff';
    const [componentToRender, setComponentToRender] = useState(<Propertiespage />);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {

        setComponentToRender(<Signinpage />);
    }

    const handleProfile = () => {

        setComponentToRender(<Profilepage />);
    }

    const handleProperties = () => {
        setComponentToRender(<Propertiespage />);
    }
    const handleAdd = () =>{
        setComponentToRender(<Addproperty />);
    }

    return (<>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

            <AppBar position="static" sx={{ backgroundColor: bgcolor, borderRadius: '15px' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page) => {
                                    let component;
                                    switch (page) {
                                        case 'Properties Available':
                                            component = <MenuItem key={page} onClick={handleProperties}>
                                                <Typography textAlign="center">{page}</Typography>
                                            </MenuItem>;
                                            break;
                                        case 'Sold Properties':
                                            component = <MenuItem key={page} onClick={handleProfile}>
                                                <Typography textAlign="center">{page}</Typography>
                                            </MenuItem>;
                                            break;

                                        case 'Add Property':
                                            component = <MenuItem key={page} onClick={handleAdd}>
                                                <Typography textAlign="center">{page}</Typography>
                                            </MenuItem>;
                                            break;
                                        default:
                                            component = <></>;
                                    }
                                    return component;
                                })}
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => {
                                let component;
                                switch (page) {
                                    case 'Properties Available':
                                        component = <MenuItem key={page} onClick={handleProperties}>
                                            <Typography textAlign="center">{page}</Typography>
                                        </MenuItem>;
                                        break;
                                    case 'Sold Properties':
                                        component = <MenuItem key={page} onClick={handleProfile}>
                                            <Typography textAlign="center">{page}</Typography>
                                        </MenuItem>;
                                        break;
                                    case 'Add Property':
                                        component = <MenuItem key={page} onClick={handleAdd}>
                                            <Typography textAlign="center">{page}</Typography>
                                        </MenuItem>;
                                        break;
                                    default:
                                        component = <></>;
                                }
                                return component;
                            })}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="https://res.cloudinary.com/drpsfwq3y/image/upload/v1698118247/personal/14702501_10153908613436127_821533876990695081_n_h2qfby.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => {
                                    let component;
                                    switch (setting) {
                                        case 'Logout':
                                            component = <MenuItem key={setting} onClick={handleLogout}>
                                                <Typography textAlign="center">{setting}</Typography>
                                            </MenuItem>;
                                            break;
                                        case 'Profile':
                                            component = <MenuItem key={setting} onClick={handleProfile}>
                                                <Typography textAlign="center">{setting}</Typography>
                                            </MenuItem>;
                                            break;
                                        default:
                                            component = <></>;
                                    }

                                    return component;
                                })}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="xl" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

                {componentToRender}
            </Container>
        </div>
    </>

    )
}

export default mainpage