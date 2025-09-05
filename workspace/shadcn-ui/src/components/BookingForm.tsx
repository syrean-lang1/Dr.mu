import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react';
import { BookingFormData } from '@/types';
import { dataService } from '@/services/dataService';
import { notificationService } from '@/services/notificationService';

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    age: 0,
    phone: '',
    condition: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.condition || formData.age <= 0) {
      notificationService.showError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.phone.length < 10) {
      notificationService.showError('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const appointment = dataService.createAppointment(formData);
      
      notificationService.showSuccess(
        'تم حجز موعدك بنجاح!',
        `رقم الحجز: ${appointment.id.slice(-6)}`
      );
      
      // Reset form
      setFormData({
        name: '',
        age: 0,
        phone: '',
        condition: ''
      });
      
    } catch (error) {
      notificationService.showError('حدث خطأ أثناء حجز الموعد');
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            عيادة الدكتور مصطفى اليوسف
          </h1>
          <p className="text-lg text-gray-600">احجز موعدك الآن</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              حجز موعد جديد
            </CardTitle>
            <CardDescription className="text-blue-100">
              يرجى ملء البيانات التالية لحجز موعدك
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right flex items-center gap-2">
                    <User className="h-4 w-4" />
                    الاسم الكامل *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-right"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-right flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    العمر *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="أدخل عمرك"
                    min="1"
                    max="120"
                    value={formData.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className="text-right"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-right flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="text-right"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition" className="text-right flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  وصف الحالة *
                </Label>
                <Textarea
                  id="condition"
                  placeholder="اكتب وصفاً مختصراً للحالة أو السبب في زيارة العيادة"
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="text-right min-h-[100px]"
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  <strong>ملاحظة:</strong> سيتم التواصل معك خلال 24 ساعة لتأكيد الموعد وتحديد الوقت المناسب
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري الحجز...' : 'احجز الموعد'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">للاستفسارات والطوارئ</p>
          <p className="font-semibold">هاتف العيادة: 011-234-5678</p>
          <p className="text-sm mt-4">ساعات العمل: من 9 صباحاً إلى 6 مساءً</p>
        </div>
      </div>
    </div>
  );
}