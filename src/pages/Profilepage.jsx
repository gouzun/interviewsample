import React from 'react'
import { styled } from '@mui/system';


const Image = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    marginTop: theme.spacing(5), // Accessing theme.spacing dynamically
    boxShadow: '0px 4px 20px rgba(2, 2, 20, 0.2)', // Increased blurRadius and darker color


}));

const Profilepage = () => { 

  return (
    <>  
   
    <Image alt="Remy Sharp" src="https://res.cloudinary.com/drpsfwq3y/image/upload/v1698119563/personal/r_mo4ywt.png" />
  
    </>                      
  )
}

export default Profilepage