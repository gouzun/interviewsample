import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const Addproperty = () => {
    return (
        <Stack spacing={2} maxWidth="xs">
            <Typography variant="h5" >
                Add New Property
            </Typography>
            <TextField id="NAME" label="NAME" variant="outlined" sx={{ width: '50%',textAlign: 'center' }} />
            <TextField id="PRICE" label="PRICE" variant="outlined" sx={{ width: '50%' }}/>
            <TextField id="SIZE" label="SIZE" variant="outlined" sx={{ width: '50%' }}/>
            <TextField id="AREA" label="AREA" variant="outlined" sx={{ width: '50%' }}/>
            <TextField id="ADDRESS" label="ADDRESS" variant="outlined" />
            <TextField id="IMAGE" label="IMAGE" variant="outlined" />
        </Stack>
    )
}

export default Addproperty