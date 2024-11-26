import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Subscription {
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  subscription: Subscription | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<AuthState['user']>) => void;
  updateSubscription: (subscription: Subscription) => void;
}

// For demo purposes, we'll use a simplified auth
const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      subscription: null,
      login: async (email: string, password: string) => {
        // Demo login - in production, this would validate against a backend
        if (email === DEMO_USER.email && password === 'demo123') {
          set({ 
            isAuthenticated: true,
            user: DEMO_USER,
            subscription: {
              plan: 'pro',
              status: 'active',
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      signup: async (email: string, password: string, name: string) => {
        // Demo signup - in production, this would create a user in the backend
        set({ 
          isAuthenticated: true,
          user: {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name
          },
          subscription: {
            plan: 'starter',
            status: 'active',
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          }
        });
      },
      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null,
          subscription: null
        });
      },
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
      updateSubscription: (subscription) => {
        set({ subscription });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        subscription: state.subscription
      })
    }
  )
);