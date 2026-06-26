import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  UserCheck, 
  LogOut,
  GraduationCap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AdminSidebarProps {
  activePage: 'dashboard' | 'users' | 'verifications' | 'alumni';
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
    { id: 'users', label: 'User Management', icon: Users, path: '/dashboard/admin/users' },
    { id: 'verifications', label: 'Verifications', icon: ShieldCheck, path: '/dashboard/admin/verifications' },
    { id: 'alumni', label: 'Alumni Management', icon: UserCheck, path: '/dashboard/admin/alumni' },
  ];

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f8f9ff] border-r border-gray-100 flex flex-col p-6 z-50 hidden lg:flex">
      <div className="flex items-center gap-4 px-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-[#022448] flex items-center justify-center text-white shadow-xl shadow-[#022448]/20">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#022448] tracking-tight leading-tight">Admin Portal</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Management Suite</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="space-y-1">
          <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Main Menu</p>
          
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all text-left whitespace-nowrap ${
                activePage === item.id ? 'bg-white text-[#022448] shadow-sm' : 'text-gray-400 hover:text-[#022448] hover:bg-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
        <button 
          onClick={() => logout(navigate)}
          className="w-full flex items-center gap-4 px-5 py-4 text-gray-400 hover:text-red-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
