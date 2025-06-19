import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import * as Styled from './styles.ts';

import PageTitle from '../../components/PageTitle/index.tsx';
import DataTable from '../../components/DataTable/index.tsx';
import Filter from '../../components/Filter/index.tsx';
import LoadingState from '../../components/LoadingState/index.tsx';
import ErrorState from '../../components/ErrorState/index.tsx';
import EmptyState from '../../components/EmptyState/index.tsx';
import ModalForm from '../../components/ModalForm/index.tsx';
import ConfirmationModal from '../../components/ConfirmationModal/index.tsx'; // Certifique-se de ter este componente

import OdousApi from '../../services/apis/odous-api/odous-api.ts';
import { MaterialLotResponseDTO } from '../../services/apis/odous-api/material-lots/dtos.ts';

export default function MaterialLots() {
    const [rows, setRows] = useState<MaterialLotResponseDTO[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [filteredRows, setFilteredRows] = useState<MaterialLotResponseDTO[]>([]);
    const [selectedFilter, setSelectedFilter] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLot, setSelectedLot] = useState<MaterialLotResponseDTO | null>(null);

    // Para confirmação de deleção
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const odousApi = useMemo(() => new OdousApi(), []);
    const { data: allLots, isLoading, isError, error, refetch } = odousApi.materialLots.get({});

    const { data: allMaterials = [] } = odousApi.materials.get({});
    const { mutate: createLot } = odousApi.materialLots.post();
    const { mutate: updateLot } = odousApi.materialLots.putById();
    const { mutate: deleteLot } = odousApi.materialLots.deleteById();

    useEffect(() => {
        if (!allLots) return;
        setRows(
            allLots.map((lot) => ({
                ...lot,
                materialName: lot.material?.name || '',
            }))
        );
    }, [allLots]);

    useEffect(() => {
        setFilteredRows(selectedFilter === 'Todos' ? rows : rows.filter((row) => row.material?.name === selectedFilter));
    }, [selectedFilter, rows]);

    useEffect(() => {
        const materialNames = ['Todos', ...rows.map((row) => row.material?.name || '')];
        setFilters(Array.from(new Set(materialNames)));
    }, [rows]);

    const isEmpty = !isLoading && (!allLots || allLots.length === 0);

    const modalFields = [
        { name: 'invoiceCode', label: 'Código do Lote', required: true, autoFocus: true },
        { name: 'acquiredQuantity', label: 'Quantidade', required: true, type: 'number' },
        {
            name: 'materialId',
            label: 'Material',
            type: 'select',
            required: true,
            options: allMaterials.map((m) => ({ value: m.id, label: m.name })),
        },
    ];

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        deleteLot({ id: deleteId }, {
            onSuccess: () => {
                toast.success('Lote de material deletado com sucesso!');
                refetch();
            },
            onError: (error: any) => {
                console.error('Erro ao deletar lote de material:', error);
                toast.error(error.message || 'Erro ao deletar lote de material. Tente novamente.');
            },
            onSettled: () => {
                setIsConfirmOpen(false);
                setDeleteId(null);
            }
        });
    };

    const columnsDef: GridColDef[] = [
        { field: 'materialName', headerName: 'Material', flex: 1 },
        { field: 'invoiceCode', headerName: 'Código do Lote', flex: 1 },
        { field: 'acquiredQuantity', headerName: 'Quantidade Inicial', type: 'number', flex: 1 },
        { field: 'availableQuantity', headerName: 'Quantidade Disponível', type: 'number', flex: 1 },
        {
            field: 'actions',
            headerName: 'Ações',
            sortable: false,
            filterable: false,
            flex: 0.7,
            minWidth: 200,
            renderCell: (params) => (
                <>
                    <Button variant='outlined' size='small' onClick={() => handleEdit(params.row)} sx={{ mr: 1 }}>
                        Editar
                    </Button>
                    <Button
                        variant='outlined'
                        color='error'
                        size='small'
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Deletar
                    </Button>
                </>
            ),
        },
    ];

    const buttonsProps = [
        {
            text: 'Adicionar Lote',
            onClick: () => {
                setSelectedLot(null);
                setIsModalOpen(true);
            },
        },
    ];

    const handleFilterChange = (filter: string) => setSelectedFilter(filter);

    const handleCreateLot = (formData: Record<string, string>) => {
        const { invoiceCode, acquiredQuantity, materialId } = formData;
        const newLot = {
            invoiceCode,
            acquiredQuantity: Number(acquiredQuantity),
            materialId: Number(materialId),
        };

        createLot(newLot, {
            onSuccess: () => {
                toast.success('Lote criado com sucesso!');
                setIsModalOpen(false);
                refetch();
            },
            onError: (error) => {
                console.error('Erro ao criar lote:', error);
                toast.error('Erro ao criar lote. Tente novamente.');
            },
        });
    };

    const handleEdit = (lot: MaterialLotResponseDTO) => {
        setSelectedLot(lot);
        setIsModalOpen(true);
    };

    const handleUpdateLot = (formData: Record<string, string>) => {
        if (!selectedLot) return;

        const { invoiceCode, acquiredQuantity, materialId } = formData;
        const updatedLot = {
            invoiceCode,
            acquiredQuantity: Number(acquiredQuantity),
            materialId: Number(materialId),
        };

        if (Number(acquiredQuantity) < selectedLot.availableQuantity) {
            toast.error('Quantidade inválida!');
            return;
        }

        updateLot(
            { id: selectedLot.id, body: updatedLot },
            {
                onSuccess: () => {
                    toast.success('Lote atualizado com sucesso!');
                    setIsModalOpen(false);
                    setSelectedLot(null);
                    refetch();
                },
                onError: (error) => {
                    console.error('Erro ao atualizar lote:', error);
                    toast.error('Erro ao atualizar lote. Tente novamente.');
                },
            }
        );
    };

    return (
        <Styled.Container>
            <PageTitle title='Lotes de Materiais' buttons={buttonsProps} />
            <LoadingState isLoading={isLoading}>
                <ErrorState isError={isError} errorText={`Erro: ${error}`}>
                    <EmptyState isEmpty={isEmpty} emptyText='Nenhum lote encontrado'>
                        <Filter onFilterChange={handleFilterChange} filters={filters} />
                        <DataTable title='Lotes de Materiais' columns={columnsDef} rows={filteredRows}/>
                    </EmptyState>
                </ErrorState>
            </LoadingState>
            <ModalForm
                open={isModalOpen}
                title={selectedLot ? 'Editar Lote' : 'Novo Lote'}
                description={selectedLot ? 'Altere os dados do lote e clique em salvar.' : 'Preencha os dados para criar um novo lote.'}
                fields={modalFields}
                initialValues={
                    selectedLot
                        ? {
                            invoiceCode: selectedLot.invoiceCode,
                            acquiredQuantity: String(selectedLot.acquiredQuantity),
                            materialId: String(selectedLot.material?.id),
                        }
                        : {}
                }
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedLot(null);
                }}
                onSubmit={selectedLot ? handleUpdateLot : handleCreateLot}
                submitLabel={selectedLot ? 'Salvar' : 'Criar'}
                cancelLabel='Cancelar'
            />
            <ConfirmationModal
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja deletar este item? Esta ação não pode ser desfeita."
            />
        </Styled.Container>
    );
}
