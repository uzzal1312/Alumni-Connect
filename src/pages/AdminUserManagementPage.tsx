import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Plus,
  Download,
  MoreVertical,
  Eye,
  Slash,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Footer from "../components/Footer";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AdminUserManagementPage() {
  const { API_BASE, token } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchUsers = async () => {
    try {
      console.log('=== fetchUsers called ===');
      const params = new URLSearchParams();
      if (roleFilter) params.set("role", roleFilter);
      if (searchQuery) params.set("search", searchQuery);

      console.log('API url:', `${API_BASE}/admin/users?${params}`);
      const response = await fetch(`${API_BASE}/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response ok:', response.ok);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
      }
      if (response.ok) {
        const data = await response.json();
        console.log('Data received:', data);
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const manageUser = async (userId: number, action: "delete" | "verify") => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        fetchUsers();
        setSelectedUsers((prev) => prev.filter((id) => id !== userId));
        setOpenMenuId(null);
      }
    } catch (error) {
      console.error("Error managing user:", error);
    }
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleAllUsers = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((u) => u.id));
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchQuery]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen font-sans text-[#141b2b] antialiased flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-[#141b2b] antialiased">
      <AdminSidebar activePage="users" />

      <main className="lg:ml-72 min-h-screen flex flex-col relative">
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50">
          <div className="flex justify-between items-center px-12 h-20">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                className="w-full pl-12 pr-6 py-3 bg-[#f1f3ff] border-none rounded-2xl text-sm font-bold text-[#022448] focus:ring-4 focus:ring-[#022448]/5 transition-all"
                placeholder="Global search..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-[#022448] transition-colors p-2 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[2px] bg-gray-100 mx-2"></div>
              <button className="bg-[#f1f3ff] text-[#022448] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-white border border-transparent hover:border-[#f1f3ff] transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </button>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwfuBVnXYxJpNz5tL_8bVSOzkQDGpqvU178PIj3tODK0jbf00DKIuwIlZ92N1aYf0ANCmotm1J2p5PmpLTtpq8DPNRYADcXKeqLwYEWQnT-1tNEZBzYQTXH6H2DCXbirjfsxzMcmrIqBAAlaj7tMnURlDbq-qDOhxECY8I3JpkYdhCnhqXLmUQNFrASClb0tgDcaCt_Ien3MKIbebcsYD_mbmuyQ5anzIiEhcFFsb7W4orbeZ0e3CjDMzPAUkh8fvlJeaB4vh5qS4"
                className="w-10 h-10 rounded-full object-cover ring-4 ring-[#f1f3ff]"
                alt="Admin"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-12 space-y-12 flex-1 no-scrollbar">
          {/* Page Title */}
          <section>
            <h1 className="text-[3.5rem] font-black text-[#022448] tracking-tighter mb-2 leading-none">User Management</h1>
            <p className="text-gray-500 font-medium">Total active members: <span className="text-[#022448] font-black">{users.length}</span></p>
          </section>

          {/* Filters Bar */}
          <section className="p-8 bg-[#f8f9ff] rounded-[2.5rem] border border-gray-100 flex flex-wrap items-center gap-8 shadow-sm">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-2xl text-sm font-bold text-[#022448] shadow-sm focus:ring-4 focus:ring-[#022448]/5 transition-all outline-none"
                placeholder="Search by name, email, or skill..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <select
                className="bg-white border-none rounded-2xl py-4 pl-6 pr-12 text-[10px] font-black uppercase tracking-widest text-[#022448] shadow-sm focus:ring-4 focus:ring-[#022448]/5 transition-all cursor-pointer appearance-none"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="admin">Admin</option>
              </select>

              <select
                className="bg-white border-none rounded-2xl py-4 pl-6 pr-12 text-[10px] font-black uppercase tracking-widest text-[#022448] shadow-sm focus:ring-4 focus:ring-[#022448]/5 transition-all cursor-pointer appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>

              <button className="flex items-center gap-3 px-8 py-4 text-[#022448] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#f1f3ff] rounded-2xl transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </section>

          {/* Table */}
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden relative">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9ff]">
                  <th className="p-8 w-16">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg border-gray-200 text-[#022448] focus:ring-[#022448] cursor-pointer"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={toggleAllUsers}
                    />
                  </th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Name</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Email</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Role</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Joined Date</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className={`hover:bg-[#f8f9ff]/50 transition-colors group ${selectedUsers.includes(user.id) ? "bg-[#022448]/5" : ""}`}>
                    <td className="p-8">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-lg border-gray-200 text-[#022448] focus:ring-[#022448] cursor-pointer"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={user.full_name} />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-[#022448] flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                            {user.full_name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-black text-[#022448]">{user.full_name}</p>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-sm font-bold text-gray-500">{user.email}</td>
                    <td className="p-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        user.role === "admin"
                          ? "bg-[#022448] text-white"
                          : user.role === "alumni"
                          ? "bg-[#f1f3ff] text-[#0b61a1]"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-8">
                      <span className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                        user.is_verified ? "text-green-500" : "text-amber-500"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          user.is_verified ? "bg-green-500" : "bg-amber-500 animate-pulse"
                        }`}></div>
                        {user.is_verified ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="p-8 text-sm font-bold text-gray-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                    </td>
                    <td className="p-8 text-right relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="p-2 text-gray-300 hover:text-[#022448] transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openMenuId === user.id && (
                        <div className="absolute right-8 top-16 w-56 bg-white shadow-2xl rounded-3xl border border-gray-100 z-[100] p-4 animate-in zoom-in-95 fade-in duration-200">
                          <button className="w-full flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-[#022448] hover:bg-[#f8f9ff] rounded-2xl transition-all">
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                          {!user.is_verified && (
                            <button
                              onClick={() => manageUser(user.id, "verify")}
                              className="w-full flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all"
                            >
                              <Eye className="w-4 h-4" />
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => manageUser(user.id, "delete")}
                            className="w-full flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-10 bg-[#f8f9ff]/50 border-t border-gray-50">
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Showing 1 to {users.length} of {users.length} entries</p>
              <div className="flex items-center gap-3">
                <button className="p-3 text-gray-300 hover:text-[#022448] hover:bg-white rounded-xl transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 bg-[#022448] text-white flex items-center justify-center font-black rounded-xl shadow-xl shadow-[#022448]/20">1</button>
                <button className="p-3 text-gray-300 hover:text-[#022448] hover:bg-white rounded-xl transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Floating Bar */}
        {selectedUsers.length > 0 && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="bg-[#022448] text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-12 border border-white/10">
              <div className="flex items-center gap-4 pr-12 border-r border-white/10">
                <div className="w-10 h-10 bg-white text-[#022448] flex items-center justify-center rounded-2xl font-black text-lg shadow-inner">
                  {selectedUsers.length}
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em]">Users selected</p>
              </div>

              <div className="flex items-center gap-6">
                <button className="flex items-center gap-3 px-8 py-3.5 bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity">
                  <Eye className="w-4 h-4" />
                  Suspend Selected
                </button>
                <button className="flex items-center gap-3 px-8 py-3.5 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
                <button onClick={() => setSelectedUsers([])} className="p-3 text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}