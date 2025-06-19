import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import * as Styled from './styles';
import PageTitle from '../../components/PageTitle';
import DataTable from '../../components/DataTable';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import ModalForm from '../../components/ModalForm';
import SearchBar from '../../components/SearchBar';
import OdousApi from '../../services/apis/odous-api/odous-api';
import { FinishedProductionOrderResponseDTO } from '../../services/apis/odous-api/finished-production-orders/dtos';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function AcabadoOrdemProducao() {
    const [rows, setRows] = useState<FinishedProductionOrderResponseDTO[]>([]);
    const [filteredRows, setFilteredRows] = useState<FinishedProductionOrderResponseDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<FinishedProductionOrderResponseDTO | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const odousApi = useMemo(() => new OdousApi(), []);

    const {
        data: allOrders,
        isLoading,
        isError,
        error,
        refetch: refetchOrders
    } = odousApi.finishedProductionOrders.get({});

    const { data: allFinisheds = [] } = odousApi.finisheds.get({});

    const { mutate: createOrder } = odousApi.finishedProductionOrders.post();
    const { mutate: updateOrder } = odousApi.finishedProductionOrders.putById();
    const { mutate: deleteOrder } = odousApi.finishedProductionOrders.deleteById();

    useEffect(() => {
        if (!allOrders) return;
        setRows(allOrders.map(order => ({
            ...order,
            finishedName: allFinisheds.find(f => f.id === order.finishedId)?.name || 'Desconhecido',
            lotSku: order.finishedLot?.sku || 'N/A',
        })));
        setFilteredRows(allOrders);
    }, [allOrders]);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = rows.filter((row) => {
            const finishedGood = allFinisheds.find(f => f.id === row.finishedId);
            return (
                finishedGood?.name?.toLowerCase().includes(lowercasedQuery) ||
                finishedGood?.sku?.toLowerCase().includes(lowercasedQuery) ||
                row.details?.toLowerCase().includes(lowercasedQuery) ||
                row.finishedLot?.sku?.toLowerCase().includes(lowercasedQuery)
            );
        });
        setFilteredRows(filtered);
    }, [searchQuery, rows, allFinisheds]);

    const columnsDef: GridColDef[] = [
        { field: 'id', headerName: 'ID da OP', flex: 0.5 },
        {
            field: 'finishedName',
            headerName: 'Produto Acabado',
            flex: 1.5,
        },
        {
            field: 'lotSku',
            headerName: 'SKU do Lote Gerado',
            flex: 1,
        },
        { field: 'goalQuantity', headerName: 'Quantidade Meta', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'issueDate',
            headerName: 'Data Emissão',
            flex: 1,
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
                    <Button variant="outlined" color="error" size="small" sx={{ ml: 1 }} onClick={() => handleDelete(params.row.id)}>
                        Deletar
                    </Button>
                </>
            ),
        },
    ];

    const modalFields = [
        {
            name: 'finishedId',
            label: 'Produto Acabado',
            required: true,
            type: 'select',
            options: allFinisheds.map(f => ({
                value: String(f.id),
                label: `${f.name} (SKU: ${f.sku})`,
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

    function handleEdit(order: FinishedProductionOrderResponseDTO) {
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
        const { finishedId, goalQuantity, issueDate, details } = formData;
        createOrder(
            {
                finishedId: Number(finishedId),
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
        const { finishedId, goalQuantity, issueDate, details, status } = formData;
        updateOrder(
            {
                id: selectedOrder.id,
                body: {
                    finishedId: Number(finishedId),
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
                title="Ordens de Produção de Acabado"
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
                            finishedId: String(selectedOrder.finishedId ?? ''),
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