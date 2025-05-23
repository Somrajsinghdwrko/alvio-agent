import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Box, Skeleton, Stack, ToggleButton, ToggleButtonGroup, TextField, InputAdornment, Typography, Divider } from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'
import { gridSpacing } from '@/store/constant'
import WorkflowEmptySVG from '@/assets/images/workflow_empty.svg'
import LoginDialog from '@/ui-component/dialog/LoginDialog'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import { FlowListTable } from '@/ui-component/table/FlowListTable'
import { StyledButton } from '@/ui-component/button/StyledButton'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'

// API
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'

// const
import { baseURL } from '@/store/constant'

// icons
import { IconPlus, IconLayoutGrid, IconList, IconMicrophone, IconPaperclip, IconCode, IconSend, IconBolt } from '@tabler/icons-react'

// ==============================|| CHATFLOWS ||============================== //

const GradientText = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(90deg, #8D36F9, #C837AB)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 800,
    fontSize: '48px',
    textAlign: 'center',
    marginTop: '40px',
    textShadow: '0 0 20px rgba(141, 54, 249, 0.2)'
}))

const ChatInput = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.darkLevel1 : theme.palette.grey[100],
        borderRadius: '12px',
        padding: '12px 16px',
        '& fieldset': {
            border: 'none'
        },
        '&:hover fieldset': {
            border: 'none'
        },
        '&.Mui-focused fieldset': {
            border: 'none'
        }
    }
}))

const SendButton = styled(StyledButton)(({ theme }) => ({
    minWidth: '42px',
    height: '42px',
    borderRadius: '50%',
    padding: 0,
    background: 'linear-gradient(135deg, #8D36F9, #C837AB)',
    color: theme.palette.common.white,
    boxShadow: '0 4px 10px rgba(141, 54, 249, 0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #7926E8, #B7269A)',
        boxShadow: '0 6px 15px rgba(141, 54, 249, 0.4)'
    }
}))

const ActionButton = styled(Box)(({ theme }) => ({
    minWidth: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700],
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
    }
}))

const SuggestionCard = styled(Box)(({ theme }) => ({
    padding: '15px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: theme.palette.mode === 'dark' ? theme.palette.darkLevel3 : theme.palette.grey[100],
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        background: theme.palette.mode === 'dark' ? theme.palette.darkLevel2 : theme.palette.grey[200],
        transform: 'translateY(-2px)'
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: theme.palette.mode === 'dark' ? 0.7 : 0.3,
        pointerEvents: 'none'
    },
    '&:hover .suggestion-gradient': {
        opacity: 1
    },
    '& .content': {
        position: 'relative',
        zIndex: 2
    },
    '& .suggestion-gradient': {
        position: 'absolute',
        inset: 0,
        opacity: 0.3,
        transition: 'opacity 0.3s ease',
        '& .top-right': {
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(141, 54, 249, 0.5), transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(20%, -20%)',
            filter: 'blur(20px)'
        },
        '& .bottom-left': {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(200, 55, 171, 0.5), transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(-20%, 20%)',
            filter: 'blur(20px)'
        }
    }
}))

const FeatureCard = styled(Box)(({ theme }) => ({
    padding: '20px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    background: theme.palette.mode === 'dark' ? theme.palette.darkLevel3 : theme.palette.background.paper,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
        background: theme.palette.mode === 'dark' ? theme.palette.darkLevel2 : theme.palette.grey[100],
        borderColor: theme.palette.primary.main,
        transform: 'translateY(-2px)'
    }
}))

const LightningBoltIcon = styled(Box)(({ theme }) => ({
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.mode === 'dark' ? 'rgba(141, 54, 249, 0.2)' : 'rgba(141, 54, 249, 0.1)',
    color: theme.palette.mode === 'dark' ? '#9B5DE5' : '#8D36F9',
    marginRight: '8px'
}))

const Chatflows = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [loginDialogProps, setLoginDialogProps] = useState({})
    const [message, setMessage] = useState('')

    const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows)
    const [view, setView] = useState(localStorage.getItem('flowDisplayStyle') || 'card')

    const handleChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('flowDisplayStyle', nextView)
        setView(nextView)
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }
    
    const handleMessageChange = (event) => {
        setMessage(event.target.value)
    }
    
    const sendMessage = () => {
        if (!message.trim()) return
        // Handle message sending logic
        console.log('Sending message:', message)
        setMessage('')
    }

    const useSuggestion = (suggestion) => {
        setMessage(suggestion)
    }

    function filterFlows(data) {
        return (
            data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (data.category && data.category.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
            data.id.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
    }

    const onLoginClick = (username, password) => {
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        navigate(0)
    }

    const addNew = () => {
        navigate('/canvas')
    }

    const goToCanvas = (selectedChatflow) => {
        navigate(`/canvas/${selectedChatflow.id}`)
    }
    
    useEffect(() => {
        getAllChatflowsApi.request()
            .catch(err => {
                console.error('Failed to fetch chatflows:', err);
                setLoading(false);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getAllChatflowsApi.error) {
            if (getAllChatflowsApi.error?.response?.status === 401) {
                setLoginDialogProps({
                    title: 'Login',
                    confirmButtonName: 'Login'
                })
                setLoginDialogOpen(true)
            } else {
                setError(getAllChatflowsApi.error)
            }
        }
    }, [getAllChatflowsApi.error])

    useEffect(() => {
        setLoading(getAllChatflowsApi.loading)
    }, [getAllChatflowsApi.loading])

    useEffect(() => {
        if (getAllChatflowsApi.data) {
            try {
                const chatflows = getAllChatflowsApi.data
                console.log('Chatflows data loaded:', chatflows, 'Length:', chatflows.length)
                const images = {}
                for (let i = 0; i < chatflows.length; i += 1) {
                    const flowDataStr = chatflows[i].flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[chatflows[i].id] = []
                    for (let j = 0; j < nodes.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                        if (!images[chatflows[i].id].includes(imageSrc)) {
                            images[chatflows[i].id].push(imageSrc)
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error('Error processing chatflows data:', e)
            }
        } else {
            console.log('No chatflows data available')
        }
    }, [getAllChatflowsApi.data])

    const suggestedPrompts = [
        {
            title: 'Tell me a fun fact',
            description: 'about the Roman Empire',
            type: 'fun'
        },
        {
            title: 'Give me ideas',
            description: 'for what to do with my kids\' art',
            type: 'ideas'
        },
        {
            title: 'Grammar check',
            description: 'rewrite it for better readability',
            type: 'grammar'
        },
        {
            title: 'Show me a code snippet',
            description: 'of a website\'s sticky header',
            type: 'code'
        }
    ]
    
    return (
        <MainCard sx={{ height: '100%' }}>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3, height: '100%' }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                            <Box sx={{ position: 'relative', width: 100, height: 100 }}>
                                <Box 
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        animation: 'pulse 1.5s infinite ease-in-out',
                                        background: 'radial-gradient(circle, rgba(141, 54, 249, 0.5), transparent 70%)',
                                        borderRadius: '50%',
                                        '@keyframes pulse': {
                                            '0%': { opacity: 0.6, transform: 'scale(0.8)' },
                                            '50%': { opacity: 1, transform: 'scale(1.2)' },
                                            '100%': { opacity: 0.6, transform: 'scale(0.8)' }
                                        }
                                    }}
                                />
                            </Box>
                            <Typography variant="h6" sx={{ mt: 2, color: '#8D36F9' }}>
                                Loading...
                            </Typography>
                        </Box>
                    ) : (!getAllChatflowsApi.data || getAllChatflowsApi.data.length === 0) ? (
                        <Box 
                            sx={{ 
                                height: '100%', 
                                width: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: theme.palette.mode === 'dark' 
                                    ? 'linear-gradient(to bottom right, rgba(66, 66, 86, 0.7), rgba(33, 33, 43, 0.7))' 
                                    : 'linear-gradient(to bottom right, rgba(240, 240, 250, 0.7), rgba(230, 230, 240, 0.7))',
                                borderRadius: '16px',
                                padding: '40px 20px'
                            }}
                        >
                            <Typography 
                                variant="h1" 
                                sx={{ 
                                    fontSize: { xs: '36px', sm: '48px', md: '56px' }, 
                                    fontWeight: 800,
                                    mb: 2,
                                    color: theme.palette.mode === 'dark' ? '#fff' : '#4A0072',
                                    textAlign: 'center'
                                }}
                            >
                                Welcome to AlvioAgent
                            </Typography>
                            
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    textAlign: 'center', 
                                    mb: 6, 
                                    maxWidth: '800px',
                                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                    fontWeight: 'normal',
                                    lineHeight: 1.6
                                }}
                            >
                                Your AI-Powered Agent Builder platform. Create intelligent virtual agents for enterprise and tech-savvy users with our intuitive, futuristic interface.
                            </Typography>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' }, 
                                gap: 4, 
                                mb: 6,
                                width: '100%',
                                maxWidth: '800px',
                                justifyContent: 'center'
                            }}>
                                <Box 
                                    onClick={() => navigate('/chatflows')} 
                                    sx={{ 
                                        width: { xs: '100%', sm: '240px' }, 
                                        aspectRatio: '1/1',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fff',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                                        }
                                    }}
                                >
                                    <Box 
                                        sx={{ 
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(255, 116, 0, 0.1)',
                                            color: '#FF7400',
                                            mb: 2
                                        }}
                                    >
                                        <IconBolt size={30} />
                                        </Box>
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            fontWeight: 600, 
                                            mb: 1,
                                            color: theme.palette.mode === 'dark' ? '#fff' : '#333'
                                        }}
                                    >
                                        AI Agents
                                    </Typography>
                                </Box>
                                
                                <Box 
                                    onClick={() => navigate('/agentflows')} 
                                    sx={{ 
                                        width: { xs: '100%', sm: '240px' }, 
                                        aspectRatio: '1/1',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fff',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                                        }
                                    }}
                                >
                                    <Box 
                                        sx={{ 
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(255, 0, 130, 0.1)',
                                            color: '#FF0082',
                                            mb: 2
                                        }}
                                    >
                                        <IconList size={30} />
                                    </Box>
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            fontWeight: 600, 
                                            mb: 1,
                                            color: theme.palette.mode === 'dark' ? '#fff' : '#333'
                                        }}
                                    >
                                        Workflows
                                    </Typography>
                                    </Box>
                                </Box>
                                
                                    <StyledButton 
                                variant="contained"
                                onClick={() => navigate('/canvas')}
                                        startIcon={<IconPlus size={18} />}
                                sx={{
                                    borderRadius: '30px',
                                    px: 5,
                                    py: 1.5,
                                    background: theme.palette.mode === 'dark' 
                                        ? 'linear-gradient(135deg, #FF7400, #FF5A00)' 
                                        : 'linear-gradient(135deg, #FF7400, #FF5A00)',
                                    color: '#fff',
                                    boxShadow: '0 5px 15px rgba(255, 116, 0, 0.3)',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FF5A00, #FF4500)',
                                        boxShadow: '0 8px 25px rgba(255, 116, 0, 0.4)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                                    >
                                        Build Your Agent
                                    </StyledButton>
                                </Box>
                    ) : (
                        <>
                    <ViewHeader
                        onSearchChange={onSearchChange}
                        search={true}
                        searchPlaceholder='Search Name or Category'
                        title='Chatflows'
                        description='Build single-agent systems, chatbots and simple LLM flows'
                    >
                        <ToggleButtonGroup
                            sx={{ borderRadius: 2, maxHeight: 40 }}
                            value={view}
                            color='primary'
                            exclusive
                            onChange={handleChange}
                        >
                            <ToggleButton
                                sx={{
                                    borderColor: theme.palette.grey[900] + 25,
                                    borderRadius: 2,
                                    color: theme?.customization?.isDarkMode ? 'white' : 'inherit'
                                }}
                                variant='contained'
                                value='card'
                                title='Card View'
                            >
                                <IconLayoutGrid />
                            </ToggleButton>
                            <ToggleButton
                                sx={{
                                    borderColor: theme.palette.grey[900] + 25,
                                    borderRadius: 2,
                                    color: theme?.customization?.isDarkMode ? 'white' : 'inherit'
                                }}
                                variant='contained'
                                value='list'
                                title='List View'
                            >
                                <IconList />
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <StyledButton variant='contained' onClick={addNew} startIcon={<IconPlus />} sx={{ 
                            borderRadius: 2, 
                            height: 40,
                            background: 'linear-gradient(135deg, #8D36F9, #C837AB)',
                            boxShadow: '0 4px 10px rgba(141, 54, 249, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #7926E8, #B7269A)',
                                boxShadow: '0 6px 15px rgba(141, 54, 249, 0.4)'
                            }
                        }}>
                            Add New
                        </StyledButton>
                    </ViewHeader>
                    {!view || view === 'card' ? (
                        <>
                            {isLoading && !getAllChatflowsApi.data ? (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    <Skeleton variant='rounded' height={160} />
                                    <Skeleton variant='rounded' height={160} />
                                    <Skeleton variant='rounded' height={160} />
                                </Box>
                            ) : (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    {getAllChatflowsApi.data?.filter(filterFlows).map((data, index) => (
                                        <ItemCard key={index} onClick={() => goToCanvas(data)} data={data} images={images[data.id]} />
                                    ))}
                                </Box>
                            )}
                        </>
                    ) : (
                        <FlowListTable
                            data={getAllChatflowsApi.data}
                            images={images}
                            isLoading={isLoading}
                            filterFunction={filterFlows}
                            updateFlowsApi={getAllChatflowsApi}
                            setError={setError}
                        />
                    )}
                        </>
                    )}
                </Stack>
            )}

            <LoginDialog show={loginDialogOpen} dialogProps={loginDialogProps} onConfirm={onLoginClick} />
            <ConfirmDialog />
        </MainCard>
    )
}

export default Chatflows
