import React from 'react'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { getProjectList } from '../utils/firebase/firebase.utils'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { ConstructionOutlined } from '@mui/icons-material';



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();


const Propertiespage = () => {
    const [pList, setPList] = useState([]);

    useEffect(() => {

        async function fetch() {
            const list = await getProjectList();
            setPList(list);
            console.log(list);
        }

        fetch();

    }, [])

    return (
        <ThemeProvider theme={defaultTheme}>
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 1,
                        mt: 1,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Properties Available
                        </Typography>
                        <Stack
                            sx={{ pt: 0 }}
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                        >
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 4 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {pList.map((card) => (
                            <Grid item key={card.row} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0px 4px 20px rgba(2, 2, 20, 0.2)' }}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            // 16:9
                                            pt: '56.25%',
                                        }}
                                        image={card.imglink}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {card.name}
                                        </Typography>
                                        <div style={{ textAlign: 'left', fontSize: '14px', }}>

                                            <div>AREA : {card.area}</div>
                                            <div>SIZE: {card.size.toLocaleString('en-US')} SQFT</div>

                                            <div>PRICE: RM{card.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

                                        </div>
                                    </CardContent>
                                    <CardActions>                                       
                                        <Button size="small">Edit</Button>
                                        <Button size="small">Remove</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </ThemeProvider>
    )
}

export default Propertiespage