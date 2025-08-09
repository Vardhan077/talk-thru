import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Send, MoreVertical, Phone, Video, Settings, ArrowLeft, Moon, Sun, User, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SettingsPanel from './SettingsPanel';
import ProfilePopup from './ProfilePopup';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface Message {
  id?: string;
  message: string;
  sender: string;
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read';
}

interface User {
  _id: string;
  username: string;
  photoURL?: string;
  hasUnseen?: boolean;
}

const API = 'http://localhost:5000/api';

export default function WhatsAppChat() {
  const { currentUser, allUsers, setCurrentUser, setAllUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const fetchMessages = async () => {
    if (!selectedUser || !currentUser) return;
    try {
      const res = await axios.get(
        `${API}/messages/${currentUser.username}/${selectedUser.username}`,
        { withCredentials: true }
      );
      setMessages(res.data);
    } catch (err) {
      console.error('Message fetch failed');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/me`, { withCredentials: true });
      setAllUsers(res.data.users);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUser) return;
    try {
      await axios.post(
        `${API}/send`,
        {
          sender: currentUser.username,
          receiver: selectedUser.username,
          message: newMessage,
        },
        { withCredentials: true }
      );
      setNewMessage('');
      fetchMessages();
      fetchUsers();
    } catch (err) {
      console.error('Send failed');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API}/logout`, { withCredentials: true });
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout failed');
    }
  };

  const getDisplayName = (email: string) =>
    email && email.includes('@') ? email.split('@')[0] : email || '';

  const getAvatar = (user: User) =>
    user?.photoURL || 'https://res.cloudinary.com/dg9itycrz/image/upload/v1734767663/avatar_i8vrav.png';

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'read':
        return <span className="text-blue-400">✓✓</span>;
      case 'delivered':
        return '✓✓';
      case 'sent':
      default:
        return '✓';
    }
  };

  const filteredUsers = (allUsers || []).filter(user =>
    getDisplayName(user.username).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowMobileChat(true);
    // Update unseen status
    const updatedUsers = allUsers.map((u) =>
      u.username === user.username ? { ...u, hasUnseen: false } : u
    );
    setAllUsers(updatedUsers);
  };

  const handleBackToContacts = () => {
    setShowMobileChat(false);
    setSelectedUser(null);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(() => {
        fetchMessages();
        fetchUsers();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  // Fetch users after login
  useEffect(() => {
    if (currentUser && (!allUsers || allUsers.length === 0)) {
      setLoading(true);
      axios
        .get(`${API}/users`, { withCredentials: true })
        .then((res) => setAllUsers(res.data))
        .catch((err) => {
          console.error('Failed to fetch users:', err);
          setAllUsers([]);
        })
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-chat-background">
      {/* Sidebar */}
      <div className={`w-full md:w-[400px] bg-chat-sidebar-background border-r border-chat-sidebar-border flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Sidebar Header */}
        <div className="p-4 bg-whatsapp-green border-b border-chat-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar 
                className="h-10 w-10 cursor-pointer"
                onClick={() => currentUser && setProfileUser(currentUser)}
              >
                <AvatarImage src={currentUser ? getAvatar(currentUser) : "/placeholder.svg"} />
                <AvatarFallback className="bg-white text-whatsapp-green">
                  {currentUser ? getDisplayName(currentUser.username).charAt(0).toUpperCase() : 'Me'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <span className="font-medium text-white block">WhatsApp</span>
                <span className="text-xs text-white/70">
                  {currentUser ? getDisplayName(currentUser.username) : ''}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-whatsapp-green-dark hidden md:flex"
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-whatsapp-green-dark md:hidden"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-whatsapp-green-dark hidden md:flex"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => currentUser && setProfileUser(currentUser)}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-chat-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`p-3 cursor-pointer hover:bg-accent transition-colors border-b border-chat-sidebar-border last:border-b-0 ${
                  selectedUser?.username === user.username ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar 
                      className="h-12 w-12 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileUser(user);
                      }}
                    >
                      <AvatarImage src={getAvatar(user)} />
                      <AvatarFallback>{getDisplayName(user.username).charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-foreground truncate">
                        {getDisplayName(user.username)}
                      </h3>
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">
                        {user.username}
                      </p>
                      {user.hasUnseen && (
                        <Badge className="bg-whatsapp-green text-white text-xs">
                          •
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!showMobileChat && !selectedUser ? 'hidden md:flex' : 'flex'}`}>
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center bg-chat-background">
            <div className="text-center text-muted-foreground">
              <div className="mb-4">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <Send className="h-12 w-12" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">WhatsApp Web</h3>
              <p className="text-sm">Send and receive messages without keeping your phone online.</p>
            </div>
          </div>
        ) : (
          <>
        {/* Chat Header */}
        <div className="p-4 bg-whatsapp-green-light border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-muted-foreground"
              onClick={handleBackToContacts}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={getAvatar(selectedUser)} />
              <AvatarFallback>{getDisplayName(selectedUser.username).charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-foreground">{getDisplayName(selectedUser.username)}</h2>
              <p className="text-sm text-muted-foreground">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hidden md:flex">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hidden md:flex">
              <Phone className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => selectedUser && setProfileUser(selectedUser)}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-chat-background">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.sender === currentUser?.username ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-lg shadow-sm ${
                message.sender === currentUser?.username 
                  ? 'bg-whatsapp-green text-white rounded-br-none' 
                  : 'bg-card text-foreground rounded-bl-none border'
              }`}>
                <p className="text-sm leading-relaxed">{message.message}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                  message.sender === currentUser?.username ? 'text-white/70' : 'text-muted-foreground'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.sender === currentUser?.username && (
                    <span className="text-xs ml-1">
                      {getStatusIcon(message.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-card border-t border-border">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Type a message"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border-0 bg-background focus-visible:ring-1"
            />
            <Button 
              onClick={sendMessage}
              size="icon"
              className="bg-whatsapp-green hover:bg-whatsapp-green-dark text-white rounded-full"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        </>
        )}
      </div>
      
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      {profileUser && (
        <ProfilePopup user={profileUser} onClose={() => setProfileUser(null)} />
      )}
    </div>
  );
}