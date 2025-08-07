import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Send, MoreVertical, Phone, Video, Settings, ArrowLeft, Moon, Sun } from "lucide-react";
import SettingsPanel from './SettingsPanel';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    avatar: '/placeholder.svg',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '12:30',
    unreadCount: 3,
    isOnline: true
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: '/placeholder.svg',
    lastMessage: 'Thanks for the update',
    timestamp: '11:45',
    isOnline: false
  },
  {
    id: '3',
    name: 'Design Team',
    avatar: '/placeholder.svg',
    lastMessage: 'New designs are ready for review',
    timestamp: 'Yesterday',
    unreadCount: 1,
    isOnline: true
  }
];

const sampleMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! How are you doing?',
    sender: 'them',
    timestamp: '12:28',
    status: 'read'
  },
  {
    id: '2',
    text: 'I\'m doing great! Just finished working on the new project.',
    sender: 'me',
    timestamp: '12:29',
    status: 'read'
  },
  {
    id: '3',
    text: 'That sounds awesome! Can\'t wait to see it.',
    sender: 'them',
    timestamp: '12:30',
    status: 'delivered'
  }
];

export default function WhatsAppChat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      status: 'sent'
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const filteredContacts = sampleContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setShowMobileChat(true);
  };

  const handleBackToContacts = () => {
    setShowMobileChat(false);
    setSelectedContact(null);
  };

  return (
    <div className="flex h-screen bg-chat-background">
      {/* Sidebar */}
      <div className={`w-full md:w-[400px] bg-chat-sidebar-background border-r border-chat-sidebar-border flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Sidebar Header */}
        <div className="p-4 bg-whatsapp-green border-b border-chat-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-white text-whatsapp-green">Me</AvatarFallback>
              </Avatar>
              <span className="font-medium text-white hidden md:block">WhatsApp</span>
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
              <Button variant="ghost" size="icon" className="text-white hover:bg-whatsapp-green-dark hidden md:flex">
                <MoreVertical className="h-5 w-5" />
              </Button>
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
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactSelect(contact)}
              className={`p-3 cursor-pointer hover:bg-accent transition-colors border-b border-chat-sidebar-border last:border-b-0 ${
                selectedContact?.id === contact.id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-whatsapp-green rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unreadCount && (
                      <Badge className="bg-whatsapp-green text-white text-xs">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!showMobileChat && !selectedContact ? 'hidden md:flex' : 'flex'}`}>
        {!selectedContact ? (
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
              <AvatarImage src={selectedContact.avatar} />
              <AvatarFallback>{selectedContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-foreground">{selectedContact.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedContact.isOnline ? 'Online' : 'Last seen recently'}
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
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-chat-background">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-lg shadow-sm ${
                message.sender === 'me' 
                  ? 'bg-whatsapp-green text-white rounded-br-none' 
                  : 'bg-card text-foreground rounded-bl-none border'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                  message.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'
                }`}>
                  <span>{message.timestamp}</span>
                  {message.sender === 'me' && (
                    <span className={`text-xs ml-1 ${
                      message.status === 'read' ? 'text-blue-400' : ''
                    }`}>
                      {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-card border-t border-border">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
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
    </div>
  );
}