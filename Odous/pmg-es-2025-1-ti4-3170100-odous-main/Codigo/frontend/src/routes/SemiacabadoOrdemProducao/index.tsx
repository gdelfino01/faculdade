import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import * as Styled from './styles.ts';

import PageTitle from '../../components/PageTitle/index.tsx';
import DataTable from '../../components/DataTable/index.tsx';
import LoadingState from '../../components/LoadingState/index.tsx';
import ErrorState from '../../components/ErrorState/index.tsx';
import EmptyState from '../../components/EmptyState/index.tsx';
import ModalForm from '../../components/ModalForm/index.tsx';
import SearchBar from '../../components/SearchBar/index.tsx';
import ConfirmationModal from '../../components/ConfirmationModal/index.tsx';

import OdousApi from '../../services/apis/odous-api/odous-api.ts';
import { SemifinishedProductionOrderResponseDTO } from '../../services/apis/odous-api/semifinished-production-orders/dtos.ts';

export default function SemiacabadoOrdemProducao() {
    const [rows, setRows] = useState<SemifinishedProductionOrderResponseDTO[]>([]);
    const [filteredRows, setFilteredRows] = useState<SemifinishedProductionOrderResponseDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<SemifinishedProductionOrderResponseDTO | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const odousApi = useMemo(() => new OdousApi(), []);

    const {
        data: allOrders,
        isLoading,
        isError,
        error,
        refetch: refetchOrders
    } = odousApi.semifinishedProductionOrders.get({});

    const { data: allSemiFinisheds = [] } = odousApi.semiFinisheds.get({});

    const { mutate: createOrder } = odousApi.semifinishedProductionOrders.post();
    const { mutate: updateOrder } = odousApi.semifinishedProductionOrders.putById();
    const { mutate: deleteOrder } = odousApi.semifinishedProductionOrders.deleteById();

    useEffect(() => {
        if (!allOrders) return;
        setRows(allOrders.map(order => ({
            ...order,
            semifinishedName: allSemiFinisheds.find(sf => sf.id === order.semifinishedId)?.name || 'Desconhecido',
            lotSku: order.semifinishedLot?.sku || 'N/A',
            translatedStatus: {
                ISSUED: 'Emitida',
                STARTED: 'Iniciada',
                FINISHED: 'Finalizada',
                CANCELED: 'Cancelada',
            }[order.status] || 'Desconhecido',
        })));
        setFilteredRows(allOrders);
    }, [allOrders, allSemiFinisheds]);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = rows.filter((row) => {
            const semifinished = allSemiFinisheds.find(sf => sf.id === row.semifinishedId);
            return (
                semifinished?.name?.toLowerCase().includes(lowercasedQuery) ||
                semifinished?.sku?.toLowerCase().includes(lowercasedQuery) ||
                row.details?.toLowerCase().includes(lowercasedQuery) ||
                row.semifinishedLot?.sku?.toLowerCase().includes(lowercasedQuery)
            );
        });
        setFilteredRows(filtered);
    }, [searchQuery, rows, allSemiFinisheds]);

    const columnsDef: GridColDef[] = [
        { field: 'id', headerName: 'ID da OP', flex: 0.5 },
        {
            field: 'semifinishedName',
            headerName: 'Semiacabado',
            flex: 1.5,
        },
        {
            field: 'lotSku',
            headerName: 'SKU do Lote Gerado',
            flex: 1,
        },
        { field: 'goalQuantity', headerName: 'Quantidade Meta', flex: 1 },
        { field: 'translatedStatus', headerName: 'Status', flex: 1 },
        {
            field: 'issueDate',
            headerName: 'Data Emissão',
            flex: 1,
            valueFormatter: (params) => {
                if (!params) return 'N/A';
                return new Date(params).toLocaleDateString('pt-BR');
            },
        },
        {
            field: 'actions',
            headerName: 'Ações',
            sortable: false,
            filterable: false,
            flex: 0.7,
            minWidth: 200,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" size="small" onClick={() => handleEdit(params.row)}>
                        Editar
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="error" 
                        size="small" 
                        sx={{ ml: 1 }} 
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Deletar
                    </Button>
                </>
            ),
        },
    ];

    const modalFields = [
        {
            name: 'semifinishedId',
            label: 'Semiacabado',
            required: true,
            type: 'select',
            options: allSemiFinisheds.map(sf => ({
                value: String(sf.id),
                label: `${sf.name} (SKU: ${sf.sku})`,
            })),
        },
        { name: 'goalQuantity', label: 'Quantidade Meta', required: true, type: 'number', autoFocus: true },
        { name: 'issueDate', label: 'Data de Emissão', required: false, type: 'date' },
        { name: 'details', label: 'Detalhes (opcional)', required: false, type: 'text' },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'ISSUED', label: 'Emitida' },
                { value: 'STARTED', label: 'Iniciada' },
                { value: 'FINISHED', label: 'Finalizada' },
                { value: 'CANCELED', label: 'Cancelada' },
            ],
        },
    ];

    function handleEdit(order: SemifinishedProductionOrderResponseDTO) {
        setSelectedOrder(order);
        setIsModalOpen(true);
    }

    function handleDelete(id: number) {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    }

    const confirmDelete = () => {
        if (!deleteTargetId) return;
        deleteOrder({ id: deleteTargetId }, {
            onSuccess: () => {
                toast.success('Ordem de produção deletada com sucesso!');
                refetchOrders();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Erro ao deletar ordem de produção.');
            },
            onSettled: () => {
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
            }
        });
    };

    function handleCreateOrder(formData: Record<string, any>) {
        const { semifinishedId, goalQuantity, issueDate, details } = formData;
        createOrder(
            {
                semifinishedId: Number(semifinishedId),
                goalQuantity: Number(goalQuantity),
                issueDate: issueDate ? new Date(issueDate) : new Date(),
                details: details || '',
            },
            {
                onSuccess: () => {
                    toast.success('Ordem de produção criada com sucesso!');
                    setIsModalOpen(false);
                    refetchOrders();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Erro ao criar ordem de produção.');
                },
            }
        );
    }

    function handleUpdateOrder(formData: Record<string, any>) {
        if (!selectedOrder) return;
        const { semifinishedId, goalQuantity, issueDate, details, status } = formData;
        updateOrder(
            {
                id: selectedOrder.id,
                body: {
                    semifinishedId: Number(semifinishedId),
                    goalQuantity: Number(goalQuantity),
                    issueDate: issueDate ? new Date(issueDate) : undefined,
                    details,
                    status,
                },
            },
            {
                onSuccess: () => {
                    toast.success('Ordem de produção atualizada com sucesso!');
                    setIsModalOpen(false);
                    setSelectedOrder(null);
                    refetchOrders();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Erro ao atualizar ordem de produção.');
                },
            }
        );
    }

    const buttonProps = {
        text: 'Adicionar Ordem',
        onClick: () => {
            setSelectedOrder(null);
            setIsModalOpen(true);
        },
    };

    return (
        <Styled.Container>
            <PageTitle
                title="Ordens de Produção de Semiacabado"
                buttons={[buttonProps]}
            />
            <LoadingState isLoading={isLoading}>
                <ErrorState isError={isError} errorText={`Erro: ${error}`}>
                    <EmptyState isEmpty={!isLoading && filteredRows.length === 0} emptyText="Nenhuma ordem de produção encontrada">
                        <Styled.FilterSearchBarContainer>
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </Styled.FilterSearchBarContainer>
                        <DataTable
                            title="Ordens de Produção"
                            columns={columnsDef}
                            rows={filteredRows}
                        />
                    </EmptyState>
                </ErrorState>
            </LoadingState>
            <ModalForm
                open={isModalOpen}
                title={selectedOrder ? 'Editar Ordem de Produção' : 'Nova Ordem de Produção'}
                description={
                    selectedOrder
                        ? 'Altere os dados da ordem de produção e clique em salvar.'
                        : 'Preencha os dados para criar uma nova ordem de produção.'
                }
                fields={selectedOrder ? modalFields : modalFields.filter(field => field.name !== 'status')}
                initialValues={
                    selectedOrder
                        ? {
                            goalQuantity: String(selectedOrder.goalQuantity ?? ''),
                            semifinishedId: String(selectedOrder.semifinishedId ?? ''),
                            issueDate: selectedOrder.issueDate ? new Date(selectedOrder.issueDate).toISOString().split('T')[0] : '',
                            details: selectedOrder.details ?? '',
                            status: selectedOrder.status ?? 'ISSUED',
                        }
                        : { status: 'ISSUED', issueDate: new Date().toISOString().split('T')[0] }
                }
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedOrder(null);
                }}
                onSubmit={selectedOrder ? handleUpdateOrder : handleCreateOrder}
                submitLabel={selectedOrder ? 'Salvar' : 'Criar'}
                cancelLabel="Cancelar"
            />
            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja deletar esta ordem? Esta ação não pode ser desfeita."
            />
        </Styled.Container>
    );
}