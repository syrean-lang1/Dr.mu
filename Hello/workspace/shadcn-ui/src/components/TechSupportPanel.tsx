import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, LogOut, Edit, Plus, Trash2 } from 'lucide-react';
import { SystemContent, ContentType } from '@/types';
import { dataService } from '@/services/dataService';
import { notificationService } from '@/services/notificationService';
import { authService } from '@/services/authService';

interface TechSupportPanelProps {
  onLogout: () => void;
}

export default function TechSupportPanel({ onLogout }: TechSupportPanelProps) {
  const [content, setContent] = useState<SystemContent[]>([]);
  const [editingItem, setEditingItem] = useState<SystemContent | null>(null);
  const [newKey, setNewKey] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    const data = dataService.getSystemContent();
    setContent(data);
  };

  const handleSave = (item: SystemContent, newValue: string) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        notificationService.showError('خطأ في المصادقة');
        return;
      }

      dataService.updateSystemContent(item.content_key, newValue, currentUser.id);
      notificationService.showSuccess('تم حفظ التغييرات بنجاح');
      setEditingItem(null);
      loadContent();
    } catch (error) {
      notificationService.showError('فشل في حفظ التغييرات');
      console.error('Save error:', error);
    }
  };

  const handleAddNew = () => {
    if (!newKey.trim() || !newValue.trim()) {
      notificationService.showError('يرجى ملء جميع الحقول');
      return;
    }

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        notificationService.showError('خطأ في المصادقة');
        return;
      }

      dataService.updateSystemContent(newKey, newValue, currentUser.id);
      notificationService.showSuccess('تم إضافة المحتوى بنجاح');
      setNewKey('');
      setNewValue('');
      setIsAddingNew(false);
      loadContent();
    } catch (error) {
      notificationService.showError('فشل في إضافة المحتوى');
      console.error('Add error:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const getContentTypeLabel = (type: ContentType) => {
    const labels = {
      [ContentType.TEXT]: 'نص',
      [ContentType.HTML]: 'HTML',
      [ContentType.CONFIGURATION]: 'إعدادات',
      [ContentType.TEMPLATE]: 'قالب'
    };
    return labels[type] || 'غير محدد';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              لوحة الدعم الفني
            </h1>
            <p className="text-lg text-gray-600">إدارة محتوى النظام والإعدادات</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">إجمالي المحتوى</p>
                  <p className="text-2xl font-bold">{content.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Edit className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">آخر تحديث</p>
                  <p className="text-sm font-semibold">
                    {content.length > 0 ? formatDate(content[0].updated_at) : 'غير محدد'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <Button 
                    onClick={() => setIsAddingNew(true)}
                    className="w-full"
                    variant="outline"
                  >
                    إضافة محتوى جديد
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Content */}
        {isAddingNew && (
          <Card className="mb-8 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">إضافة محتوى جديد</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-key">مفتاح المحتوى</Label>
                  <Input
                    id="new-key"
                    placeholder="مثال: clinic_address"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-value">قيمة المحتوى</Label>
                  <Textarea
                    id="new-value"
                    placeholder="أدخل المحتوى هنا..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddNew} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  حفظ
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewKey('');
                    setNewValue('');
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Management */}
        <Card>
          <CardHeader>
            <CardTitle>إدارة المحتوى</CardTitle>
            <CardDescription>
              تعديل وإدارة محتوى النظام والنصوص
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {content.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا يوجد محتوى للعرض</p>
                </div>
              ) : (
                content.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{item.content_key}</h3>
                          <Badge variant="outline">
                            {getContentTypeLabel(item.content_type)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            تعديل
                          </Button>
                        </div>
                      </div>

                      {editingItem?.id === item.id ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editingItem.content_value}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              content_value: e.target.value
                            })}
                            className="text-right min-h-[100px]"
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleSave(item, editingItem.content_value)}
                              className="flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              حفظ
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingItem(null)}
                            >
                              إلغاء
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800 whitespace-pre-wrap text-right">
                              {item.content_value}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 flex justify-between">
                            <span>آخر تحديث بواسطة: {item.updated_by}</span>
                            <span>{formatDate(item.updated_at)}</span>
                          </div>
                        </div>
                      )}
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