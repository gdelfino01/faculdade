import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { SemifinishedResponseDTO, SemifinishedMaterialFullDTO } from '../../services/apis/odous-api/semifinisheds/dtos';

interface SemiAcabadoDetailsModalProps {
    open: boolean;
    onClose: () => void;
    semifinished: SemifinishedResponseDTO | null;
    allMaterials?: Array<{ id: number; name: string }>; // Adicionar materiais como prop
}

const isMaterialFullDetail = (mat: any): mat is SemifinishedMaterialFullDTO =>
    mat && mat.material && typeof mat.material === 'object';

const SemiAcabadoDetailsModal: React.FC<SemiAcabadoDetailsModalProps> = ({ 
    open, 
    onClose, 
    semifinished, 
    allMaterials = [] 
}) => {
    if (!semifinished) return null;

    const { sku, name, stockQuantity, requiredMaterials } = semifinished;

    // Função para buscar o nome do material
    const getMaterialName = (mat: any): string => {
        if (isMaterialFullDetail(mat)) {
            return mat.material.name;
        }
        
        // Se não tem o objeto material, buscar pelo materialId
        if (mat.materialId) {
            const material = allMaterials.find(m => m.id === mat.materialId);
            return material?.name || `Material ID: ${mat.materialId}`;
        }
        
        return 'Material Desconhecido';
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Detalhes do Semiacabado: {name}</DialogTitle>
            <DialogContent dividers>
                {/* Informações Gerais */}
                <Box mb={2}>
                    <Typography variant="h6">Informações Gerais</Typography>
                    <Typography><strong>SKU:</strong> {sku}</Typography>
                    <Typography><strong>Quantidade em Estoque:</strong> {stockQuantity}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Matérias-Primas Necessárias */}
                <Box mb={2}>
                    <Typography variant="h6">Matérias-Primas Necessárias</Typography>
                    {requiredMaterials && requiredMaterials.length > 0 ? (
                        <List dense>
                            {requiredMaterials.map((mat, idx) => (
                                <ListItem key={idx}>
                                    <ListItemText
                                        primary={getMaterialName(mat)}
                                        secondary={`Quantidade: ${mat.requiredQuantity}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>Nenhuma matéria-prima necessária.</Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Fechar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SemiAcabadoDetailsModal;