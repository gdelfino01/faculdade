import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
    TextField, MenuItem, Box, List, ListItem, ListItemText, Typography, Divider
} from '@mui/material';
import { MultiSelectWithQuantity } from '../../components/MultiSelectWithQuantity';
import OdousApi from '../../services/apis/odous-api/odous-api';
import { SemifinishedLotResponseDTO, PostSemifinishedLotBodyDTO, UpdateSemifinishedLotPayloadDTO } from '../../services/apis/odous-api/semifinished-lots/dtos';
import { SemifinishedResponseDTO, SemifinishedMaterialFullDTO } from '../../services/apis/odous-api/semifinisheds/dtos';

const isMaterialFull = (mat: any): mat is SemifinishedMaterialFullDTO => 
    mat && mat.material && typeof mat.material === 'object';

interface LotesSemiAcabadoDetailsModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: PostSemifinishedLotBodyDTO | UpdateSemifinishedLotPayloadDTO['body']) => void;
    lot: SemifinishedLotResponseDTO | null;
}

export default function LotesSemiAcabadoDetailsModal({ open, onClose, onSubmit, lot }: LotesSemiAcabadoDetailsModalProps) {
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [selectedSemifinished, setSelectedSemifinished] = useState<SemifinishedResponseDTO | null>(null);

    const odousApi = useMemo(() => new OdousApi(), []);

    const { data: allSemifinisheds = [] } = odousApi.semiFinisheds.get({ 
        params: { includeRequiredMaterials: 'FULL' } 
    });
    const { data: allMaterialLots = [] } = odousApi.materialLots.get({ 
        params: { onlyAvailable: true } 
    });

    const { data: allStartedProductionOrders = [] } = odousApi.semifinishedProductionOrders.get({
        params: { status: 'STARTED' },
    });

    const { data: productionOrdersForSelected = [] } = odousApi.semifinishedProductionOrders.get({
        params: {
            status: lot ? undefined : 'STARTED',
            semifinishedId: selectedSemifinished?.id,
        },
    });

    const semifinishedsWithOpenOrders = useMemo(() => {
        const openOrderSemifinishedIds = new Set(allStartedProductionOrders.map(order => order.semifinishedId));
        if (lot?.semifinished.id) {
            openOrderSemifinishedIds.add(lot.semifinished.id);
        }
        return allSemifinisheds.filter(semifinished => openOrderSemifinishedIds.has(semifinished.id));
    }, [allSemifinisheds, allStartedProductionOrders, lot]);

    useEffect(() => {
        if (open) {
            if (lot) {
                const semifinished = allSemifinisheds.find(sf => sf.id === lot.semifinished.id) || null;
                setSelectedSemifinished(semifinished);

                const mapConsumedLots = (items: any[] | undefined, idKey: string, itemKey: string) => {
                    if (!items) return {};
                    return Object.fromEntries(
                        items.map(item => [String(item[idKey] ?? item[itemKey]?.id), item.consumedQuantity])
                    );
                };

                setFormValues({
                    producedQuantityOK: lot.producedQuantityOK ?? '',
                    producedQuantityNG: lot.producedQuantityNG ?? '',
                    semifinishedId: lot.semifinished?.id ?? '',
                    semifinishedProductionOrderId: lot.semifinishedProductionOrder?.id ?? '',
                    consumedMaterialLots: mapConsumedLots(lot.consumedMaterialLots, 'materialLotId', 'materialLot'),
                });
            } else {
                setFormValues({
                    producedQuantityOK: '', 
                    producedQuantityNG: '', 
                    semifinishedId: '',
                    semifinishedProductionOrderId: '', 
                    consumedMaterialLots: {},
                });
                setSelectedSemifinished(null);
            }
        }
    }, [open, lot, allSemifinisheds]);

    const handleFormChange = (name: string, value: any) => {
        const newFormValues = { ...formValues, [name]: value };
        setFormValues(newFormValues);

        if (name === 'semifinishedId') {
            const semifinished = allSemifinisheds.find(sf => sf.id === Number(value)) || null;
            setSelectedSemifinished(semifinished);
            setFormValues({ ...newFormValues, semifinishedProductionOrderId: '' });
        }
    };

    const handleInternalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { 
            producedQuantityOK, 
            producedQuantityNG, 
            semifinishedId, 
            semifinishedProductionOrderId, 
            consumedMaterialLots 
        } = formValues;

        const formatConsumedLots = (items: Record<string, number>): any[] => {
            if (!items) return [];
            return Object.entries(items).map(([id, quantity]) => ({ 
                materialLotId: Number(id), 
                consumedQuantity: Number(quantity) 
            }));
        };

        const payload = {
            producedQuantityOK: Number(producedQuantityOK),
            producedQuantityNG: Number(producedQuantityNG),
            semifinishedId: Number(semifinishedId),
            semifinishedProductionOrderId: Number(semifinishedProductionOrderId),
            consumedMaterialLots: formatConsumedLots(consumedMaterialLots),
        };

        onSubmit(payload);
    };

    const fields = [
        {
            name: 'semifinishedId',
            label: 'Semiacabado (com OPs em aberto)',
            required: true,
            type: 'select',
            options: semifinishedsWithOpenOrders.map((sf) => ({ 
                value: sf.id, 
                label: `${sf.name} (SKU: ${sf.sku})` 
            })),
        },
        {
            name: 'semifinishedProductionOrderId',
            label: 'Ordem de Produção Associada',
            required: true,
            type: 'select',
            options: productionOrdersForSelected.map((order) => ({ 
                value: order.id, 
                label: `OP-${order.id} (Meta: ${order.goalQuantity})` 
            })),
            disabled: !selectedSemifinished,
        },
        { 
            name: 'producedQuantityOK', 
            label: 'Quantidade Produzida (OK)', 
            required: true, 
            type: 'number' 
        },
        { 
            name: 'producedQuantityNG', 
            label: 'Quantidade Produzida (NG)', 
            required: true, 
            type: 'number' 
        },
        { 
            name: 'consumedMaterialLots', 
            label: 'Lotes de Material Consumidos', 
            required: false, 
            type: 'multiSelectWithQuantity', 
            options: allMaterialLots.map((ml) => ({ 
                value: String(ml.id), 
                label: `${ml.material?.name} (Lote: ${ml.invoiceCode}, Disp: ${ml.availableQuantity})` 
            })) 
        },
    ];

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{ component: 'form', onSubmit: handleInternalSubmit }} 
            fullWidth 
            maxWidth="sm"
        >
            <DialogTitle>
                {lot ? 'Editar Lote de Semiacabado' : 'Novo Lote de Semiacabado'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {lot 
                        ? 'Altere os dados do lote.' 
                        : 'Preencha os dados para criar um novo lote.'
                    }
                </DialogContentText>

                {fields.map((field) => {
                    const commonProps = { 
                        key: field.name, 
                        name: field.name, 
                        label: field.label, 
                        required: field.required, 
                        fullWidth: true, 
                        margin: 'dense' as 'dense', 
                        disabled: field.disabled 
                    };

                    if (field.type === 'select') {
                        return (
                            <TextField 
                                {...commonProps} 
                                select 
                                value={formValues[field.name] || ''} 
                                onChange={(e) => handleFormChange(field.name, e.target.value)}
                            >
                                {field.options?.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        );
                    }

                    if (field.type === 'multiSelectWithQuantity') {
                        return (
                            <MultiSelectWithQuantity 
                                key={field.name} 
                                label={field.label} 
                                name={field.name} 
                                options={(field.options || []).map(opt => ({ 
                                    ...opt, 
                                    value: String(opt.value) 
                                }))} 
                                defaultValue={formValues[field.name] || {}} 
                                onChange={(val) => handleFormChange(field.name, val)} 
                            />
                        );
                    }

                    return (
                        <TextField 
                            {...commonProps} 
                            type={field.type || 'text'} 
                            value={formValues[field.name] || ''} 
                            onChange={(e) => handleFormChange(field.name, e.target.value)} 
                        />
                    );
                })}

                {selectedSemifinished && (
                    <Box mt={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                        <Typography variant="h6" gutterBottom>
                            Componentes para: {selectedSemifinished.name}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Typography variant="subtitle1">Materiais Necessários:</Typography>
                        {selectedSemifinished.requiredMaterials?.length && 
                         selectedSemifinished.requiredMaterials.length > 0 ? (
                            <List dense>
                                {selectedSemifinished.requiredMaterials?.map((mat, index) => 
                                    isMaterialFull(mat) && (
                                        <ListItem key={index}>
                                            <ListItemText 
                                                primary={`${mat.material.name} (Qtd: ${mat.requiredQuantity})`} 
                                            />
                                        </ListItem>
                                    )
                                )}
                            </List>
                        ) : (
                            <Typography variant="body2">Nenhum</Typography>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button type="submit" variant="contained">
                    {lot ? 'Salvar' : 'Criar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}