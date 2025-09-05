import { toast } from 'sonner';

class NotificationService {
  sendSMS(phone: string, message: string): boolean {
    try {
      // Simulate SMS sending
      console.log(`📱 SMS to ${phone}: ${message}`);
      
      // Show toast notification for demo
      toast.success(`تم إرسال رسالة إلى ${phone}`, {
        description: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        duration: 4000
      });
      
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      toast.error('فشل في إرسال الرسالة');
      return false;
    }
  }

  showSuccess(message: string, description?: string): void {
    toast.success(message, {
      description,
      duration: 3000
    });
  }

  showError(message: string, description?: string): void {
    toast.error(message, {
      description,
      duration: 4000
    });
  }

  showInfo(message: string, description?: string): void {
    toast.info(message, {
      description,
      duration: 3000
    });
  }

  showWarning(message: string, description?: string): void {
    toast.warning(message, {
      description,
      duration: 3000
    });
  }
}

export const notificationService = new NotificationService();