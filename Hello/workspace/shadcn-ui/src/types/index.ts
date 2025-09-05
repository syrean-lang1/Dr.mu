// User and Authentication Types
export interface User {
  id: string;
  username: string;
  role: UserRole;
  created_at: Date;
  last_login: Date;
  is_active: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TECH_SUPPORT = 'TECH_SUPPORT',
  PATIENT = 'PATIENT'
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Patient and Appointment Types
export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  condition: string;
  created_at: Date;
  updated_at: Date;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient: Patient;
  appointment_date: Date;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

// Message and Chat Types
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: MessageType;
  appointment_id?: string;
  is_read: boolean;
  sent_at: Date;
}

export enum MessageType {
  APPOINTMENT_CONFIRMATION = 'APPOINTMENT_CONFIRMATION',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  HEALTH_GUIDANCE = 'HEALTH_GUIDANCE',
  GENERAL_MESSAGE = 'GENERAL_MESSAGE',
  CHAT_MESSAGE = 'CHAT_MESSAGE'
}

export interface ChatSession {
  id: string;
  patient_phone: string;
  is_active: boolean;
  created_at: Date;
  last_message_at: Date;
  messages: Message[];
}

// System Content Types
export interface SystemContent {
  id: string;
  content_key: string;
  content_value: string;
  content_type: ContentType;
  updated_by: string;
  updated_at: Date;
}

export enum ContentType {
  TEXT = 'TEXT',
  HTML = 'HTML',
  CONFIGURATION = 'CONFIGURATION',
  TEMPLATE = 'TEMPLATE'
}

// Form Data Types
export interface BookingFormData {
  name: string;
  age: number;
  phone: string;
  condition: string;
}

export interface AppointmentFilters {
  date?: Date;
  status?: AppointmentStatus;
  patient_name?: string;
}

export interface MessageData {
  recipient_phone: string;
  content: string;
  message_type: MessageType;
  appointment_id?: string;
}