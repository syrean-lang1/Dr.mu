import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Shield, Settings, MessageCircle, Stethoscope } from 'lucide-react';
import { getEditableTextByKey } from '@/lib/storage';

export default function Index() {
  const [clinicName, setClinicName] = useState('');
  const [clinicDescription, setClinicDescription] = useState('');
  const [workingHours, setWorkingHours] = useState('');

  useEffect(() => {
    setClinicName(getEditableTextByKey('clinic_name'));
    setClinicDescription(getEditableTextByKey('clinic_description'));
    setWorkingHours(getEditableTextByKey('working_hours'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {clinicName || 'عيادة الدكتور مصطفى اليوسف'}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {clinicDescription || 'عيادة متخصصة في تقديم أفضل الخدمات الطبية'}
          </p>
          <p className="text-lg text-gray-500">
            {workingHours || 'ساعات العمل: من 9 صباحاً إلى 6 مساءً'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Booking System */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">نظام الحجوزات</CardTitle>
              <CardDescription>احجز موعدك الآن</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/booking">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  حجز موعد جديد
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Dashboard */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">اللوحة الإدارية</CardTitle>
              <CardDescription>إدارة المواعيد</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  دخول الإدارة
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Technical Support */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">الدعم الفني</CardTitle>
              <CardDescription>تعديل النصوص</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/tech-support">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  لوحة التحكم
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Chat System */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-xl">دردشاتي</CardTitle>
              <CardDescription>رسائل العيادة</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/chat">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  عرض الرسائل
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>© 2024 عيادة الدكتور مصطفى اليوسف - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}