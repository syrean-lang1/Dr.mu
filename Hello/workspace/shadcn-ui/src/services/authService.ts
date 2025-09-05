import { User, UserRole, AuthResult } from '@/types';

// Hardcoded passwords as per requirements
const ADMIN_PASSWORD = 'a0988';
const TECH_SUPPORT_PASSWORD = 'ahmed0988634015';

// Mock users
const mockUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    role: UserRole.ADMIN,
    created_at: new Date(),
    last_login: new Date(),
    is_active: true
  },
  {
    id: 'tech-1',
    username: 'tech_support',
    role: UserRole.TECH_SUPPORT,
    created_at: new Date(),
    last_login: new Date(),
    is_active: true
  }
];

class AuthService {
  private currentUser: User | null = null;

  authenticateAdmin(password: string): AuthResult {
    if (password === ADMIN_PASSWORD) {
      const user = mockUsers.find(u => u.role === UserRole.ADMIN);
      if (user) {
        this.currentUser = { ...user, last_login: new Date() };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return {
          success: true,
          user: this.currentUser,
          token: 'mock-admin-token'
        };
      }
    }
    return {
      success: false,
      error: 'كلمة المرور غير صحيحة'
    };
  }

  authenticateTechSupport(password: string): AuthResult {
    if (password === TECH_SUPPORT_PASSWORD) {
      const user = mockUsers.find(u => u.role === UserRole.TECH_SUPPORT);
      if (user) {
        this.currentUser = { ...user, last_login: new Date() };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return {
          success: true,
          user: this.currentUser,
          token: 'mock-tech-token'
        };
      }
    }
    return {
      success: false,
      error: 'كلمة المرور غير صحيحة'
    };
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role || false;
  }
}

export const authService = new AuthService();