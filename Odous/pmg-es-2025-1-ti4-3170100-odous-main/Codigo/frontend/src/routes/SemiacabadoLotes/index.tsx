import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import * as Styled from './style.ts';

import PageTitle from '../../components/PageTitle';
import DataTable from '../../components/DataTable';
import Filter from '../../components/Filter';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import ConfirmationModal from '../../components/ConfirmationModal';

import OdousApi from '../../services/apis/odous-api/odous-api';
import { SemifinishedLotResponseDTO, PostSemifinishedLotBodyDTO, UpdateSemifinishedLotPayloadDTO } from '../../services/apis/odous-api/semifinished-lots/dtos';
import LotesSemiAcabadoDetailsModal from './LotesSemiAcabadoDetailsModal.tsx';

export default function SemifinishedLots() {
    const [rows, setRows] = useState<(SemifinishedLotResponseDTO & { semifinishedName: string; productionOrderIdentifier: string; })[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [filteredRows, setFilteredRows] = useState<(SemifinishedLotResponseDTO & { semifinishedName: string; productionOrderIdentifier: string; })[]>([]);
    const [selectedFilter, setSelectedFilter] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLot, setSelectedLot] = useState<SemifinishedLotResponseDTO | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const odousApi = useMemo(() => new OdousApi(), []);
    const { data: allLots, isLoading, isError, error, refetch } = odousApi.semifinishedLots.get({ 
        params: { includeConsumedMaterialLots: 'FULL' } 
    });

    const { mutate: createLot } = odousApi.semifinishedLots.post();
    const { mutate: updateLot } = odousApi.semifinishedLots.putById();
    const { mutate: deleteLot } = odousApi.semifinishedLots.deleteById();

    useEffect(() => {
        if (!allLots) return;
        const mappedRows = allLots.map((lot) => ({
            ...lot,
            semifinishedName: lot.semifinished?.name || 'N/A',
            productionOrderIdentifier: lot.semifinishedProductionOrder ? `OP-${lot.semifinishedProductionOrder.id}` : 'N/A',
        }));
        setRows(mappedRows);
    }, [allLots]);

    useEffect(() => {
        setFilteredRows(selectedFilter === 'Todos' ? rows : rows.filter((row) => row.semifinishedName === selectedFilter));
    }, [selectedFilter, rows]);

    useEffect(() => {
        const semifinishedNames = ['Todos', ...new Set(rows.map((row) => row.semifinishedName))];
        setFilters(semifinishedNames);
    }, [rows]);

    const isEmpty = !isLoading && (!allLots || allLots.length === 0);

    const columns: GridColDef<(SemifinishedLotResponseDTO & { semifinishedName: string, productionOrderIdentifier: string })>[] = [
        { field: 'sku', headerName: 'SKU do Lote', flex: 1 },
        { field: 'semifinishedName', headerName: 'Semiacabado', flex: 1.5 },
        { field: 'producedQuantityOK', headerName: 'Quantidade OK', type: 'number', flex: 0.8 },
        { field: 'producedQuantityNG', headerName: 'Quantidade NG', type: 'number', flex: 0.8 },
        { field: 'availableQuantity', headerName: 'Quantidade Disponível', type: 'number', flex: 1 },
        { field: 'productionOrderIdentifier', headerName: 'Ordem de Produção', flex: 1 },
        {
            field: 'actions', 
            headerName: 'Ações', 
            sortable: false, 
            filterable: false, 
            flex: 0.7, 
            minWidth: 200,
            renderCell: (params) => (
                <>
                    <Button variant='outlined' size='small' onClick={() => handleEdit(params.row)}>
                        Editar
                    </Button>
                    <Button 
                        variant="outlined" 
                        color='error' 
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

    const handleDelete = (id: number) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteTargetId) return;
        deleteLot({ id: deleteTargetId }, {
            onSuccess: () => {
                toast.success('Lote de semiacabado deletado com sucesso!');
                refetch();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Erro ao deletar lote.');
            },
            onSettled: () => { 
                setIsDeleteModalOpen(false); 
                setDeleteTargetId(null); 
            }
        });
    };

    const handleOpenCreateModal = () => {
        setSelectedLot(null);
        setIsModalOpen(true);
    };

    const handleEdit = (row: SemifinishedLotResponseDTO) => {
        setSelectedLot(row);
        setIsModalOpen(true);
    };

    const handleFilterChange = (filter: string) => setSelectedFilter(filter);

    const handleSubmit = (payload: PostSemifinishedLotBodyDTO | UpdateSemifinishedLotPayloadDTO['body']) => {
        if (selectedLot) {
            updateLot(
                { id: selectedLot.id, body: payload as UpdateSemifinishedLotPayloadDTO['body'] },
                {
                    onSuccess: () => {
                        toast.success('Lote atualizado com sucesso!');
                        setIsModalOpen(false);
                        refetch();
                    },
                    onError: (error: any) => {
                        toast.error(error.message || 'Erro ao atualizar lote.');
                    },
                }
            );
        } else {
            createLot(
                payload as PostSemifinishedLotBodyDTO,
                {
                    onSuccess: () => {
                        toast.success('Lote criado com sucesso!');
                        setIsModalOpen(false);
                        refetch();
                    },
                    onError: (error: any) => {
                        toast.error(error.message || 'Erro ao criar lote.');
                    },
                }
            );
        }
    };

    return (
        <Styled.Container>
            <PageTitle 
                title='Lotes de Semiacabados' 
                buttons={[{ text: 'Adicionar Lote', onClick: handleOpenCreateModal }]} 
            />
            <LoadingState isLoading={isLoading}>
                <ErrorState isError={isError} errorText={`Erro: ${error}`}>
                    <EmptyState isEmpty={isEmpty} emptyText='Nenhum lote encontrado'>
                        <Filter onFilterChange={handleFilterChange} filters={filters} />
                        <DataTable 
                            title='Lotes de Semiacabados' 
                            columns={columns} 
                            rows={filteredRows} 
                        />
                    </EmptyState>
                </ErrorState>
            </LoadingState>

            {isModalOpen && (
                <LotesSemiAcabadoDetailsModal 
                    open={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleSubmit} 
                    lot={selectedLot} 
                />
            )}

            <ConfirmationModal 
                open={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={confirmDelete} 
                title="Confirmar Exclusão" 
                message="Você tem certeza que deseja deletar este lote? Esta ação não pode ser desfeita." 
            />
        </Styled.Container>
    );
}