import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MessageSquare, Filter, Users, Clock, Phone, FileText, Send, LogOut } from 'lucide-react';
import { Appointment, AppointmentStatus, MessageType } from '@/types';
import { dataService } from '@/services/dataService';
import { notificationService } from '@/services/notificationService';
import { authService } from '@/services/authService';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, selectedDate, statusFilter, searchName]);

  const loadAppointments = () => {
    const data = dataService.getAppointments();
    setAppointments(data);
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filtered = filtered.filter(apt => 
        apt.appointment_date.toDateString() === filterDate.toDateString()
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (searchName) {
      filtered = filtered.filter(apt => 
        apt.patient.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig = {
      [AppointmentStatus.PENDING]: { label: 'في الانتظار', variant: 'secondary' as const },
      [AppointmentStatus.CONFIRMED]: { label: 'مؤكد', variant: 'default' as const },
      [AppointmentStatus.CANCELLED]: { label: 'ملغي', variant: 'destructive' as const },
      [AppointmentStatus.COMPLETED]: { label: 'مكتمل', variant: 'outline' as const },
      [AppointmentStatus.NO_SHOW]: { label: 'لم يحضر', variant: 'secondary' as const }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleSendMessage = () => {
    if (!selectedAppointment || !messageContent.trim()) {
      notificationService.showError('يرجى كتابة محتوى الرسالة');
      return;
    }

    try {
      dataService.sendMessage({
        recipient_phone: selectedAppointment.patient.phone,
        content: messageContent,
        message_type: MessageType.GENERAL_MESSAGE,
        appointment_id: selectedAppointment.id
      });

      notificationService.showSuccess('تم إرسال الرسالة بنجاح');
      setMessageContent('');
      setIsMessageDialogOpen(false);
      setSelectedAppointment(null);
    } catch (error) {
      notificationService.showError('فشل في إرسال الرسالة');
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              لوحة الإدارة
            </h1>
            <p className="text-lg text-gray-600">إدارة مواعيد العيادة</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">إجمالي المواعيد</p>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">في الانتظار</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(a => a.status === AppointmentStatus.PENDING).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">مؤكدة</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(a => a.status === AppointmentStatus.CONFIRMED).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">الرسائل</p>
                  <p className="text-2xl font-bold">{dataService.getMessages().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فلترة المواعيد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-filter">التاريخ</Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-filter">الحالة</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الحالات</SelectItem>
                    <SelectItem value={AppointmentStatus.PENDING}>في الانتظار</SelectItem>
                    <SelectItem value={AppointmentStatus.CONFIRMED}>مؤكد</SelectItem>
                    <SelectItem value={AppointmentStatus.CANCELLED}>ملغي</SelectItem>
                    <SelectItem value={AppointmentStatus.COMPLETED}>مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name-search">البحث بالاسم</Label>
                <Input
                  id="name-search"
                  type="text"
                  placeholder="ابحث عن اسم المريض"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المواعيد ({filteredAppointments.length})</CardTitle>
            <CardDescription>
              جميع المواعيد المحجوزة في العيادة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد مواعيد تطابق الفلترة المحددة</p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-4">
                            <h3 className="text-lg font-semibold">{appointment.patient.name}</h3>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(appointment.appointment_date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(appointment.appointment_time)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{appointment.patient.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>العمر: {appointment.patient.age} سنة</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 mt-3">
                            <FileText className="h-4 w-4 mt-1 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">وصف الحالة:</p>
                              <p className="text-sm text-gray-600">{appointment.patient.condition}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedAppointment(appointment)}
                                className="flex items-center gap-2"
                              >
                                <MessageSquare className="h-4 w-4" />
                                إرسال رسالة
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>إرسال رسالة للمريض</DialogTitle>
                                <DialogDescription>
                                  إرسال رسالة نصية إلى {selectedAppointment?.patient.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="message">محتوى الرسالة</Label>
                                  <Textarea
                                    id="message"
                                    placeholder="اكتب رسالتك هنا..."
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    className="text-right min-h-[100px]"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={handleSendMessage} className="flex-1">
                                    <Send className="h-4 w-4 mr-2" />
                                    إرسال
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => {
                                      setIsMessageDialogOpen(false);
                                      setMessageContent('');
                                      setSelectedAppointment(null);
                                    }}
                                  >
                                    إلغاء
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}