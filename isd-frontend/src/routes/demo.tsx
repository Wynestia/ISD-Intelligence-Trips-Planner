import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, Edit, Plus, X, Save } from 'lucide-react'

export const Route = createFileRoute('/demo')({
    component: DemoPage,
})

// Types based on API Spec
interface User {
    id: number
    name: string
    email: string
    password?: string
}

const API_URL = 'http://localhost:3001/users'

function DemoPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [isEditing, setIsEditing] = useState<number | null>(null) // ID of user being edited
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        password: '',
    })

    // Separate state for Create mode vs Edit mode
    const [isCreating, setIsCreating] = useState(false)

    // Fetch Users
    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await axios.get(API_URL)
            setUsers(response.data)
            setError(null)
        } catch (err) {
            setError('Failed to fetch users. Is the backend running?')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Handle Input Change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Create User
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.password) {
            alert('Please fill in all fields')
            return
        }

        try {
            await axios.post(API_URL, formData)
            fetchUsers() // Refresh list
            resetForm()
        } catch (err) {
            console.error('Error creating user:', err)
            alert('Failed to create user')
        }
    }

    // Start Editing
    const startEditing = (user: User) => {
        setIsEditing(user.id)
        setIsCreating(false)
        setFormData({ name: user.name, email: user.email, password: '' }) // Password separate or keep empty if not updating
    }

    // Update User
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isEditing) return

        try {
            // Only send fields that have values (password might be optional on update)
            const updateData = { ...formData }
            if (!updateData.password) delete updateData.password

            await axios.put(`${API_URL}/${isEditing}`, updateData)
            fetchUsers()
            resetForm()
        } catch (err) {
            console.error('Error updating user:', err)
            alert('Failed to update user')
        }
    }

    // Delete User
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return

        try {
            await axios.delete(`${API_URL}/${id}`)
            fetchUsers()
        } catch (err) {
            console.error('Error deleting user:', err)
            alert('Failed to delete user')
        }
    }

    // Reset Form
    const resetForm = () => {
        setFormData({ name: '', email: '', password: '' })
        setIsEditing(null)
        setIsCreating(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Management Demo</h1>
                    <button
                        onClick={() => {
                            resetForm()
                            setIsCreating(true)
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
                    >
                        <Plus size={20} />
                        Add User
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Create Form Modal or Inline (Using Inline for simplicity) */}
                {(isCreating || isEditing) && (
                    <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {isEditing ? 'Edit User' : 'Create New User'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                        placeholder="John Doe"
                                        required={!isEditing} // Required on create
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password {isEditing && <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                        placeholder="••••••••"
                                        required={!isEditing} // Required on create
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
                                >
                                    <Save size={18} />
                                    {isEditing ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Users List */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider w-20">ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right w-40">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No users found. Create one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{user.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-3">
                                                <button
                                                    onClick={() => startEditing(user)}
                                                    className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-full transition"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
