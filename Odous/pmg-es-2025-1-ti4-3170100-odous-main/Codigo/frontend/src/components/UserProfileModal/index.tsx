import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Avatar,
    Typography,
    Box,
    Divider,
    Grid,
    Chip,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Work as WorkIcon,
    CalendarToday as CalendarIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// IMPORT DO MODAL DE EDIÇÃO E API
import ModalForm from '../ModalForm';
import OdousApi from '../../services/apis/odous-api/odous-api';

interface UserProfileModalProps {
    open: boolean;
    onClose: () => void;
    user: {
        id: number;
        name: string;
        email: string;
        role?: string;
        avatar?: string;
        createdAt?: string;
        lastLogin?: string;
    } | null;
    onUserUpdate?: () => void; // CALLBACK PARA ATUALIZAR DADOS APÓS EDIÇÃO
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
    open,
    onClose,
    user,
    onUserUpdate
}) => {
    // ESTADOS PARA CONTROLAR O MODAL DE EDIÇÃO
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // INSTÂNCIA DA API
    const odousApi = React.useMemo(() => new OdousApi(), []);
    const { mutate: updateUser } = odousApi.users.putById();

    if (!user) return null;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleColor = (role?: string) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'error';
            case 'manager': return 'warning';
            case 'operator': return 'primary';
            default: return 'default';
        }
    };

    // CAMPOS PARA EDIÇÃO DO PERFIL (SEM ROLE, COM SENHA OPCIONAL)
    const profileEditFields = [
        { name: "name", label: "Nome", required: true, autoFocus: true },
        { name: "email", label: "Email", required: true },
        { 
            name: "password", 
            label: "Nova Senha (deixe em branco para manter a atual)", 
            type: "password", 
            required: false 
        },
    ];

    // FUNÇÃO PARA ABRIR O MODAL DE EDIÇÃO
    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    // FUNÇÃO PARA FECHAR O MODAL DE EDIÇÃO
    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    // FUNÇÃO PARA ATUALIZAR O PERFIL DO USUÁRIO
    const handleUpdateProfile = (formData: Record<string, string>) => {
        const { name, email, password } = formData;
        
        const updatedUser = {
            name,
            email,
            // APENAS INCLUIR SENHA SE FOI PREENCHIDA
            ...(password && password.trim() !== "" && { password }),
            // MANTER O ROLE ATUAL
            role: user.role as "admin" | "operator"
        };

        updateUser(
            { id: user.id, body: updatedUser },
            {
                onSuccess: () => {
                    toast.success("Seu perfil foi atualizado com sucesso!");
                    setIsEditModalOpen(false);
                    
                    // CHAMAR CALLBACK PARA ATUALIZAR OS DADOS
                    if (onUserUpdate) {
                        onUserUpdate();
                    }
                    
                    // FECHAR O MODAL DE PERFIL APÓS 1 SEGUNDO PARA MOSTRAR O SUCCESS
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                },
                onError: (error) => {
                    console.error("Erro ao atualizar perfil:", error);
                    toast.error("Erro ao atualizar seu perfil. Tente novamente.");
                },
            }
        );
    };

    return (
        <>
          <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
            sx={{
          "& .MuiPaper-root": {
            backgroundColor: "var(--modal-bg)",
            color: "var(--modal-text)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, color: "var(--modal-text)" }}>
              <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
              >
            <Typography variant="h6" sx={{ color: "var(--modal-text)" }}>
              Perfil do Usuário
            </Typography>
                <EditIcon 
                            sx={{ 
                                color: "primary.main", 
                                cursor: "pointer",
                                '&:hover': {
                                    color: 'primary.dark',
                                    transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onClick={handleEditClick}
                            titleAccess="Editar Perfil"
                        />
              </Box>
            </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              src={user.avatar}
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                bgcolor: "primary.main",
                fontSize: "2rem",
              }}
            >
              {!user.avatar && getInitials(user.name)}
            </Avatar>

            <Typography variant="h5" textAlign="center">
              {user.name}
            </Typography>

            {user.role && (
              <Chip
                label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                color={getRoleColor(user.role)}
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon sx={{ mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ color: "var(--modal-text)" }}
                  >
                    Email
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ color: "var(--modal-text)" }}
                  >
                    ID do Usuário
                  </Typography>
                  <Typography variant="body1">#{user.id}</Typography>
                </Box>
              </Box>
            </Grid>

            {user.createdAt && (
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarIcon sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "var(--modal-text)" }}
                    >
                      Membro desde
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {user.lastLogin && (
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={2}>
                  <WorkIcon sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Último acesso
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(user.lastLogin)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

            <DialogActions>
                   
              <Button onClick={onClose} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>

            {/* MODAL DE EDIÇÃO DO PERFIL */}
            <ModalForm
                open={isEditModalOpen}
                title="Editar Meu Perfil"
                description="Altere seus dados pessoais e clique em salvar."
                fields={profileEditFields}
                initialValues={{
                    name: user.name,
                    email: user.email,
                    password: "", // Sempre vazio para segurança
                }}
                onClose={handleEditModalClose}
                onSubmit={handleUpdateProfile}
                submitLabel="Salvar Alterações"
                cancelLabel="Cancelar"
            />
        </>
    );
};

export default UserProfileModal;