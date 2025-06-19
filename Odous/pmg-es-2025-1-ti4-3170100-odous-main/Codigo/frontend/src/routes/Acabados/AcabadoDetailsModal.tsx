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
import { FinishedResponseDTO, FinishedMaterialFullDTO, FinishedSemifinishedFullDTO } from '../../services/apis/odous-api/finisheds/dtos';
import { formatMoney } from '../../utils/formatMoney.ts';

interface AcabadoDetailsModalProps {
    open: boolean;
    onClose: () => void;
    acabado: FinishedResponseDTO | null;
}

const isMaterialFull = (mat: any): mat is FinishedMaterialFullDTO => mat && mat.material && typeof mat.material === 'object';
const isSemifinishedFull = (sf: any): sf is FinishedSemifinishedFullDTO => sf && sf.semifinished && typeof sf.semifinished === 'object';

const AcabadoDetailsModal: React.FC<AcabadoDetailsModalProps> = ({ open, onClose, acabado }) => {
    if (!acabado) {
        return null;
    }

    const {
        sku,
        name,
        price,
        stockQuantity,
        requiredMaterials,
        requiredSemifinisheds,
    } = acabado;

    console.log('Acabado Details:', acabado);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Detalhes do Acabado: {name}</DialogTitle>
            <DialogContent dividers>
                <Box mb={2}>
                    <Typography variant="h6">Informações Gerais</Typography>
                    <Typography><strong>SKU:</strong> {sku}</Typography>
                    <Typography><strong>Preço:</strong> {formatMoney(price)}</Typography>
                    <Typography><strong>Quantidade em Estoque:</strong> {stockQuantity}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={2}>
                    <Typography variant="h6">Matérias-Primas Necessárias</Typography>
                    {requiredMaterials && requiredMaterials.length > 0 ? (
                        <List dense>
                            {requiredMaterials.map((mat, index) => (
                                isMaterialFull(mat) ? (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={mat.material.name}
                                            secondary={`Quantidade: ${mat.requiredQuantity}`}
                                        />
                                    </ListItem>
                                ) : null
                            ))}
                        </List>
                    ) : (
                        <Typography>Nenhuma matéria-prima necessária.</Typography>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                    <Typography variant="h6">Semiacabados Necessários</Typography>
                    {requiredSemifinisheds && requiredSemifinisheds.length > 0 ? (
                        <List dense>
                            {requiredSemifinisheds.map((sf, index) => (
                                isSemifinishedFull(sf) ? (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={sf.semifinished.name}
                                            secondary={`Quantidade: ${sf.requiredQuantity}`}
                                        />
                                    </ListItem>
                                ) : null
                            ))}
                        </List>
                    ) : (
                        <Typography>Nenhum semiacabado necessário.</Typography>
                    )}
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AcabadoDetailsModal;