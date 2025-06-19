import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
    TextField, MenuItem, Box, List, ListItem, ListItemText, Typography, Divider
} from '@mui/material';
import { MultiSelectWithQuantity } from '../../components/MultiSelectWithQuantity';
import OdousApi from '../../services/apis/odous-api/odous-api';
import { FinishedLotResponseDTO, PostFinishedLotBodyDTO, UpdateFinishedLotPayloadDTO } from '../../services/apis/odous-api/finished-lots/dtos';
import { FinishedResponseDTO, FinishedMaterialFullDTO, FinishedSemifinishedFullDTO } from '../../services/apis/odous-api/finisheds/dtos';

const isMaterialFull = (mat: any): mat is FinishedMaterialFullDTO => mat && mat.material && typeof mat.material === 'object';
const isSemifinishedFull = (sf: any): sf is FinishedSemifinishedFullDTO => sf && sf.semifinished && typeof sf.semifinished === 'object';

interface AcabadoLoteModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: PostFinishedLotBodyDTO | UpdateFinishedLotPayloadDTO['body']) => void;
    lot: FinishedLotResponseDTO | null;
}

export default function AcabadoLoteModal({ open, onClose, onSubmit, lot }: AcabadoLoteModalProps) {
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [selectedFinishedGood, setSelectedFinishedGood] = useState<FinishedResponseDTO | null>(null);

    const odousApi = useMemo(() => new OdousApi(), []);

    const { data: allFinisheds = [] } = odousApi.finisheds.get({ params: { includeRequiredMaterials: 'FULL', includeRequiredSemifinisheds: 'FULL' } });
    const { data: allMaterialLots = [] } = odousApi.materialLots.get({ params: { onlyAvailable: true } });
    const { data: allSemifinishedLots = [] } = odousApi.semifinishedLots.get({ params: { onlyAvailable: true } });

    const { data: allStartedProductionOrders = [] } = odousApi.finishedProductionOrders.get({
        params: { status: 'STARTED' },
    });

    const { data: productionOrdersForSelected = [] } = odousApi.finishedProductionOrders.get({
        params: {
            status: lot ? undefined : 'STARTED',
            finishedId: selectedFinishedGood?.id,
        },
    });

    const finishedGoodsWithOpenOrders = useMemo(() => {
        const openOrderFinishedIds = new Set(allStartedProductionOrders.map(order => order.finishedId));
        if (lot?.finished.id) {
            openOrderFinishedIds.add(lot.finished.id);
        }
        return allFinisheds.filter(finished => openOrderFinishedIds.has(finished.id));
    }, [allFinisheds, allStartedProductionOrders, lot]);

    useEffect(() => {
        if (open) {
            if (lot) {
                const finished = allFinisheds.find(f => f.id === lot.finished.id) || null;
                setSelectedFinishedGood(finished);

                const mapConsumedLots = (items: any[] | undefined, idKey: string, itemKey: string) => {
                    if (!items) return {};
                    return Object.fromEntries(
                        items.map(item => [String(item[idKey] ?? item[itemKey]?.id), item.consumedQuantity])
                    );
                };

                setFormValues({
                    producedQuantityOK: lot.producedQuantityOK ?? '',
                    producedQuantityNG: lot.producedQuantityNG ?? '',
                    finishedId: lot.finished?.id ?? '',
                    finishedProductionOrderId: lot.finishedProductionOrder?.id ?? '',
                    consumedMaterialLots: mapConsumedLots(lot.consumedMaterialLots, 'materialLotId', 'materialLot'),
                    consumedSemifinishedLots: mapConsumedLots(lot.consumedSemifinishedLots, 'semifinishedLotId', 'semifinishedLot'),
                });
            } else {
                setFormValues({
                    producedQuantityOK: '', producedQuantityNG: '', finishedId: '',
                    finishedProductionOrderId: '', consumedMaterialLots: {}, consumedSemifinishedLots: {},
                });
                setSelectedFinishedGood(null);
            }
        }
    }, [open, lot, allFinisheds]);

    const handleFormChange = (name: string, value: any) => {
        const newFormValues = { ...formValues, [name]: value };
        setFormValues(newFormValues);

        if (name === 'finishedId') {
            const finished = allFinisheds.find(f => f.id === Number(value)) || null;
            setSelectedFinishedGood(finished);
            setFormValues({ ...newFormValues, finishedProductionOrderId: '' });
        }
    };

    const handleInternalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { producedQuantityOK, producedQuantityNG, finishedId, finishedProductionOrderId, consumedMaterialLots, consumedSemifinishedLots } = formValues;

        const formatConsumedLots = (items: Record<string, number>, idKey: 'materialLotId' | 'semifinishedLotId'): any[] => {
            if (!items) return [];
            return Object.entries(items).map(([id, quantity]) => ({ [idKey]: Number(id), consumedQuantity: Number(quantity) }));
        };

        const payload = {
            producedQuantityOK: Number(producedQuantityOK),
            producedQuantityNG: Number(producedQuantityNG),
            finishedId: Number(finishedId),
            finishedProductionOrderId: Number(finishedProductionOrderId),
            consumedMaterialLots: formatConsumedLots(consumedMaterialLots, 'materialLotId'),
            consumedSemifinishedLots: formatConsumedLots(consumedSemifinishedLots, 'semifinishedLotId'),
        };

        onSubmit(payload);
    };

    const fields = [
        {
            name: 'finishedId',
            label: 'Produto Acabado (com OPs em aberto)',
            required: true,
            type: 'select',
            options: finishedGoodsWithOpenOrders.map((f) => ({ value: f.id, label: f.name })),
        },
        {
            name: 'finishedProductionOrderId',
            label: 'Ordem de Produção Associada',
            required: true,
            type: 'select',
            options: productionOrdersForSelected.map((order) => ({ value: order.id, label: `OP-${order.id} (Meta: ${order.goalQuantity})` })),
            disabled: !selectedFinishedGood,
        },
        { name: 'producedQuantityOK', label: 'Quantidade Produzida (OK)', required: true, type: 'number' },
        { name: 'producedQuantityNG', label: 'Quantidade Produzida (NG)', required: true, type: 'number' },
        { name: 'consumedMaterialLots', label: 'Lotes de Material Consumidos', required: false, type: 'multiSelectWithQuantity', options: allMaterialLots.map((ml) => ({ value: String(ml.id), label: `${ml.material?.name} (Lote: ${ml.invoiceCode}, Disp: ${ml.availableQuantity})` })) },
        { name: 'consumedSemifinishedLots', label: 'Lotes de Semiacabado Consumidos', required: false, type: 'multiSelectWithQuantity', options: allSemifinishedLots.map((sl) => ({ value: String(sl.id), label: `${sl.semifinished?.name} (Lote: ${sl.sku}, Disp: ${sl.availableQuantity})` })) }
    ];

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form', onSubmit: handleInternalSubmit }} fullWidth maxWidth="sm">
            <DialogTitle>{lot ? 'Editar Lote de Acabado' : 'Novo Lote de Acabado'}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {lot ? 'Altere os dados do lote.' : 'Preencha os dados para criar um novo lote.'}
                </DialogContentText>

                {fields.map((field) => {
                    const commonProps = { key: field.name, name: field.name, label: field.label, required: field.required, fullWidth: true, margin: 'dense' as 'dense', disabled: field.disabled };
                    if (field.type === 'select') {
                        return (<TextField {...commonProps} select value={formValues[field.name] || ''} onChange={(e) => handleFormChange(field.name, e.target.value)}>
                            {field.options?.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                        </TextField>
                        );
                    }
                    if (field.type === 'multiSelectWithQuantity') {
                        return (<MultiSelectWithQuantity key={field.name} label={field.label} name={field.name} options={(field.options || []).map(opt => ({ ...opt, value: String(opt.value) }))} defaultValue={formValues[field.name] || {}} onChange={(val) => handleFormChange(field.name, val)} />);
                    }
                    return (<TextField {...commonProps} type={field.type || 'text'} value={formValues[field.name] || ''} onChange={(e) => handleFormChange(field.name, e.target.value)} />);
                })}

                {selectedFinishedGood && (
                    <Box mt={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                        <Typography variant="h6" gutterBottom>Componentes para: {selectedFinishedGood.name}</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle1">Materiais Necessários:</Typography>
                        {selectedFinishedGood.requiredMaterials?.length && selectedFinishedGood.requiredMaterials.length > 0 ? (
                            <List dense>
                                {selectedFinishedGood.requiredMaterials?.map((mat, index) => isMaterialFull(mat) && (
                                    <ListItem key={index}><ListItemText primary={`${mat.material.name} (Qtd: ${mat.requiredQuantity})`} /></ListItem>
                                ))}
                            </List>
                        ) : <Typography variant="body2">Nenhum</Typography>}

                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Semiacabados Necessários:</Typography>
                        {selectedFinishedGood.requiredSemifinisheds?.length && selectedFinishedGood.requiredSemifinisheds.length > 0 ? (
                            <List dense>
                                {selectedFinishedGood.requiredSemifinisheds?.map((sf, index) => isSemifinishedFull(sf) && (
                                    <ListItem key={index}><ListItemText primary={`${sf.semifinished.name} (Qtd: ${sf.requiredQuantity})`} /></ListItem>
                                ))}
                            </List>
                        ) : <Typography variant="body2">Nenhum</Typography>}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancelar</Button>
                <Button type="submit" variant="contained">{lot ? 'Salvar' : 'Criar'}</Button>
            </DialogActions>
        </Dialog>
    );
}
