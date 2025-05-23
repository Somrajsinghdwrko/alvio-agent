import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

// ==============================|| ALVIO LOGO ||============================== //

// Gradient styled text component for ALVIO logo
const GradientText = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FFD166, #EF476F, #9B5DE5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 700,
    fontSize: '32px',
    letterSpacing: 1
}))

const Logo = () => {
    const customization = useSelector((state) => state.customization)

    return (
        <Box sx={{ display: 'flex', alignItems: 'center',}}>
            <Box 
                sx={{ 
                    width: 40, 
                    height: 40, 
                    background: 'linear-gradient(45deg, #9B5DE5, #EF476F, #FFD166)', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                }}
            >
                <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '24px' }}>A</Typography>
            </Box>
            <GradientText>ALVIO</GradientText>
        </Box>
    )
}

export default Logo
