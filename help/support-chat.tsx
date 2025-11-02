'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User,
  Bot,
  Headphones,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdate: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'support' | 'bot';
  timestamp: string;
  senderName?: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'TICK-001',
    subject: 'AI responses not generating for Yelp reviews',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z',
    lastUpdate: '2024-01-15T14:20:00Z'
  },
  {
    id: 'TICK-002',
    subject: 'Question about multi-location setup',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2024-01-14T09:15:00Z',
    lastUpdate: '2024-01-14T16:45:00Z'
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! I\'m here to help you with any questions about Revally. How can I assist you today?',
    sender: 'bot',
    timestamp: '2024-01-15T10:00:00Z'
  }
];

export function SupportChat() {
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'contact'>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as const
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. I\'m processing your request and will connect you with a support agent shortly.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleCreateTicket = () => {
    // Simulate ticket creation
    console.log('Creating ticket:', newTicket);
    setNewTicket({ subject: '', description: '', priority: 'medium' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
              <Headphones className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Support Center</h2>
              <p className="text-muted-foreground">
                Get help from our support team via chat, tickets, or direct contact
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={cn(
            "border-2 hover:shadow-lg transition-all cursor-pointer",
            activeTab === 'chat' 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
              : "border-gray-200/50 dark:border-gray-700/50"
          )}
          onClick={() => setActiveTab('chat')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Instant support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "border-2 hover:shadow-lg transition-all cursor-pointer",
            activeTab === 'tickets' 
              ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
              : "border-gray-200/50 dark:border-gray-700/50"
          )}
          onClick={() => setActiveTab('tickets')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                <FileText className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Support Tickets</h3>
                <p className="text-sm text-muted-foreground">Track your requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "border-2 hover:shadow-lg transition-all cursor-pointer",
            activeTab === 'contact' 
              ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20" 
              : "border-gray-200/50 dark:border-gray-700/50"
          )}
          onClick={() => setActiveTab('contact')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                <Phone className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium">Contact Info</h3>
                <p className="text-sm text-muted-foreground">Direct contact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'chat' && (
        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Live Chat Support
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                Online
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto space-y-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
              {chatMessages.map((message) => (
                <div key={message.id} className={cn(
                  "flex gap-3",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}>
                  {message.sender !== 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        {message.sender === 'bot' ? (
                          <Bot className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  <div className={cn(
                    "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                    message.sender === 'user' 
                      ? "bg-blue-500 text-white" 
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  )}>
                    <p className="text-sm">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      message.sender === 'user' ? "text-blue-100" : "text-muted-foreground"
                    )}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Create New Ticket */}
          <Card className="border-2 border-green-200/50 dark:border-green-800/50">
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Detailed description of your issue"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
              <Button onClick={handleCreateTicket} className="w-full">
                Create Ticket
              </Button>
            </CardContent>
          </Card>

          {/* Existing Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Your Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{ticket.id}</span>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(ticket.lastUpdate).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-medium mb-1">{ticket.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'contact' && (
        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email Support</h4>
                    <p className="text-sm text-muted-foreground">support@revally.com</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                    <Phone className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Phone Support</h4>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">Monday - Friday</p>
                    <p className="text-xs text-muted-foreground">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Emergency Support</h4>
                    <p className="text-sm text-muted-foreground">For urgent issues only</p>
                    <p className="text-xs text-muted-foreground">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}