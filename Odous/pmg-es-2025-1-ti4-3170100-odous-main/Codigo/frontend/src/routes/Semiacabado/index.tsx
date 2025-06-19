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

import OdousApi from '../../services/apis/odous-api/odous-api.ts';
import { SemifinishedResponseDTO } from '../../services/apis/odous-api/semifinisheds/dtos.ts';
import SearchBar from '../../components/SearchBar/index.tsx';
import ConfirmationModal from '../../components/ConfirmationModal/index.tsx';
import SemiAcabadoDetailsModal from './SemiaAcabadoDetailsModal.tsx';

export default function Semiacabado() {
    const [rows, setRows] = useState<SemifinishedResponseDTO[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [filteredRows, setFilteredRows] = useState<SemifinishedResponseDTO[]>([]);
    const [selectedFilter, setSelectedFilter] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSemiFinished, setSelectedSemiFinished] = useState<SemifinishedResponseDTO | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const odousApi = useMemo(() => new OdousApi(), []);
    const {
        data: allSemiFinished,
        isLoading: isSemiFinishedLoading,
        isError: isSemiFinishedError,
        error: semiFinishedError,
        refetch: refetchSemiFinished,
    } = odousApi.semiFinisheds.get({});

    const { data: allMaterials = [] } = odousApi.materials.get({});
    const { data: allFamilies = [] } = odousApi.semiFinishedFamilies.get({});
    const { mutate: createSemiFinished } = odousApi.semiFinisheds.post();
    const { mutate: updateSemiFinished } = odousApi.semiFinisheds.putById();
    const { mutate: deleteSemiFinished } = odousApi.semiFinisheds.deleteById();

    useEffect(() => {
        if (!allSemiFinished) return;
        setRows(
            allSemiFinished.map((semifinished => ({
                ...semifinished,
                familyName: semifinished.family?.name || '',
            })))
        );
    }, [allSemiFinished]);

    useEffect(() => {
        const byFamily = selectedFilter === 'Todos'
            ? rows
            : rows.filter((row) => row.family?.name === selectedFilter);

        const bySearch = searchQuery.trim()
            ? byFamily.filter((row) =>
                Object.values(row).some((value) =>
                    typeof value === 'string' &&
                    value.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
            : byFamily;

        setFilteredRows(bySearch);
    }, [selectedFilter, searchQuery, rows]);

    useEffect(() => {
        const families = ['Todos', ...rows.map((row) => row.family?.name || '')];
        setFilters(Array.from(new Set(families)));
    }, [rows]);

    const isSemiFinishedEmpty = !isSemiFinishedLoading && (!allSemiFinished || allSemiFinished.length === 0);

    const handleOpenDetailsModal = (semiFinished: SemifinishedResponseDTO) => {
        setSelectedSemiFinished(semiFinished);
        setIsDetailsModalOpen(true);
    }

    const modalFields = [
        { name: 'sku', label: 'Código', required: true, type: 'text' },
        { name: 'name', label: 'Nome', required: true, type: 'text' },
        {
            name: 'family',
            label: 'Família',
            type: 'select',
            required: true,
            options: allFamilies.map((family) => ({
                value: family.id,
                label: family.name,
            })),
        },
        {
            name: 'requiredMaterials',
            label: 'Matérias Primas',
            type: 'multiSelectWithQuantity',
            required: true,
            options: allMaterials.map((material) => ({
                value: material.id,
                label: material.name,
            })),
        },
    ];

    const familyModalFields = [
        { name: 'name', label: 'Nome', required: true, type: 'text', autoFocus: true },
        { name: 'shortName', label: 'Código', required: true, type: 'text' },
    ];

    const columnsDef: GridColDef[] = [
        { field: 'sku', headerName: 'Código', flex: 1 },
        { field: 'name', headerName: 'Nome', flex: 1 },
        { field: 'stockQuantity', headerName: 'Quantidade', type: 'number', flex: 1 },
        { field: 'familyName', headerName: 'Família', flex: 1 },
        {
            field: 'actions',
            headerName: 'Ações',
            sortable: false,
            filterable: false,
            flex: 0.7,
            minWidth: 200,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" size="small" onClick={(event) => {
                        event.stopPropagation();
                        handleEdit(params.row);
                    }}>
                        Editar
                    </Button>
                    <Button variant="outlined" color='error' size="small" onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(params.row.id);
                    }} sx={{ ml: 1 }}>
                        Deletar
                    </Button>
                </>
            ),
        },
    ]

    const handleDelete = (id: number) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteTargetId) return;
        deleteSemiFinished({ id: deleteTargetId }, {
            onSuccess: () => {
                toast.success('Semiacabado deletado com sucesso!');
                refetchSemiFinished();
            },
            onError: (error: any) => {
                console.error('Erro ao deletar semiacabado:', error);
                toast.error(error.message || 'Erro ao deletar semiacabado. Tente novamente.');
            },
            onSettled: () => {
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
            }
        });
    };

    const handleFilterChange = (filter: string) => setSelectedFilter(filter);

    const handleCreateSemiFinished = (formData: Record<string, any>) => {
        const { sku, name, family, requiredMaterials } = formData;

        const parsedMaterials = JSON.parse(requiredMaterials || '{}');

        // Formatação simplificada para criação - apenas materialId e requiredQuantity
        const formattedMaterials = Object.entries(parsedMaterials).map(([materialId, quantity]) => ({
            materialId: Number(materialId),
            requiredQuantity: Number(quantity),
        }));

        const newSemiFinished = {
            sku,
            name,
            familyId: Number(family),
            requiredMaterials: formattedMaterials,
        };

        createSemiFinished(newSemiFinished, {
            onSuccess: () => {
                toast.success('Semiacabado criado com sucesso!');
                setIsModalOpen(false);
                refetchSemiFinished();
            },
            onError: (error) => {
                console.error('Erro ao criar semiacabado:', error);
                toast.error('Erro ao criar semiacabado. Tente novamente.');
            },
        });
    };

    const handleEdit = (semiFinished: SemifinishedResponseDTO) => {
        setSelectedSemiFinished(semiFinished);
        setIsModalOpen(true);
    };

    const handleUpdateSemiFinished = (formData: Record<string, any>) => {
        if (!selectedSemiFinished) return;

        const { name, sku, family, requiredMaterials } = formData;

        const parsedMaterials = JSON.parse(requiredMaterials || '{}');
        
        // Formatação simplificada para atualização - apenas materialId e requiredQuantity
        const formattedMaterials = Object.entries(parsedMaterials).map(([materialId, quantity]) => ({
            materialId: Number(materialId),
            requiredQuantity: Number(quantity),
            name: allMaterials.find(mat => mat.id === Number(materialId))?.name || '',
        }));

        const updatedSemiFinished = {
            name,
            sku,
            familyId: Number(family),
            requiredMaterials: formattedMaterials,
        };

        updateSemiFinished(
            { id: selectedSemiFinished.id, body: updatedSemiFinished },
            {
                onSuccess: () => {
                    toast.success('Semiacabado atualizado com sucesso!');
                    setIsModalOpen(false);
                    setSelectedSemiFinished(null);
                    refetchSemiFinished();
                },
                onError: (error: unknown) => {
                    console.error('Erro ao atualizar semiacabado:', error);
                    toast.error('Erro ao atualizar semiacabado. Tente novamente.');
                },
            }
        );
    };

    const { mutate: createFamily } = odousApi.semiFinishedFamilies.post();

    const handleCreateFamily = (formData: Record<string, string>) => {
        const { name, shortName } = formData;
        createFamily(
            { name, shortName },
            {
                onSuccess: () => {
                    toast.success('Família criada com sucesso!');
                    setIsFamilyModalOpen(false);
                    refetchSemiFinished();
                },
                onError: (error) => {
                    console.error('Erro ao criar família:', error);
                    toast.error('Erro ao criar família. Tente novamente.');
                },
            }
        );
    };

    const buttonsProps = [
        {
            text: 'Adicionar Família',
            onClick: () => setIsFamilyModalOpen(true),
        },
        {
            text: 'Adicionar Semiacabado',
            onClick: () => {
                setSelectedSemiFinished(null);
                setIsModalOpen(true);
            },
        }
    ];

    return (
        <Styled.Container>
            <PageTitle title="Semiacabados" buttons={buttonsProps} />
            <LoadingState isLoading={isSemiFinishedLoading}>
                <ErrorState isError={isSemiFinishedError} errorText={`Erro: ${semiFinishedError}`}>
                    <EmptyState isEmpty={isSemiFinishedEmpty} emptyText="Nenhum semiacabado encontrado">
                        <Styled.FilterSearchBarContainer>
                            <Filter onFilterChange={handleFilterChange} filters={filters} />
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </Styled.FilterSearchBarContainer>
                        <DataTable
                            title="Semiacabados"
                            columns={columnsDef}
                            rows={filteredRows}
                            onRowClick={handleOpenDetailsModal}
                        />
                    </EmptyState>
                </ErrorState>
            </LoadingState>
            <ModalForm
                open={isModalOpen}
                title={selectedSemiFinished ? 'Editar Semiacabado' : 'Novo Semiacabado'}
                description={
                    selectedSemiFinished
                        ? 'Altere os dados do semiacabado e clique em salvar.'
                        : 'Preencha os dados para criar um novo semiacabado.'
                }
                fields={modalFields}
                initialValues={
                    selectedSemiFinished
                        ? {
                            name: selectedSemiFinished.name,
                            sku: selectedSemiFinished.sku,
                            family: String(selectedSemiFinished.family?.id || ''),
                            requiredMaterials: selectedSemiFinished.requiredMaterials
                                ? JSON.stringify(
                                    Object.fromEntries(
                                        selectedSemiFinished.requiredMaterials.map((mat) => [
                                            String('materialId' in mat ? mat.materialId : mat.material?.id),
                                            mat.requiredQuantity ?? 1,
                                        ])
                                    )
                                )
                                : '{}',
                        }
                        : {}
                }
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSemiFinished(null);
                }}
                onSubmit={selectedSemiFinished ? handleUpdateSemiFinished : handleCreateSemiFinished}
                submitLabel={selectedSemiFinished ? 'Salvar' : 'Criar'}
                cancelLabel="Cancelar"
            />
            <ModalForm
                open={isFamilyModalOpen}
                title="Nova Família de Semiacabado"
                description="Preencha os dados para criar uma nova família."
                fields={familyModalFields}
                initialValues={{}}
                onClose={() => setIsFamilyModalOpen(false)}
                onSubmit={handleCreateFamily}
                submitLabel="Criar"
                cancelLabel="Cancelar"
            />

            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja deletar este item? Esta ação não pode ser desfeita."
            />

            <SemiAcabadoDetailsModal
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                semifinished={selectedSemiFinished}
                allMaterials={allMaterials}
            />
        </Styled.Container>
    )
}