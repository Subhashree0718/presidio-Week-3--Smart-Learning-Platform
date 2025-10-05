import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import UserForm from '../../components/common/UserForm';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Edit, Trash2 } from 'lucide-react';
const ManageTeachers = () => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const [currentUser, setCurrentUser] = useState(null); 
    const [userToDelete, setUserToDelete] = useState(null); 
    const { data: teachers, isLoading, error } = useQuery({
        queryKey: ['teachers'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('/users/teacher');
            return data;
        },
    });
    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teachers'] });
            document.getElementById('user_modal').close();
            document.getElementById('delete_modal').close();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };
    const createMutation = useMutation({
        mutationFn: (newUserData) => axiosPrivate.post('/users', { ...newUserData, role: 'teacher' }),
        ...mutationOptions,
        onSuccess: () => {
            toast.success('Teacher created successfully!');
            mutationOptions.onSuccess();
        }
    });
    const updateMutation = useMutation({
        mutationFn: (updatedUserData) => axiosPrivate.put(`/users/${updatedUserData.user_id}`, updatedUserData),
        ...mutationOptions,
        onSuccess: () => {
            toast.success('Teacher updated successfully!');
            mutationOptions.onSuccess();
        }
    });
    const deleteMutation = useMutation({
        mutationFn: (userId) => axiosPrivate.delete(`/users/${userId}`),
        ...mutationOptions,
        onSuccess: () => {
            toast.success('Teacher deleted successfully!');
            mutationOptions.onSuccess();
        }
    });
    const handleOpenAddModal = () => {
        setCurrentUser(null);
        document.getElementById('user_modal').showModal();
    };
    const handleOpenEditModal = (user) => {
        setCurrentUser(user);
        document.getElementById('user_modal').showModal();
    };
    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        document.getElementById('delete_modal').showModal();
    }
    const handleFormSubmit = (data) => {
        if (currentUser) {
            updateMutation.mutate({ ...data, user_id: currentUser.user_id });
        } else {
            createMutation.mutate(data);
        }
    };
    const handleDeleteConfirm = () => {
        if (userToDelete) {
            deleteMutation.mutate(userToDelete.user_id);
        }
    };
    const columns = useMemo(() => [
        { accessor: 'user_name', Header: 'Name' },
        { accessor: 'user_email', Header: 'Email' },
        { accessor: 'specialization', Header: 'Specialization' },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="flex gap-2">
                    <button onClick={() => handleOpenEditModal(row.original)} className="btn btn-sm btn-outline btn-info"><Edit size={16}/></button>
                    <button onClick={() => handleOpenDeleteModal(row.original)} className="btn btn-sm btn-outline btn-error"><Trash2 size={16}/></button>
                </div>
            )
        }
    ], []);
    if (isLoading) return <div>Loading teachers...</div>;
    if (error) return <div>Error loading teachers.</div>;
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Teachers</h1>
                <button onClick={handleOpenAddModal} className="btn btn-primary">Add Teacher</button>
            </div> 
            <DataTable columns={columns} data={teachers || []} />
            <Modal id="user_modal" title={currentUser ? 'Edit Teacher' : 'Add New Teacher'}>
                <UserForm 
                    onSubmit={handleFormSubmit}
                    defaultValues={currentUser}
                    isLoading={createMutation.isLoading || updateMutation.isLoading}
                    role="teacher"
                />
            </Modal>
            <Modal id="delete_modal" title="Confirm Deletion">
                <p>Are you sure you want to delete the teacher "{userToDelete?.user_name}"?</p>
                <div className="modal-action">
                     <form method="dialog">
                        <button className="btn mr-2">Cancel</button>
                    </form>
                    <button onClick={handleDeleteConfirm} className="btn btn-error" disabled={deleteMutation.isLoading}>
                        {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};
export default ManageTeachers;

