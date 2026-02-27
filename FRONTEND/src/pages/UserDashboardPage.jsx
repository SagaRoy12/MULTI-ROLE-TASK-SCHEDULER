import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utility/axiosInstance.js";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-orange-100 text-orange-600",
  high: "bg-red-100 text-red-600",
};

const emptyForm = { title: "", description: "", status: "pending", priority: "medium" };

export default function UserDashboardPage() {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState("tasks");
  const [form, setForm] = useState(emptyForm);
  const [editingTask, setEditingTask] = useState(null);
  const [formError, setFormError] = useState(null);

  // fetch profile
  const { data: profile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/v1/user_route/my_profile");
      return response.data.user;
    },
  });

  // fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/v1/user_route/my_tasks");
      return response.data.tasks;
    },
  });

  // create task
  const createMutation = useMutation({
    mutationFn: async (taskData) => {
      const response = await axiosInstance.post("/api/v1/user_route/create_task", taskData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-tasks"]);
      setForm(emptyForm);
      setFormError(null);
    },
    onError: (error) => {
      setFormError(error.response?.data?.message || "Failed to create task");
    },
  });

  // update task
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/api/v1/user_route/task/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-tasks"]);
      setEditingTask(null);
      setForm(emptyForm);
      setFormError(null);
    },
    onError: (error) => {
      setFormError(error.response?.data?.message || "Failed to update task");
    },
  });

  // delete task
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/api/v1/user_route/task/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-tasks"]);
    },
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.title) return setFormError("Title is required");
    if (editingTask) {
      updateMutation.mutate({ id: editingTask._id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    });
    setActiveSection("tasks");
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-md flex flex-col py-8 px-4 gap-2">
        <h1 className="text-xl font-bold text-gray-800 mb-6 px-2">Dashboard</h1>

        <button
          onClick={() => setActiveSection("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeSection === "profile"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          👤 My Profile
        </button>

        <button
          onClick={() => { setActiveSection("tasks"); setEditingTask(null); setForm(emptyForm); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeSection === "tasks"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          📝 My Tasks
        </button>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-10 py-8">

        {/* PROFILE SECTION */}
        {activeSection === "profile" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
            {profile ? (
              <div className="bg-white rounded-xl shadow p-6 max-w-md">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide">Name</label>
                    <p className="text-gray-800 font-medium mt-1">{profile.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide">Email</label>
                    <p className="text-gray-800 font-medium mt-1">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide">Role</label>
                    <p className="text-gray-800 font-medium mt-1 capitalize">{profile.role}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide">Member Since</label>
                    <p className="text-gray-800 font-medium mt-1">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Loading profile...</p>
            )}
          </div>
        )}

        {/* TASKS SECTION */}
        {activeSection === "tasks" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tasks</h2>

            {/* Add / Edit Form */}
            <div className="bg-white rounded-xl shadow p-6 mb-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h3>

              {formError && (
                <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Task title"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Optional description"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingTask ? "Update Task" : "Add Task"}
                  </button>
                  {editingTask && (
                    <button
                      onClick={() => { setEditingTask(null); setForm(emptyForm); setFormError(null); }}
                      className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Task list */}
            {isLoading && <p className="text-gray-400 text-sm">Loading tasks...</p>}

            {!isLoading && tasks.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">No tasks yet.</p>
                <p className="text-sm mt-1">Add your first task above.</p>
              </div>
            )}

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-xl shadow-sm border px-6 py-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4 mt-1">
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(task._id)}
                      disabled={deleteMutation.isPending}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}