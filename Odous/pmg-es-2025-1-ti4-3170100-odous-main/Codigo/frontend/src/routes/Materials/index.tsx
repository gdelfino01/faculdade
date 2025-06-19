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
import { MaterialResponseDTO } from '../../services/apis/odous-api/materials/dtos.ts';
import ConfirmationModal from '../../components/ConfirmationModal/index.tsx';

export default function Materials() {
    const [rows, setRows] = useState<MaterialResponseDTO[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [filteredRows, setFilteredRows] = useState<MaterialResponseDTO[]>([]);
    const [selectedFilter, setSelectedFilter] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialResponseDTO | null>(null);
    const [modalType, setModalType] = useState<'material' | 'rawMaterial'>('material');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const odousApi = useMemo(() => new OdousApi(), []);
    const {
        data: allMaterials,
        isLoading: isMaterialsLoading,
        isError: isMaterialsError,
        error: materialsError,
        refetch: refetchMaterials,
    } = odousApi.materials.get({});
    const { data: allRawMaterials = [], refetch: refetchRawMaterials } = odousApi.rawMaterials.get({});

    const { mutate: createMaterial } = odousApi.materials.post();
    const { mutate: updateMaterial } = odousApi.materials.putById();
    const { mutate: deleteMaterial } = odousApi.materials.deleteById();

    const { mutate: createRaWMaterial } = odousApi.rawMaterials.post();

    useEffect(() => {
        if (!allMaterials) return;
        setRows(
            allMaterials.map((material) => ({
                ...material,
                rawMaterialName: material.rawMaterial?.subtype ? `${material.rawMaterial.name} (${material.rawMaterial.subtype})` : material.rawMaterial?.name || 'N/A',
            }))
        );
    }, [allMaterials]);

    useEffect(() => {
        setFilteredRows(selectedFilter === 'Todos' ? rows : rows.filter((row) => row.rawMaterial?.name === selectedFilter));
    }, [selectedFilter, rows]);

    useEffect(() => {
        const rawMaterials = ['Todos', ...rows.map((row) => row.rawMaterial?.name || '')];
        setFilters(Array.from(new Set(rawMaterials)));
    }, [rows]);

    const isMaterialsEmpty = !isMaterialsLoading && (!allMaterials || allMaterials.length === 0);

    const materialModalFields = [
        { name: 'name', label: 'Nome', required: true, autoFocus: true },
        { name: 'sku', label: 'Código', required: true },
        { name: 'measurementUnit', label: 'Unidade de Medida', required: true },
        {
            name: 'rawMaterialId',
            label: 'Matéria-prima',
            type: 'select',
            required: true,
            options: allRawMaterials.map((rm) => ({
                value: rm.id,
                label: rm.subtype ? `${rm.name} (${rm.subtype})` : rm.name,
            })),
        },
    ];

    const rawMaterialModalFields = [
        { name: 'name', label: 'Nome', required: true, autoFocus: true },
        { name: 'subtype', label: 'Subtipo' },
    ];

    const columnsDef: GridColDef[] = [
        { field: 'name', headerName: 'Nome', flex: 1 },
        { field: 'sku', headerName: 'Código', flex: 1 },
        { field: 'stockQuantity', headerName: 'Quantidade', type: 'number', flex: 1 },
        { field: 'measurementUnit', headerName: 'Unidade de Medida', flex: 1 },
        { field: 'rawMaterialName', headerName: 'Matéria Prima', flex: 1 },
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
                    <Button variant="outlined" color='error' size="small" onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(params.row.id);
                    }} sx={{ ml: 1 }}>
                        Deletar
                    </Button>
                </>
            ),
        },
    ];

    const buttonsProps = [
        {
            text: 'Adicionar Material',
            onClick: () => {
                setModalType('material');
                setSelectedMaterial(null);
                setIsModalOpen(true);
            },
        },
        {
            text: 'Adicionar Matéria-prima',
            onClick: () => {
                setModalType('rawMaterial');
                setSelectedMaterial(null);
                setIsModalOpen(true);
            },
        },
    ];

    const handleFilterChange = (filter: string) => setSelectedFilter(filter);

    const handleDelete = (id: number) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteTargetId) return;
        deleteMaterial({ id: deleteTargetId }, {
            onSuccess: () => {
                toast.success('Material deletado com sucesso!');
                refetchMaterials();
            },
            onError: (error: any) => {
                console.error('Erro ao deletar material:', error);
                toast.error(error.message || 'Erro ao deletar material. Tente novamente.');
            },
            onSettled: () => {
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
            }
        });
    };

    const handleCreateMaterial = (formData: Record<string, string>) => {
        const { name, sku, measurementUnit, rawMaterialId } = formData;
        const newMaterial = { name, sku, measurementUnit, rawMaterialId: Number(rawMaterialId) };

        createMaterial(newMaterial, {
            onSuccess: () => {
                toast.success('Material criado com sucesso!');
                setIsModalOpen(false);
                refetchMaterials();
            },
            onError: (error) => {
                console.error('Erro ao criar material:', error);
                toast.error('Erro ao criar material. Tente novamente.');
            },
        });
    };

    const handleEdit = (material: MaterialResponseDTO) => {
        setModalType('material');
        setSelectedMaterial(material);
        setIsModalOpen(true);
    };

    const handleUpdateMaterial = (formData: Record<string, string>) => {
        if (!selectedMaterial) return;

        const { name, sku, measurementUnit, rawMaterialId } = formData;
        const updatedMaterial = {
            name,
            sku,
            measurementUnit,
            rawMaterialId: Number(rawMaterialId),
        };

        updateMaterial(
            { id: selectedMaterial.id, body: updatedMaterial },
            {
                onSuccess: () => {
                    toast.success('Material atualizado com sucesso!');
                    setIsModalOpen(false);
                    setSelectedMaterial(null);
                    refetchMaterials();
                },
                onError: (error) => {
                    console.error('Erro ao atualizar material:', error);
                    toast.error('Erro ao atualizar material. Tente novamente.');
                },
            }
        );
    };

    const handleCreateRawMaterial = (formData: Record<string, string>) => {
        const { name, subtype } = formData;
        const newRawMaterial = { name, subtype };

        createRaWMaterial(newRawMaterial, {
            onSuccess: () => {
                toast.success('Matéria-prima criada com sucesso!');
                setIsModalOpen(false);
                refetchRawMaterials();
            },
            onError: (error) => {
                console.error('Erro ao criar matéria-prima:', error);
                toast.error('Erro ao criar matéria-prima. Tente novamente.');
            },
        });
    };

    return (
        <Styled.Container>
            <PageTitle title='Materiais' buttons={buttonsProps} />
            <LoadingState isLoading={isMaterialsLoading}>
                <ErrorState isError={isMaterialsError} errorText={`Erro: ${materialsError}`}>
                    <EmptyState isEmpty={isMaterialsEmpty} emptyText='Nenhum material encontrado'>
                        <Filter onFilterChange={handleFilterChange} filters={filters} />
                        <DataTable title='Materiais' columns={columnsDef} rows={filteredRows} />
                    </EmptyState>
                </ErrorState>
            </LoadingState>
            {modalType == 'material' ? (
                <ModalForm
                    open={isModalOpen}
                    title={selectedMaterial ? 'Editar Material' : 'Novo Material'}
                    description={
                        selectedMaterial ? 'Altere os dados do material e clique em salvar.' : 'Preencha os dados para criar um novo material.'
                    }
                    fields={materialModalFields}
                    initialValues={
                        selectedMaterial
                            ? {
                                name: selectedMaterial.name,
                                sku: selectedMaterial.sku,
                                measurementUnit: selectedMaterial.measurementUnit,
                                rawMaterialId: String(selectedMaterial.rawMaterial?.id),
                            }
                            : {}
                    }
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedMaterial(null);
                    }}
                    onSubmit={selectedMaterial ? handleUpdateMaterial : handleCreateMaterial}
                    submitLabel={selectedMaterial ? 'Salvar' : 'Criar'}
                    cancelLabel='Cancelar'
                />
            ) : (
                <ModalForm
                    open={isModalOpen}
                    title={'Nova Matéria-prima'}
                    description={'Preencha os dados para criar uma nova matéria-prima.'}
                    fields={rawMaterialModalFields}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedMaterial(null);
                    }}
                    onSubmit={handleCreateRawMaterial}
                    submitLabel={'Criar'}
                    cancelLabel='Cancelar'
                />
            )}

            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja deletar este item? Esta ação não pode ser desfeita."
            />
        </Styled.Container>
    );
}
