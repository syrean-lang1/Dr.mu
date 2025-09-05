import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Stethoscope, Settings, MessageSquare, Calendar } from 'lucide-react';
import { UserRole } from '@/types';
import { authService } from '@/services/authService';
import { notificationService } from '@/services/notificationService';
import BookingForm from '@/components/BookingForm';
import AdminDashboard from '@/components/AdminDashboard';
import TechSupportPanel from '@/components/TechSupportPanel';
import ChatSystem from '@/components/ChatSystem';

type AppView = 'home' | 'booking' | 'admin-login' | 'admin-dashboard' | 'tech-login' | 'tech-panel' | 'chat';

const App = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      if (currentUser.role === UserRole.ADMIN) {
        setCurrentView('admin-dashboard');
      } else if (currentUser.role === UserRole.TECH_SUPPORT) {
        setCurrentView('tech-panel');
      }
    }
  }, []);

  const handleAdminLogin = async () => {
    if (!password.trim()) {
      notificationService.showError('يرجى إدخال كلمة المرور');
      return;
    }

    setIsLoading(true);
    try {
      const result = authService.authenticateAdmin(password);
      if (result.success) {
        notificationService.showSuccess('تم تسجيل الدخول بنجاح');
        setCurrentView('admin-dashboard');
        setPassword('');
      } else {
        notificationService.showError(result.error || 'كلمة المرور غير صحيحة');
      }
    } catch (error) {
      notificationService.showError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTechSupportLogin = async () => {
    if (!password.trim()) {
      notificationService.showError('يرجى إدخال كلمة المرور');
      return;
    }

    setIsLoading(true);
    try {
      const result = authService.authenticateTechSupport(password);
      if (result.success) {
        notificationService.showSuccess('تم تسجيل الدخول بنجاح');
        setCurrentView('tech-panel');
        setPassword('');
      } else {
        notificationService.showError(result.error || 'كلمة المرور غير صحيحة');
      }
    } catch (error) {
      notificationService.showError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentView('home');
    setPassword('');
    notificationService.showInfo('تم تسجيل الخروج بنجاح');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'booking':
        return <BookingForm />;
      
      case 'admin-dashboard':
        return <AdminDashboard onLogout={handleLogout} />;
      
      case 'tech-panel':
        return <TechSupportPanel onLogout={handleLogout} />;
      
      case 'chat':
        return <ChatSystem onBack={() => setCurrentView('home')} />;
      
      case 'admin-login':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">دخول الإدارة</CardTitle>
                <CardDescription>أدخل كلمة مرور الإدارة للوصول للوحة التحكم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">كلمة المرور</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                    className="text-right"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAdminLogin} 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'جاري التحقق...' : 'دخول'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentView('home');
                      setPassword('');
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'tech-login':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">دخول الدعم الفني</CardTitle>
                <CardDescription>أدخل كلمة مرور الدعم الفني للوصول للوحة الإدارة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tech-password">كلمة المرور</Label>
                  <Input
                    id="tech-password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTechSupportLogin()}
                    className="text-right"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleTechSupportLogin} 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'جاري التحقق...' : 'دخول'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentView('home');
                      setPassword('');
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="mb-6">
                  <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                    <Stethoscope className="h-12 w-12 text-blue-600" />
                  </div>
                  <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    عيادة الدكتور مصطفى اليوسف
                  </h1>
                  <p className="text-xl text-gray-600">
                    نظام إدارة العيادة الشامل
                  </p>
                </div>
              </div>

              {/* Main Menu */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Patient Booking */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent 
                    className="p-6 text-center"
                    onClick={() => setCurrentView('booking')}
                  >
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                      <Calendar className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">حجز موعد</h3>
                    <p className="text-sm text-gray-600">احجز موعدك في العيادة</p>
                  </CardContent>
                </Card>

                {/* Admin Dashboard */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent 
                    className="p-6 text-center"
                    onClick={() => setCurrentView('admin-login')}
                  >
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                      <Lock className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">لوحة الإدارة</h3>
                    <p className="text-sm text-gray-600">إدارة المواعيد والمرضى</p>
                  </CardContent>
                </Card>

                {/* Tech Support */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent 
                    className="p-6 text-center"
                    onClick={() => setCurrentView('tech-login')}
                  >
                    <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit group-hover:bg-purple-200 transition-colors">
                      <Settings className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">الدعم الفني</h3>
                    <p className="text-sm text-gray-600">إدارة المحتوى والإعدادات</p>
                  </CardContent>
                </Card>

                {/* Chat System */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent 
                    className="p-6 text-center"
                    onClick={() => setCurrentView('chat')}
                  >
                    <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit group-hover:bg-orange-200 transition-colors">
                      <MessageSquare className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">الدردشة</h3>
                    <p className="text-sm text-gray-600">التواصل مع العيادة</p>
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <div className="mt-12 text-center text-gray-600">
                <p className="mb-2">للاستفسارات والطوارئ</p>
                <p className="font-semibold text-lg">هاتف العيادة: 011-234-5678</p>
                <p className="text-sm mt-4">ساعات العمل: من 9 صباحاً إلى 6 مساءً</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <Toaster position="top-center" />
      {renderContent()}
    </TooltipProvider>
  );
};

export default App;