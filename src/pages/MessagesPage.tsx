import React, { useState, useEffect } from "react";
import { 
  Search, 
  Video, 
  Phone, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send,
  MessageCircle,
  CheckCircle2,
  X
} from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultAvatar } from "../utils/avatars";

export default function MessagesPage() {
  const { user, API_BASE } = useAuth();
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE}/messages/conversations/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [API_BASE, user]);

  // Fetch messages when chat is selected
  const fetchMessages = async (userId1: number, userId2: number) => {
    try {
      const response = await fetch(`${API_BASE}/messages/${userId1}/${userId2}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!user || !activeChat || !newMessage.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: activeChat.user_id,
          content: newMessage.trim()
        }),
      });
      if (response.ok) {
        setNewMessage("");
        fetchMessages(user.id, activeChat.user_id);
        fetchConversations(); // Refresh conversations
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="bg-[#f9f9ff] h-screen flex flex-col font-sans text-[#141b2b] overflow-hidden">
      <StudentNavbar activePage="messages" />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Conversations */}
        <section className="w-80 bg-white border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#022448] mb-6 tracking-tight">Conversations</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full bg-[#f1f3ff] border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#022448]/10 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            {loading && (
              <div className="flex justify-center items-center py-10">
                <div className="text-gray-500 text-sm">Loading conversations...</div>
              </div>
            )}
            {!loading && conversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-[#022448] mb-2">No conversations yet</h3>
                <p className="text-gray-500 text-sm">Start a conversation with an alumni!</p>
              </div>
            )}
            {!loading && conversations.map((chat) => (
              <div 
                key={chat.user_id}
                onClick={() => {
                  setActiveChat(chat);
                  fetchMessages(user!.id, chat.user_id);
                }}
                className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group ${activeChat?.user_id === chat.user_id ? 'bg-[#e9edff]' : 'hover:bg-[#f1f3ff]'}`}
              >
                <div className="relative shrink-0">
                  <img 
                    src={chat.profile_picture || getDefaultAvatar(chat.full_name)} 
                    alt={chat.full_name} 
                    className="w-12 h-12 rounded-full object-cover shadow-sm" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className={`font-bold truncate ${activeChat?.user_id === chat.user_id ? 'text-[#022448]' : 'text-gray-700'}`}>
                      {chat.full_name}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {chat.last_message_time}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${activeChat?.user_id === chat.user_id ? 'text-[#0b61a1] font-medium italic' : 'text-gray-500'}`}>
                    {chat.last_message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Chat Area */}
        <section className="flex-1 flex flex-col bg-white relative overflow-hidden">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <header className="flex items-center justify-between px-8 py-5 border-b border-gray-50 bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <img 
                    src={activeChat.profile_picture || getDefaultAvatar(activeChat.full_name)} 
                    alt={activeChat.full_name} 
                    className="w-10 h-10 rounded-full object-cover shadow-sm" 
                  />
                  <div>
                    <h3 className="font-bold text-[#022448] leading-tight text-base">{activeChat.full_name}</h3>
                    <p className="text-[11px] text-gray-400 font-bold tracking-wide uppercase">{activeChat.role || "Alumni"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-[#022448] transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-[#022448] transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fbfbfe]">
                {messages.length === 0 && (
                  <div className="flex justify-center items-center py-20 text-center">
                    <div className="text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  </div>
                )}
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex items-end gap-3 ${msg.sender_id === user?.id ? 'flex-row-reverse' : ''} max-w-[75%] ${msg.sender_id === user?.id ? 'ml-auto' : ''}`}
                  >
                    <img 
                      src={msg.sender_id === user?.id 
                        ? user.profile_picture || getDefaultAvatar(user.full_name) 
                        : activeChat.profile_picture || getDefaultAvatar(activeChat.full_name)} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full mb-1" 
                    />
                    <div className="space-y-1">
                      <div className={`${msg.sender_id === user?.id ? 'bg-[#022448] text-white rounded-2xl rounded-br-none' : 'bg-[#e9edff] text-[#022448] rounded-2xl rounded-bl-none'} p-5 shadow-sm`}>
                        <p className="text-[15px] leading-relaxed">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 px-1">
                        <span className="text-[10px] font-bold text-gray-400">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.sender_id === user?.id && (
                          <CheckCircle2 className="w-3 h-3 text-[#0b61a1]" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <footer className="p-6 bg-white border-t border-gray-50">
                <div className="max-w-4xl mx-auto flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-2 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-[#022448]/5 transition-all">
                  <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#022448] transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Write a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border-none focus:ring-0 text-sm py-3 bg-transparent"
                  />
                  <div className="flex items-center gap-2 pr-2">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#022448] transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      className="bg-[#022448] text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#022448]/20 hover:scale-105 active:scale-95 transition-transform"
                    >
                      <Send className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </footer>
            </>
          ) : (
            /* Empty/Default State */
            <div className="flex-1 flex items-center justify-center p-12 bg-[#f9f9ff]">
              <div className="max-w-md w-full bg-[#e9edff] rounded-[2.5rem] p-10 text-center shadow-sm border border-white">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/80 p-4 rounded-full shadow-inner">
                    <MessageCircle className="w-10 h-10 text-[#022448]" />
                  </div>
                </div>
                <p className="text-[#022448] font-medium leading-relaxed mb-6">
                  Select a conversation to start chatting
                </p>
                <div className="flex justify-center">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-[#0b61a1]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Sidebar: Profile Preview (Optional but shown in HTML) */}
        {activeChat && (
          <section className="w-72 bg-white border-l border-gray-50 hidden xl:flex flex-col p-8 overflow-y-auto animate-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <img 
                  className="w-32 h-32 rounded-[2rem] object-cover shadow-xl rotate-3 border-4 border-white" 
                  src={activeChat.profile_picture || getDefaultAvatar(activeChat.full_name)} 
                  alt={activeChat.full_name} 
                />
                <div className="absolute -bottom-2 -right-2 bg-[#7cbaff] text-[#001d36] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm -rotate-3">
                  Alumni
                </div>
              </div>
              <h4 className="text-xl font-bold text-[#022448]">{activeChat.full_name}</h4>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide mt-1">{activeChat.role || "Alumni"}</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#022448] mb-4">Recent Activity</h5>
                <div className="bg-[#f9f9ff] p-4 rounded-2xl border border-gray-50">
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    Active on the platform
                  </p>
                </div>
              </div>

              <button className="w-full py-4 rounded-xl border border-gray-100 text-[#022448] text-[10px] font-bold uppercase tracking-widest hover:bg-[#f1f3ff] transition-all">
                View Full Profile
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
