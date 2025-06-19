import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import GppBadIcon from '@mui/icons-material/GppBad';

const NotAuthorizedPage: React.FC = () => {
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
                    maxWidth: '550px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'error.main',
                    }}
                >
                    <GppBadIcon sx={{ fontSize: { xs: '60px', sm: '80px' } }} />
                </Box>

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        fontSize: { xs: '1.75rem', sm: '2.25rem' },
                        mb: 1.5,
                    }}
                >
                    Acesso Restrito
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: 4,
                        maxWidth: '450px',
                        lineHeight: 1.6,
                    }}
                >
                    Você está autenticado em nosso sistema, mas seu perfil de usuário não tem as permissões necessárias para visualizar esta página ou executar esta ação.
                    Se você acredita que deveria ter acesso, por favor, entre em contato com o administrador do sistema.
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
                    }}
                >
                    Voltar à página inicial
                </Button>
            </Box>
        </Box>
    );
};

export default NotAuthorizedPage;