import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../utility/axiosInstance'

export default function AllUsersPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/v1/admin_route/seeAllUsers')
      return response.data.users
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
      await axiosInstance.delete(`/api/v1/admin_route/delete_user/${userId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
    }
  })

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete "${userName}"?`)) {
      deleteMutation.mutate(userId)
    }
  }

  if (isLoading) return <div className="p-8 text-gray-500">Loading users...</div>
  if (isError) return <div className="p-8 text-red-500">{error.message}</div>

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>

      {deleteMutation.isError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          Failed to delete user. Please try again.
        </div>
      )}

      <table className="w-full border-collapse bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-gray-600 text-left">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Created At</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user._id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(user._id, user.name)}
                  disabled={deleteMutation.isPending}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}