import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Phone, Clock, User, ArrowLeft } from 'lucide-react';
import { ChatSession, Message, MessageType } from '@/types';
import { dataService } from '@/services/dataService';
import { notificationService } from '@/services/notificationService';

interface ChatSystemProps {
  onBack: () => void;
}

export default function ChatSystem({ onBack }: ChatSystemProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [newSessionPhone, setNewSessionPhone] = useState<string>('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedSession?.messages]);

  const loadChatSessions = () => {
    const sessions = dataService.getChatSessions();
    setChatSessions(sessions);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateSession = () => {
    if (!newSessionPhone.trim()) {
      notificationService.showError('يرجى إدخال رقم الهاتف');
      return;
    }

    try {
      const session = dataService.createChatSession(newSessionPhone);
      setChatSessions(prev => [session, ...prev]);
      setSelectedSession(session);
      setNewSessionPhone('');
      setIsCreatingSession(false);
      notificationService.showSuccess('تم إنشاء جلسة دردشة جديدة');
    } catch (error) {
      notificationService.showError('فشل في إنشاء جلسة الدردشة');
      console.error('Create session error:', error);
    }
  };

  const handleSendMessage = () => {
    if (!selectedSession || !newMessage.trim()) {
      notificationService.showError('يرجى كتابة رسالة');
      return;
    }

    try {
      const message = dataService.sendChatMessage(
        selectedSession.id,
        newMessage,
        'clinic'
      );

      // Update local state
      setSelectedSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, message],
          last_message_at: new Date()
        };
      });

      // Update sessions list
      setChatSessions(prev => 
        prev.map(session => 
          session.id === selectedSession.id 
            ? { ...session, messages: [...session.messages, message], last_message_at: new Date() }
            : session
        )
      );

      setNewMessage('');
      notificationService.showSuccess('تم إرسال الرسالة');
    } catch (error) {
      notificationService.showError('فشل في إرسال الرسالة');
      console.error('Send message error:', error);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              نظام الدردشة
            </h1>
            <p className="text-lg text-gray-600">التواصل مع المرضى</p>
          </div>
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            العودة
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Sessions List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  جلسات الدردشة
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => setIsCreatingSession(true)}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  جديد
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isCreatingSession && (
                <div className="p-4 border-b bg-blue-50">
                  <div className="space-y-3">
                    <Input
                      placeholder="رقم الهاتف"
                      value={newSessionPhone}
                      onChange={(e) => setNewSessionPhone(e.target.value)}
                      className="text-right"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleCreateSession}>
                        إنشاء
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setIsCreatingSession(false);
                          setNewSessionPhone('');
                        }}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <ScrollArea className="h-[500px]">
                <div className="p-2 space-y-2">
                  {chatSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد جلسات دردشة</p>
                    </div>
                  ) : (
                    chatSessions.map((session) => (
                      <Card 
                        key={session.id}
                        className={`cursor-pointer transition-colors ${
                          selectedSession?.id === session.id 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">{session.patient_phone}</span>
                                {session.is_active && (
                                  <Badge variant="default" className="text-xs">نشط</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(session.last_message_at)}</span>
                              </div>
                              {session.messages.length > 0 && (
                                <p className="text-sm text-gray-600 mt-2 truncate">
                                  {session.messages[session.messages.length - 1].content}
                                </p>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {session.messages.length}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-2">
            {selectedSession ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>{selectedSession.patient_phone}</CardTitle>
                      <CardDescription>
                        بدأت في {formatDate(selectedSession.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0 flex flex-col h-[500px]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedSession.messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>لا توجد رسائل في هذه الجلسة</p>
                          <p className="text-sm">ابدأ المحادثة بإرسال رسالة</p>
                        </div>
                      ) : (
                        selectedSession.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender_id === 'clinic' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender_id === 'clinic'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === 'clinic' 
                                  ? 'text-blue-100' 
                                  : 'text-gray-500'
                              }`}>
                                {formatTime(message.sent_at)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="اكتب رسالتك هنا..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="text-right"
                      />
                      <Button onClick={handleSendMessage} className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        إرسال
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">اختر جلسة دردشة</h3>
                  <p>اختر جلسة من القائمة أو أنشئ جلسة جديدة للبدء</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}