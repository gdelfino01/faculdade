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
import ConfirmationModal from '../../components/ConfirmationModal';
import AcabadoDetailsModal from './AcabadoDetailsModal';

import OdousApi from '../../services/apis/odous-api/odous-api';
import {
    FinishedResponseDTO,
    FinishedMaterialFullDTO,
    FinishedSemifinishedFullDTO,
    FinishedMaterialShortDTO,
    FinishedSemifinishedShortDTO,
    PostFinishedBodyDTO,
    UpdateFinishedPayloadDTO,
} from '../../services/apis/odous-api/finisheds/dtos';
import { MaterialResponseDTO } from '../../services/apis/odous-api/materials/dtos';
import { SemifinishedResponseDTO } from '../../services/apis/odous-api/semifinisheds/dtos';

const isMaterialFull = (mat: any): mat is FinishedMaterialFullDTO => mat && mat.material && typeof mat.material === 'object';
const isSemifinishedFull = (sf: any): sf is FinishedSemifinishedFullDTO => sf && sf.semifinished && typeof sf.semifinished === 'object';


export default function AcabadosPage() {
    const [rows, setRows] = useState<FinishedResponseDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAcabado, setSelectedAcabado] = useState<FinishedResponseDTO | null>(null);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const odousApi = useMemo(() => new OdousApi(), []);

    const {
        data: allAcabados,
        isLoading: isAcabadosLoading,
        isError: isAcabadosError,
        error: acabadosError,
        refetch: refetchAcabados,
    } = odousApi.finisheds.get({
        params: {
            includeRequiredMaterials: 'FULL',
            includeRequiredSemifinisheds: 'FULL'
        }
    });

    const { data: allMaterials = [] } = odousApi.materials.get({});
    const { data: allSemiFinisheds = [] } = odousApi.semiFinisheds.get({});

    const { mutate: createAcabado } = odousApi.finisheds.post();
    const { mutate: updateAcabado } = odousApi.finisheds.putById();
    const { mutate: deleteAcabado } = odousApi.finisheds.deleteById();

    useEffect(() => {
        if (allAcabados) {
            setRows(allAcabados.map(acabado => ({
                ...acabado,
            })));
        }
    }, [allAcabados]);

    const isDataEmpty = !isAcabadosLoading && (!allAcabados || allAcabados.length === 0);

    const handleOpenDetails = (acabado: FinishedResponseDTO) => {
        setSelectedAcabado(acabado);
        setIsDetailsModalOpen(true);
    };

    const columnsDef: GridColDef<FinishedResponseDTO>[] = [
        { field: 'sku', headerName: 'SKU', flex: 0.8 },
        { field: 'name', headerName: 'Nome', flex: 1.5 },
        {
            field: 'price',
            headerName: 'Preço',
            flex: 0.7,
            type: 'number',
        },
        { field: 'stockQuantity', headerName: 'Estoque', type: 'number', flex: 0.7 },
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
    ];

    const modalFields = [
        { name: 'sku', label: 'SKU', required: true, autoFocus: true },
        { name: 'name', label: 'Nome', required: true },
        { name: 'price', label: 'Preço', required: true, type: 'number' },
        {
            name: 'requiredMaterials',
            label: 'Materiais Necessários',
            type: 'multiSelectWithQuantity',
            required: true,
            options: allMaterials.map((m: MaterialResponseDTO) => ({ value: String(m.id), label: `${m.name} (SKU: ${m.sku})` })),
        },
        {
            name: 'requiredSemifinisheds',
            label: 'Semiacabados Necessários',
            type: 'multiSelectWithQuantity',
            required: true,
            options: allSemiFinisheds.map((sf: SemifinishedResponseDTO) => ({ value: String(sf.id), label: `${sf.name} (SKU: ${sf.sku})` })),
        },
    ];

    const handleEdit = (acabado: FinishedResponseDTO) => {
        setSelectedAcabado(acabado);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteTargetId) return;
        deleteAcabado({ id: deleteTargetId }, {
            onSuccess: () => {
                toast.success('Acabado deletado com sucesso!');
                refetchAcabados();
            },
            onError: (error: any) => {
                console.error('Erro ao deletar acabado:', error);
                toast.error(error.message || 'Erro ao deletar acabado. Tente novamente.');
            },
            onSettled: () => {
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
            }
        });
    };

    const handleCreateAcabado = (formData: Record<string, any>) => {
        const { sku, name, price, requiredMaterials, requiredSemifinisheds } = formData;

        const payload: PostFinishedBodyDTO = {
            sku,
            name,
            price: parseFloat(price) || 0,
            requiredMaterials: requiredMaterials ? Object.entries(JSON.parse(requiredMaterials)).map(([id, qty]) => ({ materialId: Number(id), requiredQuantity: Number(qty) })) : [],
            requiredSemifinisheds: requiredSemifinisheds ? Object.entries(JSON.parse(requiredSemifinisheds)).map(([id, qty]) => ({ semifinishedId: Number(id), requiredQuantity: Number(qty) })) : [],
        };

        createAcabado(payload, {
            onSuccess: () => {
                toast.success(`Acabado criado com sucesso!`);
                setIsModalOpen(false);
                setSelectedAcabado(null);
                refetchAcabados();
            },
            onError: (error: any) => {
                console.error(`Erro ao criar acabado:`, error);
                toast.error(error.message || `Erro ao criar acabado.`);
            },
        });
    };

    const handleUpdateAcabado = (formData: Record<string, any>) => {
        if (!selectedAcabado) return;

        const { sku, name, price, requiredMaterials, requiredSemifinisheds } = formData;

        const payload: UpdateFinishedPayloadDTO = {
            id: selectedAcabado.id,
            body: {
                sku,
                name,
                price: parseFloat(price) || 0,
                requiredMaterials: requiredMaterials ? Object.entries(JSON.parse(requiredMaterials)).map(([id, qty]) => ({ materialId: Number(id), requiredQuantity: Number(qty) })) : [],
                requiredSemifinisheds: requiredSemifinisheds ? Object.entries(JSON.parse(requiredSemifinisheds)).map(([id, qty]) => ({ semifinishedId: Number(id), requiredQuantity: Number(qty) })) : [],
            },
        };

        updateAcabado(payload, {
            onSuccess: () => {
                toast.success(`Acabado atualizado com sucesso!`);
                setIsModalOpen(false);
                setSelectedAcabado(null);
                refetchAcabados();
            },
            onError: (error: any) => {
                console.error(`Erro ao atualizar acabado:`, error);
                toast.error(error.message || `Erro ao atualizar acabado.`);
            },
        });
    };

    const getInitialModalValues = (): Record<string, string> => {
        if (!selectedAcabado) {
            return {
                sku: '',
                name: '',
                price: '',
                requiredMaterials: '{}',
                requiredSemifinisheds: '{}',
            };
        }

        const mapItemsToQuantityRecord = (
            items: (FinishedMaterialShortDTO | FinishedMaterialFullDTO | FinishedSemifinishedShortDTO | FinishedSemifinishedFullDTO)[] | undefined,
            type: 'material' | 'semifinished'
        ) => {
            if (!items) return {};

            return Object.fromEntries(
                items.map(item => {
                    const id = type === 'material'
                        ? isMaterialFull(item) ? item.material.id : (item as FinishedMaterialShortDTO).materialId
                        : isSemifinishedFull(item) ? item.semifinished.id : (item as FinishedSemifinishedShortDTO).semifinishedId;

                    const quantity = (item as any).requiredQuantity ?? 1;
                    return [String(id), quantity];
                }).filter(([id]) => id && id !== 'undefined' && id !== 'null')
            );
        };

        return {
            sku: selectedAcabado.sku ?? '',
            name: selectedAcabado.name ?? '',
            price: selectedAcabado.price !== undefined && selectedAcabado.price !== null ? String(selectedAcabado.price) : '',
            requiredMaterials: JSON.stringify(mapItemsToQuantityRecord(selectedAcabado.requiredMaterials, 'material')),
            requiredSemifinisheds: JSON.stringify(mapItemsToQuantityRecord(selectedAcabado.requiredSemifinisheds, 'semifinished')),
        };
    };

    return (
        <Styled.Container>
            <PageTitle
                title="Acabados"
                buttons={[{
                    text: 'Adicionar Acabado',
                    onClick: () => { setSelectedAcabado(null); setIsModalOpen(true); }
                }]}
            />
            <LoadingState isLoading={isAcabadosLoading}>
                <ErrorState isError={isAcabadosError} errorText={`${acabadosError}`}>
                    <Styled.FilterSearchBarContainer>
                        <div style={{ flexGrow: 1 }}>
                            <SearchBar placeholder="Pesquisar por nome ou SKU..." value={searchQuery} onChange={setSearchQuery} />
                        </div>
                    </Styled.FilterSearchBarContainer>
                    <EmptyState isEmpty={isDataEmpty} emptyText="Nenhum acabado cadastrado.">
                        <DataTable
                            title="Lista de Acabados"
                            columns={columnsDef}
                            rows={rows}
                            onRowClick={handleOpenDetails}
                        />
                    </EmptyState>
                </ErrorState>
            </LoadingState>

            {isModalOpen && (
                <ModalForm
                    open={isModalOpen}
                    title={selectedAcabado ? 'Editar Acabado' : 'Novo Acabado'}
                    description={selectedAcabado ? 'Altere os dados do acabado e clique em salvar.' : 'Preencha os dados para criar um novo acabado.'}
                    fields={modalFields}
                    initialValues={getInitialModalValues()}
                    onClose={() => { setIsModalOpen(false); setSelectedAcabado(null); }}
                    onSubmit={selectedAcabado ? handleUpdateAcabado : handleCreateAcabado}
                    submitLabel={selectedAcabado ? 'Salvar Alterações' : 'Criar Acabado'}
                    cancelLabel='Cancelar'
                />
            )}

            <AcabadoDetailsModal
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                acabado={selectedAcabado}
            />

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