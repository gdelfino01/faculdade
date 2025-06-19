import React, { useState, useMemo } from 'react';
import { Tabs, Tab, Box, Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import * as Styled from './styles';
import PageTitle from '../../components/PageTitle';
import DataTable from '../../components/DataTable';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import ModalForm from '../../components/ModalForm';
import ConfirmationModal from '../../components/ConfirmationModal';
import OdousApi from '../../services/apis/odous-api/odous-api';

// Tipos de DTO
import { RawMaterialResponseDTO } from '../../services/apis/odous-api/raw-materials/dtos';
import { SemifinishedFamilyResponseDTO } from '../../services/apis/odous-api/semifinished-families/dtos';
import { AnvisaRegisterResponseDTO } from '../../services/apis/odous-api/anvisa-registers/dtos';

// Componente para o painel da aba
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
            {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
        </div>
    );
}

// Hook customizado para encapsular a lógica de cada entidade
const useEntityData = (entityService: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    const { data, isLoading, isError, error, refetch } = entityService.get({});
    const { mutate: createItem } = entityService.post();
    const { mutate: updateItem } = entityService.putById();
    const { mutate: deleteItem } = entityService.deleteById();

    return { isModalOpen, setIsModalOpen, selectedItem, setSelectedItem, data, isLoading, isError, error, refetch, createItem, updateItem, deleteItem };
};


export default function OtherRegistrationsPage() {
    const [tabIndex, setTabIndex] = useState(0);
    const odousApi = useMemo(() => new OdousApi(), []);

    const [deleteModalState, setDeleteModalState] = useState({
        isOpen: false,
        targetId: null as number | null,
        targetType: null as 'rawMaterial' | 'family' | 'anvisa' | null,
    });

    const rawMaterials = useEntityData(odousApi.rawMaterials);
    const semiFinishedFamilies = useEntityData(odousApi.semiFinishedFamilies);
    const anvisaRegisters = useEntityData(odousApi.anvisaRegisters);

    const { data: allFinisheds = [] } = odousApi.finisheds.get({});

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleDeleteClick = (id: number, type: 'rawMaterial' | 'family' | 'anvisa') => {
        setDeleteModalState({ isOpen: true, targetId: id, targetType: type });
    };

    const handleConfirmDelete = () => {
        const { targetId, targetType } = deleteModalState;
        if (!targetId || !targetType) return;

        let mutation: any;
        let refetch: () => void;
        let itemName: string = 'Item';

        switch (targetType) {
            case 'rawMaterial':
                mutation = rawMaterials.deleteItem;
                refetch = rawMaterials.refetch;
                itemName = 'Matéria-prima';
                break;
            case 'family':
                mutation = semiFinishedFamilies.deleteItem;
                refetch = semiFinishedFamilies.refetch;
                itemName = 'Família';
                break;
            case 'anvisa':
                mutation = anvisaRegisters.deleteItem;
                refetch = anvisaRegisters.refetch;
                itemName = 'Registro ANVISA';
                break;
            default:
                return;
        }

        mutation({ id: targetId }, {
            onSuccess: () => {
                toast.success(`${itemName} deletado(a) com sucesso!`);
                refetch();
            },
            onError: (error: any) => {
                toast.error(error.message || `Erro ao deletar ${itemName.toLowerCase()}.`);
            },
            onSettled: () => {
                setDeleteModalState({ isOpen: false, targetId: null, targetType: null });
            },
        });
    };

    // --- Lógica de Submissão dos Modais ---
    const handleRawMaterialSubmit = (formData: Record<string, any>) => {
        const payload = { name: formData.name, subtype: formData.subtype || undefined };
        const action = rawMaterials.selectedItem ? 'atualizada' : 'criada';
        const mutation = rawMaterials.selectedItem ? rawMaterials.updateItem : rawMaterials.createItem;
        const mutationPayload = rawMaterials.selectedItem ? { id: rawMaterials.selectedItem.id, body: payload } : payload;

        mutation(mutationPayload, {
            onSuccess: () => {
                toast.success(`Matéria-prima ${action} com sucesso!`);
                rawMaterials.refetch();
                rawMaterials.setIsModalOpen(false);
            },
            onError: (error: any) => toast.error(error.message || `Erro ao ${action} matéria-prima.`),
        });
    };

    const handleFamilySubmit = (formData: Record<string, any>) => {
        const payload = { name: formData.name, shortName: formData.shortName };
        const action = semiFinishedFamilies.selectedItem ? 'atualizada' : 'criada';
        const mutation = semiFinishedFamilies.selectedItem ? semiFinishedFamilies.updateItem : semiFinishedFamilies.createItem;
        const mutationPayload = semiFinishedFamilies.selectedItem ? { id: semiFinishedFamilies.selectedItem.id, body: payload } : payload;

        mutation(mutationPayload, {
            onSuccess: () => {
                toast.success(`Família ${action} com sucesso!`);
                semiFinishedFamilies.refetch();
                semiFinishedFamilies.setIsModalOpen(false);
            },
            onError: (error: any) => toast.error(error.message || `Erro ao ${action} família.`),
        });
    };

    const handleAnvisaSubmit = (formData: Record<string, any>) => {
        const payload = { codeNumber: formData.codeNumber, family: formData.family, rawMaterialId: Number(formData.rawMaterialId), finishedId: Number(formData.finishedId) };
        const action = anvisaRegisters.selectedItem ? 'atualizado' : 'criado';
        const mutation = anvisaRegisters.selectedItem ? anvisaRegisters.updateItem : anvisaRegisters.createItem;
        const mutationPayload = anvisaRegisters.selectedItem ? { id: anvisaRegisters.selectedItem.id, body: payload } : payload;

        mutation(mutationPayload, {
            onSuccess: () => {
                toast.success(`Registro ANVISA ${action} com sucesso!`);
                anvisaRegisters.refetch();
                anvisaRegisters.setIsModalOpen(false);
            },
            onError: (error: any) => toast.error(error.message || `Erro ao ${action} registro.`),
        });
    };

    const rawMaterialsColumns: GridColDef<RawMaterialResponseDTO>[] = [
        { field: 'name', headerName: 'Nome', flex: 1 },
        { field: 'subtype', headerName: 'Subtipo', flex: 1 },
        {
            field: 'actions',
            headerName: 'Ações',
            sortable: false,
            filterable: false,
            flex: 0.5,
            minWidth: 200,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" size="small" onClick={() => { rawMaterials.setSelectedItem(params.row); rawMaterials.setIsModalOpen(true); }}>Editar</Button>
                    <Button variant="outlined" color="error" size="small" sx={{ ml: 1 }} onClick={() => handleDeleteClick(params.row.id, 'rawMaterial')}>Deletar</Button>
                </>
            ),
        },
    ];

    const familiesColumns: GridColDef<SemifinishedFamilyResponseDTO>[] = [
        { field: 'name', headerName: 'Nome', flex: 1 },
        { field: 'shortName', headerName: 'Nome Curto/Código', flex: 1 },
        {
            field: 'actions', headerName: 'Ações', flex: 0.5, minWidth: 200,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" size="small" onClick={() => { semiFinishedFamilies.setSelectedItem(params.row); semiFinishedFamilies.setIsModalOpen(true); }}>Editar</Button>
                    <Button variant="outlined" color="error" size="small" sx={{ ml: 1 }} onClick={() => handleDeleteClick(params.row.id, 'family')}>Deletar</Button>
                </>
            ),
        },
    ];

    const anvisaColumns: GridColDef<AnvisaRegisterResponseDTO>[] = [
        { field: 'codeNumber', headerName: 'Código', flex: 1 },
        { field: 'family', headerName: 'Família', flex: 1 },
        {
            field: 'actions', headerName: 'Ações', flex: 0.5, minWidth: 200,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" size="small" onClick={() => { anvisaRegisters.setSelectedItem(params.row); anvisaRegisters.setIsModalOpen(true); }}>Editar</Button>
                    <Button variant="outlined" color="error" size="small" sx={{ ml: 1 }} onClick={() => handleDeleteClick(params.row.id, 'anvisa')}>Deletar</Button>
                </>
            ),
        },
    ];

    const pageButtons = [
        { text: "Adicionar Matéria-Prima", onClick: () => { rawMaterials.setSelectedItem(null); rawMaterials.setIsModalOpen(true); }, visible: tabIndex === 0 },
        { text: "Adicionar Família", onClick: () => { semiFinishedFamilies.setSelectedItem(null); semiFinishedFamilies.setIsModalOpen(true); }, visible: tabIndex === 1 },
        { text: "Adicionar Registro ANVISA", onClick: () => { anvisaRegisters.setSelectedItem(null); anvisaRegisters.setIsModalOpen(true); }, visible: tabIndex === 2 }
    ].filter(btn => btn.visible);

    return (
      <Styled.Container>
        <PageTitle title="Outros Cadastros" buttons={pageButtons} />
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  color: "var(--tabs-text)",
                  textTransform: "none",
                  fontWeight: 400,
                },
                "& .Mui-selected": {
                  color: "var(--tabs-selected)",
                  fontWeight: "bold",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--tabs-indicator)",
                },
              }}
            >
              <Tab label="Matérias-Primas" id="tab-0" />
              <Tab label="Famílias de Semiacabados" id="tab-1" />
              <Tab label="Registros ANVISA" id="tab-2" />
            </Tabs>
          </Box>

          <TabPanel value={tabIndex} index={0}>
            <LoadingState isLoading={rawMaterials.isLoading}>
              <ErrorState
                isError={rawMaterials.isError}
                errorText={`${rawMaterials.error}`}
              >
                <EmptyState
                  isEmpty={!rawMaterials.data?.length}
                  emptyText="Nenhuma matéria-prima encontrada"
                >
                  <DataTable
                    title="Matérias-Primas"
                    columns={rawMaterialsColumns}
                    rows={rawMaterials.data || []}
                  />
                </EmptyState>
              </ErrorState>
            </LoadingState>
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            <LoadingState isLoading={semiFinishedFamilies.isLoading}>
              <ErrorState
                isError={semiFinishedFamilies.isError}
                errorText={`${semiFinishedFamilies.error}`}
              >
                <EmptyState
                  isEmpty={!semiFinishedFamilies.data?.length}
                  emptyText="Nenhuma família encontrada"
                >
                  <DataTable
                    title="Famílias de Semiacabados"
                    columns={familiesColumns}
                    rows={semiFinishedFamilies.data || []}
                  />
                </EmptyState>
              </ErrorState>
            </LoadingState>
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            <LoadingState isLoading={anvisaRegisters.isLoading}>
              <ErrorState
                isError={anvisaRegisters.isError}
                errorText={`${anvisaRegisters.error}`}
              >
                <EmptyState
                  isEmpty={!anvisaRegisters.data?.length}
                  emptyText="Nenhum registro ANVISA encontrado"
                >
                  <DataTable
                    title="Registros ANVISA"
                    columns={anvisaColumns}
                    rows={anvisaRegisters.data || []}
                  />
                </EmptyState>
              </ErrorState>
            </LoadingState>
          </TabPanel>
        </Box>

        {/* Modais de Edição/Criação */}
        <ModalForm
          open={rawMaterials.isModalOpen}
          onClose={() => rawMaterials.setIsModalOpen(false)}
          title={
            rawMaterials.selectedItem
              ? "Editar Matéria-Prima"
              : "Nova Matéria-Prima"
          }
          fields={[
            { name: "name", label: "Nome", required: true },
            { name: "subtype", label: "Subtipo" },
          ]}
          initialValues={rawMaterials.selectedItem || {}}
          onSubmit={handleRawMaterialSubmit}
          submitLabel={rawMaterials.selectedItem ? "Salvar" : "Criar"}
        />

        <ModalForm
          open={semiFinishedFamilies.isModalOpen}
          onClose={() => semiFinishedFamilies.setIsModalOpen(false)}
          title={
            semiFinishedFamilies.selectedItem
              ? "Editar Família"
              : "Nova Família"
          }
          fields={[
            { name: "name", label: "Nome", required: true },
            { name: "shortName", label: "Nome Curto/Código", required: true },
          ]}
          initialValues={semiFinishedFamilies.selectedItem || {}}
          onSubmit={handleFamilySubmit}
          submitLabel={semiFinishedFamilies.selectedItem ? "Salvar" : "Criar"}
        />

        <ModalForm
          open={anvisaRegisters.isModalOpen}
          onClose={() => anvisaRegisters.setIsModalOpen(false)}
          title={
            anvisaRegisters.selectedItem
              ? "Editar Registro ANVISA"
              : "Novo Registro ANVISA"
          }
          fields={[
            { name: "codeNumber", label: "Código do Registro", required: true },
            { name: "family", label: "Família", required: true },
            {
              name: "rawMaterialId",
              label: "Matéria-Prima",
              type: "select",
              required: true,
              options:
                rawMaterials.data?.map((rm: any) => ({
                  value: rm.id,
                  label: rm.name,
                })) || [],
            },
            {
              name: "finishedId",
              label: "Produto Acabado",
              type: "select",
              required: true,
              options:
                allFinisheds.map((f: any) => ({
                  value: f.id,
                  label: f.name,
                })) || [],
            },
          ]}
          initialValues={
            anvisaRegisters.selectedItem
              ? {
                  ...anvisaRegisters.selectedItem,
                  rawMaterialId: String(
                    anvisaRegisters.selectedItem.rawMaterial?.id || ""
                  ),
                  finishedId: String(
                    anvisaRegisters.selectedItem.finished?.id || ""
                  ),
                }
              : {}
          }
          onSubmit={handleAnvisaSubmit}
          submitLabel={anvisaRegisters.selectedItem ? "Salvar" : "Criar"}
        />

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmationModal
          open={deleteModalState.isOpen}
          onClose={() =>
            setDeleteModalState({
              isOpen: false,
              targetId: null,
              targetType: null,
            })
          }
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão"
          message="Você tem certeza que deseja deletar este item? Esta ação não pode ser desfeita."
        />
      </Styled.Container>
    );
}