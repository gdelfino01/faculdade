import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";

import * as Styled from "./styles";

import PageTitle from "../../components/PageTitle";
import DataTable from "../../components/DataTable";
import Filter from "../../components/Filter";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import ModalForm from "../../components/ModalForm";

import OdousApi from "../../services/apis/odous-api/odous-api";
import { UserResponseDTO } from "../../services/apis/odous-api/users/dtos";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function UsersManagementPage() {
    const [rows, setRows] = useState<UserResponseDTO[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [filteredRows, setFilteredRows] = useState<UserResponseDTO[]>([]);
    const [selectedFilter, setSelectedFilter] = useState("Todos");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const odousApi = useMemo(() => new OdousApi(), []);
    const {
        data: allUsers,
        isLoading: isUsersLoading,
        isError: isUsersError,
        error: usersError,
        refetch: refetchUsers,
    } = odousApi.users.get({});

    const { mutate: createUser } = odousApi.users.post();
    const { mutate: updateUser } = odousApi.users.putById();
    const { mutate: deleteUser } = odousApi.users.deleteById();

    useEffect(() => {
        if (!allUsers) return;
        setRows(allUsers);
    }, [allUsers]);

    useEffect(() => {
        setFilteredRows(
            selectedFilter === "Todos"
                ? rows
                : rows.filter((row) => row.role === selectedFilter)
        );
    }, [selectedFilter, rows]);

    useEffect(() => {
        const roles = ["Todos", ...new Set(rows.map((row) => row.role))];
        setFilters(roles);
    }, [rows]);

    const isUsersEmpty = !isUsersLoading && (!allUsers || allUsers.length === 0);

    const modalFields = [
        { name: "name", label: "Nome", required: true, autoFocus: true },
        { name: "email", label: "Email", required: true },
        { name: "password", label: "Senha", type: "password", required: true },
        {
            name: "role",
            label: "Papel",
            type: "select",
            required: true,
            options: [
                { value: "admin", label: "Administrador" },
                { value: "operator", label: "Operador" },
            ],
        },
    ];

    const columnsDef: GridColDef[] = [
        { field: "name", headerName: "Nome", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "role", headerName: "Papel", flex: 1 },
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

    const buttonProps = {
        text: "Adicionar",
        onClick: () => {
            setSelectedUser(null);
            setIsModalOpen(true);
        },
    };

    const handleFilterChange = (filter: string) => setSelectedFilter(filter);

    const handleDelete = (id: number) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteTargetId) return;
        deleteUser({ id: deleteTargetId }, {
            onSuccess: () => {
                toast.success('Usuário deletado com sucesso!');
                refetchUsers();
            },
            onError: (error: any) => {
                console.error('Erro ao deletar usuário:', error);
                toast.error(error.message || 'Erro ao deletar usuário. Tente novamente.');
            },
            onSettled: () => {
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
            }
        });
    };

    const handleCreateUser = (formData: Record<string, string>) => {
        const { name, email, password, role } = formData;
        const newUser = { name, email, password, role: role as "admin" | "operator" };

        createUser(newUser, {
            onSuccess: () => {
                toast.success("Usuário criado com sucesso!");
                setIsModalOpen(false);
                refetchUsers();
            },
            onError: (error) => {
                console.error("Erro ao criar usuário:", error);
                toast.error("Erro ao criar usuário. Tente novamente.");
            },
        });
    };

    const handleEdit = (user: UserResponseDTO) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleUpdateUser = (formData: Record<string, string>) => {
        if (!selectedUser) return;

        const { name, email, password, role } = formData;
        const updatedUser = { name, email, password, role: role as "admin" | "operator" };

        updateUser(
            { id: selectedUser.id, body: updatedUser },
            {
                onSuccess: () => {
                    toast.success("Usuário atualizado com sucesso!");
                    setIsModalOpen(false);
                    setSelectedUser(null);
                    refetchUsers();
                },
                onError: (error) => {
                    console.error("Erro ao atualizar usuário:", error);
                    toast.error("Erro ao atualizar usuário. Tente novamente.");
                },
            }
        );
    };

    return (
        <Styled.Container>
            <PageTitle title="Gerenciamento de Usuários" buttons={[buttonProps]} />
            <LoadingState isLoading={isUsersLoading}>
                <ErrorState isError={isUsersError} errorText={`Erro: ${usersError}`}>
                    <EmptyState isEmpty={isUsersEmpty} emptyText="Nenhum usuário encontrado">
                        <Filter onFilterChange={handleFilterChange} filters={filters} />
                        <DataTable title="Usuários" columns={columnsDef} rows={filteredRows} />
                    </EmptyState>
                </ErrorState>
            </LoadingState>
            <ModalForm
                open={isModalOpen}
                title={selectedUser ? "Editar Usuário" : "Novo Usuário"}
                description={
                    selectedUser
                        ? "Altere os dados do usuário e clique em salvar."
                        : "Preencha os dados para criar um novo usuário."
                }
                fields={modalFields}
                initialValues={
                    selectedUser
                        ? {
                            name: selectedUser.name,
                            email: selectedUser.email,
                            password: "",
                            role: selectedUser.role,
                        }
                        : {}
                }
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }}
                onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
                submitLabel={selectedUser ? "Salvar" : "Criar"}
                cancelLabel="Cancelar"
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