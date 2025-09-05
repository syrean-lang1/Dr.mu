import { Appointment, ChatMessage, EditableText } from '@/types';

// Appointments
export const getAppointments = (): Appointment[] => {
  const stored = localStorage.getItem('clinic_appointments');
  return stored ? JSON.parse(stored) : [];
};

export const saveAppointment = (appointment: Appointment): void => {
  const appointments = getAppointments();
  appointments.push(appointment);
  localStorage.setItem('clinic_appointments', JSON.stringify(appointments));
};

export const deleteAppointment = (id: string): void => {
  const appointments = getAppointments().filter(apt => apt.id !== id);
  localStorage.setItem('clinic_appointments', JSON.stringify(appointments));
};

// Chat Messages
export const getChatMessages = (): ChatMessage[] => {
  const stored = localStorage.getItem('clinic_chat_messages');
  return stored ? JSON.parse(stored) : [];
};

export const saveChatMessage = (message: ChatMessage): void => {
  const messages = getChatMessages();
  messages.push(message);
  localStorage.setItem('clinic_chat_messages', JSON.stringify(messages));
};

// Editable Texts
export const getEditableTexts = (): EditableText[] => {
  const stored = localStorage.getItem('clinic_editable_texts');
  if (!stored) {
    // Initialize with default texts
    const defaultTexts: EditableText[] = [
      {
        id: '1',
        key: 'clinic_name',
        content: 'عيادة الدكتور مصطفى اليوسف',
        lastModified: new Date().toISOString()
      },
      {
        id: '2',
        key: 'clinic_description',
        content: 'عيادة متخصصة في تقديم أفضل الخدمات الطبية',
        lastModified: new Date().toISOString()
      },
      {
        id: '3',
        key: 'working_hours',
        content: 'ساعات العمل: من 9 صباحاً إلى 6 مساءً',
        lastModified: new Date().toISOString()
      }
    ];
    localStorage.setItem('clinic_editable_texts', JSON.stringify(defaultTexts));
    return defaultTexts;
  }
  return JSON.parse(stored);
};

export const updateEditableText = (id: string, content: string): void => {
  const texts = getEditableTexts();
  const textIndex = texts.findIndex(text => text.id === id);
  if (textIndex !== -1) {
    texts[textIndex].content = content;
    texts[textIndex].lastModified = new Date().toISOString();
    localStorage.setItem('clinic_editable_texts', JSON.stringify(texts));
  }
};

export const getEditableTextByKey = (key: string): string => {
  const texts = getEditableTexts();
  const text = texts.find(t => t.key === key);
  return text ? text.content : '';
};