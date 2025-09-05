import { 
  Patient, 
  Appointment, 
  AppointmentStatus, 
  Message, 
  MessageType, 
  ChatSession, 
  SystemContent, 
  ContentType,
  BookingFormData,
  AppointmentFilters,
  MessageData
} from '@/types';

class DataService {
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Patient Management
  createPatient(data: BookingFormData): Patient {
    const patient: Patient = {
      id: this.generateId(),
      name: data.name,
      age: data.age,
      phone: data.phone,
      condition: data.condition,
      created_at: new Date(),
      updated_at: new Date()
    };

    const patients = this.getPatients();
    patients.push(patient);
    localStorage.setItem('patients', JSON.stringify(patients));
    return patient;
  }

  getPatients(): Patient[] {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : [];
  }

  getPatientByPhone(phone: string): Patient | null {
    const patients = this.getPatients();
    return patients.find(p => p.phone === phone) || null;
  }

  // Appointment Management
  createAppointment(data: BookingFormData): Appointment {
    let patient = this.getPatientByPhone(data.phone);
    if (!patient) {
      patient = this.createPatient(data);
    }

    const appointment: Appointment = {
      id: this.generateId(),
      patient_id: patient.id,
      patient: patient,
      appointment_date: new Date(),
      appointment_time: this.getNextAvailableTime(),
      status: AppointmentStatus.PENDING,
      notes: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const appointments = this.getAppointments();
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Send confirmation message
    this.sendMessage({
      recipient_phone: patient.phone,
      content: `مرحباً ${patient.name}، تم حجز موعدك بنجاح. سيتم التواصل معك قريباً لتأكيد الموعد.`,
      message_type: MessageType.APPOINTMENT_CONFIRMATION,
      appointment_id: appointment.id
    });

    return appointment;
  }

  getAppointments(filters?: AppointmentFilters): Appointment[] {
    const stored = localStorage.getItem('appointments');
    let appointments: Appointment[] = stored ? JSON.parse(stored) : [];
    
    // Convert string dates back to Date objects
    appointments = appointments.map(apt => ({
      ...apt,
      appointment_date: new Date(apt.appointment_date),
      created_at: new Date(apt.created_at),
      updated_at: new Date(apt.updated_at)
    }));

    if (filters) {
      if (filters.date) {
        const filterDate = new Date(filters.date);
        appointments = appointments.filter(apt => 
          apt.appointment_date.toDateString() === filterDate.toDateString()
        );
      }
      if (filters.status) {
        appointments = appointments.filter(apt => apt.status === filters.status);
      }
      if (filters.patient_name) {
        appointments = appointments.filter(apt => 
          apt.patient.name.toLowerCase().includes(filters.patient_name!.toLowerCase())
        );
      }
    }

    return appointments.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  private getNextAvailableTime(): string {
    const now = new Date();
    const hour = now.getHours();
    
    // Clinic hours: 9 AM to 6 PM
    if (hour < 9) return '09:00';
    if (hour >= 18) return '09:00'; // Next day
    
    const nextHour = hour + 1;
    return `${nextHour.toString().padStart(2, '0')}:00`;
  }

  // Message Management
  sendMessage(data: MessageData): Message {
    const message: Message = {
      id: this.generateId(),
      sender_id: 'clinic',
      recipient_id: data.recipient_phone,
      content: data.content,
      message_type: data.message_type,
      appointment_id: data.appointment_id,
      is_read: false,
      sent_at: new Date()
    };

    const messages = this.getMessages();
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));

    // Simulate SMS sending
    console.log(`SMS sent to ${data.recipient_phone}: ${data.content}`);
    
    return message;
  }

  getMessages(): Message[] {
    const stored = localStorage.getItem('messages');
    const messages: Message[] = stored ? JSON.parse(stored) : [];
    
    return messages.map(msg => ({
      ...msg,
      sent_at: new Date(msg.sent_at)
    })).sort((a, b) => b.sent_at.getTime() - a.sent_at.getTime());
  }

  // Chat Management
  createChatSession(patientPhone: string): ChatSession {
    const session: ChatSession = {
      id: this.generateId(),
      patient_phone: patientPhone,
      is_active: true,
      created_at: new Date(),
      last_message_at: new Date(),
      messages: []
    };

    const sessions = this.getChatSessions();
    sessions.push(session);
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
    return session;
  }

  getChatSessions(): ChatSession[] {
    const stored = localStorage.getItem('chatSessions');
    const sessions: ChatSession[] = stored ? JSON.parse(stored) : [];
    
    return sessions.map(session => ({
      ...session,
      created_at: new Date(session.created_at),
      last_message_at: new Date(session.last_message_at),
      messages: session.messages.map(msg => ({
        ...msg,
        sent_at: new Date(msg.sent_at)
      }))
    }));
  }

  sendChatMessage(sessionId: string, content: string, sender: string): Message {
    const sessions = this.getChatSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('Chat session not found');
    }

    const message: Message = {
      id: this.generateId(),
      sender_id: sender,
      recipient_id: session.patient_phone,
      content: content,
      message_type: MessageType.CHAT_MESSAGE,
      is_read: false,
      sent_at: new Date()
    };

    session.messages.push(message);
    session.last_message_at = new Date();
    
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
    return message;
  }

  // System Content Management
  getSystemContent(): SystemContent[] {
    const stored = localStorage.getItem('systemContent');
    if (!stored) {
      // Initialize with default content
      const defaultContent: SystemContent[] = [
        {
          id: this.generateId(),
          content_key: 'clinic_name',
          content_value: 'عيادة الدكتور مصطفى اليوسف',
          content_type: ContentType.TEXT,
          updated_by: 'system',
          updated_at: new Date()
        },
        {
          id: this.generateId(),
          content_key: 'welcome_message',
          content_value: 'مرحباً بكم في عيادة الدكتور مصطفى اليوسف. نحن هنا لخدمتكم.',
          content_type: ContentType.TEXT,
          updated_by: 'system',
          updated_at: new Date()
        },
        {
          id: this.generateId(),
          content_key: 'clinic_hours',
          content_value: 'ساعات العمل: من 9 صباحاً إلى 6 مساءً',
          content_type: ContentType.TEXT,
          updated_by: 'system',
          updated_at: new Date()
        }
      ];
      localStorage.setItem('systemContent', JSON.stringify(defaultContent));
      return defaultContent;
    }
    
    const content: SystemContent[] = JSON.parse(stored);
    return content.map(item => ({
      ...item,
      updated_at: new Date(item.updated_at)
    }));
  }

  updateSystemContent(key: string, value: string, userId: string): SystemContent {
    const content = this.getSystemContent();
    const item = content.find(c => c.content_key === key);
    
    if (item) {
      item.content_value = value;
      item.updated_by = userId;
      item.updated_at = new Date();
    } else {
      const newItem: SystemContent = {
        id: this.generateId(),
        content_key: key,
        content_value: value,
        content_type: ContentType.TEXT,
        updated_by: userId,
        updated_at: new Date()
      };
      content.push(newItem);
    }
    
    localStorage.setItem('systemContent', JSON.stringify(content));
    return item || content[content.length - 1];
  }
}

export const dataService = new DataService();