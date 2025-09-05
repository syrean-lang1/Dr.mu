# تصميم النظام - تطبيق إدارة عيادة الدكتور مصطفى اليوسف

## Implementation approach

سنقوم بتطوير تطبيق ويب شامل لإدارة العيادة باستخدام تقنيات حديثة ومكتبات مفتوحة المصدر. النهج المتبع يركز على:

### التحديات التقنية الرئيسية:
1. **الأمان والخصوصية**: حماية البيانات الطبية الحساسة
2. **المصادقة متعددة المستويات**: نظام دخول مختلف للإدارة والدعم الفني
3. **التواصل الفوري**: نظام رسائل ودردشة في الوقت الفعلي
4. **إدارة المواعيد المعقدة**: فلترة وتنظيم المواعيد بكفاءة

### الإطار التقني المختار:
- **Frontend**: React.js مع TypeScript لضمان type safety
- **UI Framework**: Shadcn-ui مع Tailwind CSS للتصميم المتجاوب
- **Backend**: Node.js مع Express.js للأداء العالي
- **Database**: PostgreSQL لقاعدة البيانات الرئيسية مع Redis للتخزين المؤقت
- **Real-time Communication**: Socket.io للرسائل الفورية
- **Authentication**: JWT مع bcrypt للتشفير
- **Validation**: Zod للتحقق من صحة البيانات
- **State Management**: Zustand لإدارة الحالة
- **Date Management**: date-fns للتعامل مع التواريخ

### مبادئ التصميم:
1. **Security First**: تشفير شامل وحماية متعددة الطبقات
2. **User Experience**: واجهة بسيطة وسهلة الاستخدام
3. **Scalability**: قابلية التوسع لدعم نمو العيادة
4. **Maintainability**: كود منظم وقابل للصيانة

## Data structures and interfaces

```mermaid
classDiagram
    class User {
        +id: string
        +username: string
        +password_hash: string
        +role: UserRole
        +created_at: Date
        +last_login: Date
        +is_active: boolean
        +login(password: string) Promise~AuthResult~
        +logout() void
        +validatePassword(password: string) boolean
    }

    class Patient {
        +id: string
        +name: string
        +age: number
        +phone: string
        +condition: string
        +created_at: Date
        +updated_at: Date
        +validatePhone() boolean
        +validateAge() boolean
        +getFullInfo() PatientInfo
    }

    class Appointment {
        +id: string
        +patient_id: string
        +appointment_date: Date
        +appointment_time: string
        +status: AppointmentStatus
        +notes: string
        +created_at: Date
        +updated_at: Date
        +cancel() void
        +reschedule(new_date: Date, new_time: string) void
        +confirm() void
        +getPatientInfo() Patient
    }

    class Message {
        +id: string
        +sender_id: string
        +recipient_id: string
        +content: string
        +message_type: MessageType
        +appointment_id: string
        +is_read: boolean
        +sent_at: Date
        +markAsRead() void
        +getMessageThread() Message[]
    }

    class ChatSession {
        +id: string
        +patient_phone: string
        +is_active: boolean
        +created_at: Date
        +last_message_at: Date
        +messages: Message[]
        +sendMessage(content: string, sender: string) Message
        +closeSession() void
        +getMessageHistory() Message[]
    }

    class SystemContent {
        +id: string
        +content_key: string
        +content_value: string
        +content_type: ContentType
        +updated_by: string
        +updated_at: Date
        +updateContent(new_value: string, user_id: string) void
        +getContent(key: string) string
    }

    class ActivityLog {
        +id: string
        +user_id: string
        +action: string
        +resource_type: string
        +resource_id: string
        +details: string
        +ip_address: string
        +timestamp: Date
        +logActivity(action: string, details: string) void
        +getLogsByUser(user_id: string) ActivityLog[]
    }

    class AuthService {
        +generateToken(user: User) string
        +verifyToken(token: string) User
        +hashPassword(password: string) string
        +comparePassword(password: string, hash: string) boolean
        +authenticateAdmin(password: string) AuthResult
        +authenticateTechSupport(password: string) AuthResult
    }

    class AppointmentService {
        +createAppointment(data: AppointmentData) Appointment
        +getAppointments(filters: AppointmentFilters) Appointment[]
        +getAppointmentsByDate(date: Date) Appointment[]
        +updateAppointment(id: string, data: Partial~AppointmentData~) Appointment
        +cancelAppointment(id: string) void
        +getAvailableSlots(date: Date) string[]
    }

    class MessageService {
        +sendMessage(data: MessageData) Message
        +getMessages(filters: MessageFilters) Message[]
        +markAsRead(message_id: string) void
        +sendAppointmentReminder(appointment_id: string) Message
        +broadcastMessage(content: string) Message[]
    }

    class ChatService {
        +createChatSession(patient_phone: string) ChatSession
        +getChatSession(session_id: string) ChatSession
        +sendChatMessage(session_id: string, content: string, sender: string) Message
        +getActiveSessions() ChatSession[]
        +closeChatSession(session_id: string) void
    }

    class ContentService {
        +getContent(key: string) string
        +updateContent(key: string, value: string, user_id: string) SystemContent
        +getAllContent() SystemContent[]
        +getContentHistory(key: string) SystemContent[]
    }

    class NotificationService {
        +sendSMS(phone: string, message: string) boolean
        +sendAppointmentConfirmation(appointment: Appointment) void
        +sendAppointmentReminder(appointment: Appointment) void
        +notifyAppointmentChange(appointment: Appointment) void
    }

    %% Enums
    class UserRole {
        <<enumeration>>
        ADMIN
        TECH_SUPPORT
        PATIENT
    }

    class AppointmentStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        CANCELLED
        COMPLETED
        NO_SHOW
    }

    class MessageType {
        <<enumeration>>
        APPOINTMENT_CONFIRMATION
        APPOINTMENT_REMINDER
        HEALTH_GUIDANCE
        GENERAL_MESSAGE
        CHAT_MESSAGE
    }

    class ContentType {
        <<enumeration>>
        TEXT
        HTML
        CONFIGURATION
        TEMPLATE
    }

    %% Relationships
    Patient ||--o{ Appointment : has
    Appointment ||--o{ Message : generates
    User ||--o{ ActivityLog : creates
    User ||--o{ Message : sends
    ChatSession ||--o{ Message : contains
    SystemContent ||--o{ ActivityLog : tracks_changes

    %% Service Dependencies
    AuthService ..> User : authenticates
    AppointmentService ..> Appointment : manages
    AppointmentService ..> Patient : uses
    MessageService ..> Message : handles
    MessageService ..> Appointment : references
    ChatService ..> ChatSession : manages
    ChatService ..> Message : creates
    ContentService ..> SystemContent : manages
    NotificationService ..> Appointment : notifies
    NotificationService ..> Patient : contacts
```

## Program call flow

```mermaid
sequenceDiagram
    participant P as Patient
    participant UI as Frontend
    participant API as Backend API
    participant Auth as AuthService
    participant AS as AppointmentService
    participant MS as MessageService
    participant CS as ChatService
    participant DB as Database
    participant NS as NotificationService

    %% Patient Booking Flow
    Note over P,NS: Patient Appointment Booking
    P->>UI: Fill booking form (name, age, condition, phone)
    UI->>API: POST /api/appointments
    API->>AS: createAppointment(appointmentData)
    AS->>DB: INSERT appointment
    AS->>DB: INSERT/UPDATE patient
    DB-->>AS: return appointment_id
    AS->>NS: sendAppointmentConfirmation(appointment)
    NS->>P: SMS confirmation
    AS-->>API: return appointment
    API-->>UI: return success + appointment_id
    UI-->>P: Show confirmation message

    %% Admin Login and Dashboard
    Note over P,NS: Admin Dashboard Access
    P->>UI: Enter admin password (a0988)
    UI->>API: POST /api/auth/admin
    API->>Auth: authenticateAdmin(password)
    Auth->>DB: SELECT user WHERE role='ADMIN'
    DB-->>Auth: return user
    Auth->>Auth: comparePassword(password, hash)
    Auth-->>API: return JWT token
    API-->>UI: return token + user_info
    UI->>API: GET /api/appointments (with auth header)
    API->>Auth: verifyToken(token)
    Auth-->>API: return user
    API->>AS: getAppointments(filters)
    AS->>DB: SELECT appointments with patient data
    DB-->>AS: return appointments[]
    AS-->>API: return appointments
    API-->>UI: return appointments
    UI-->>P: Display appointments dashboard

    %% Date Filtering
    Note over P,NS: Date Filtering
    P->>UI: Select date filter
    UI->>API: GET /api/appointments?date=2024-01-15
    API->>AS: getAppointmentsByDate(date)
    AS->>DB: SELECT appointments WHERE date = ?
    DB-->>AS: return filtered appointments
    AS-->>API: return appointments
    API-->>UI: return filtered data
    UI-->>P: Update appointments list

    %% Send Message to Patient
    Note over P,NS: Admin Sending Message
    P->>UI: Click "Send Message" for appointment
    UI->>UI: Open message modal
    P->>UI: Type message content
    UI->>API: POST /api/messages
    API->>MS: sendMessage(messageData)
    MS->>DB: INSERT message
    MS->>NS: sendSMS(patient_phone, content)
    NS-->>MS: return delivery_status
    MS->>DB: UPDATE message SET delivery_status
    DB-->>MS: return message_id
    MS-->>API: return message
    API-->>UI: return success
    UI-->>P: Show "Message sent" confirmation

    %% Tech Support Login
    Note over P,NS: Tech Support Access
    P->>UI: Enter tech support password (ahmed0988634015)
    UI->>API: POST /api/auth/tech-support
    API->>Auth: authenticateTechSupport(password)
    Auth->>DB: SELECT user WHERE role='TECH_SUPPORT'
    DB-->>Auth: return user
    Auth->>Auth: comparePassword(password, hash)
    Auth-->>API: return JWT token
    API-->>UI: return token + user_info

    %% Content Management
    Note over P,NS: Content Management
    UI->>API: GET /api/content
    API->>ContentService: getAllContent()
    ContentService->>DB: SELECT * FROM system_content
    DB-->>ContentService: return content[]
    ContentService-->>API: return content
    API-->>UI: return content
    P->>UI: Edit content
    UI->>API: PUT /api/content/:key
    API->>ContentService: updateContent(key, value, user_id)
    ContentService->>DB: UPDATE system_content
    ContentService->>ActivityLog: logActivity("CONTENT_UPDATE")
    DB-->>ContentService: return updated_content
    ContentService-->>API: return content
    API-->>UI: return success
    UI-->>P: Show "Content updated"

    %% Chat System
    Note over P,NS: Chat Communication
    P->>UI: Open chat interface
    UI->>API: GET /api/chat/sessions
    API->>CS: getActiveSessions()
    CS->>DB: SELECT active chat_sessions
    DB-->>CS: return sessions[]
    CS-->>API: return sessions
    API-->>UI: return chat_sessions
    P->>UI: Send chat message
    UI->>API: POST /api/chat/:session_id/messages
    API->>CS: sendChatMessage(session_id, content, sender)
    CS->>DB: INSERT message
    CS->>WebSocket: broadcast message to session
    DB-->>CS: return message
    CS-->>API: return message
    API-->>UI: return success
    WebSocket-->>UI: real-time message update
    UI-->>P: Display new message

    %% Activity Logging
    Note over P,NS: System Activity Logging
    loop Every significant action
        API->>ActivityLog: logActivity(action, details)
        ActivityLog->>DB: INSERT activity_log
        DB-->>ActivityLog: return log_id
    end
```

## Anything UNCLEAR

بعد مراجعة المتطلبات، هناك بعض النقاط التي تحتاج توضيح:

### 1. تفاصيل نظام المواعيد
- **ساعات العمل**: ما هي ساعات العمل المحددة للعيادة؟
- **مدة الموعد**: كم هي المدة المخصصة لكل موعد؟
- **الحد الأقصى**: ما هو العدد الأقصى للمواعيد اليومية؟
- **أيام العطل**: هل هناك أيام عطل أو إجازات محددة؟

### 2. نظام الرسائل والإشعارات
- **SMS Integration**: هل مطلوب تكامل مع خدمة SMS فعلية أم محاكاة؟
- **تكلفة الرسائل**: ما هي الميزانية المخصصة لإرسال الرسائل؟
- **أنواع الإشعارات**: هل مطلوب إشعارات تلقائية (تذكيرات قبل الموعد بـ 24 ساعة مثلاً)؟

### 3. إدارة البيانات
- **النسخ الاحتياطي**: ما هي استراتيجية النسخ الاحتياطي المطلوبة؟
- **الاحتفاظ بالبيانات**: كم المدة المطلوبة للاحتفاظ ببيانات المرضى؟
- **الخصوصية**: هل هناك متطلبات قانونية محددة للخصوصية؟

### 4. التوسعات المستقبلية
- **أطباء متعددين**: هل سيتم دعم أكثر من طبيب في المستقبل؟
- **فروع متعددة**: هل هناك خطط لفتح فروع أخرى للعيادة؟
- **تطبيق جوال**: هل مطلوب تطوير تطبيق جوال منفصل؟

### 5. التكامل مع الأنظمة الخارجية
- **أنظمة الدفع**: هل مطلوب تكامل مع بوابات الدفع الإلكتروني؟
- **التقويم**: هل مطلوب تكامل مع Google Calendar أو Outlook؟
- **الملفات الطبية**: هل مطلوب نظام لحفظ الملفات الطبية والصور؟

هذه النقاط ستساعد في تحسين التصميم وضمان تلبية جميع الاحتياجات بدقة.