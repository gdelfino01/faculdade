import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoToDashboard = () => {
        navigate('/painel');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
                textAlign: 'center',
                py: 4,
                px: 2,
                backgroundColor: 'grey.100',
            }}
        >
            <Box
                sx={{
                    p: { xs: 3, sm: 5 },
                    backgroundColor: 'background.paper',
                    borderRadius: '12px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                    maxWidth: '500px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: { xs: 100, sm: 120 },
                        height: { xs: 100, sm: 120 },
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                    }}
                >
                    <SentimentVeryDissatisfiedIcon sx={{ fontSize: { xs: '60px', sm: '80px' } }} />
                </Box>

                <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        fontSize: { xs: '4rem', sm: '6rem' },
                        mb: 1,
                    }}
                >
                    404
                </Typography>

                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        fontWeight: 500,
                        mb: 1.5,
                        color: 'text.primary',
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                    }}
                >
                    Página Não Encontrada
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: 4,
                        maxWidth: '380px',
                        lineHeight: 1.6,
                    }}
                >
                    Lamentamos, mas a página que você tentou acessar não foi encontrada.
                    Pode ser que o link esteja quebrado ou a página tenha sido removida.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGoToDashboard}
                    sx={{
                        py: 1.5,
                        px: 5,
                        fontSize: '1rem',
                        fontWeight: 500,
                        borderRadius: '8px',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '&:hover': {
                            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                        }
                    }}
                >
                    Voltar à página inicial
                </Button>
            </Box>
        </Box>
    );
};

export default NotFoundPage;
