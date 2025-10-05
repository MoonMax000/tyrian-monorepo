/**
 * Authentication modal types
 * Moved from old Header component
 */

export type TAuthorizationModal = 'login' | 'registration' | 'recovery' | null;

export interface AuthModalConfig {
  title: string;
  component: React.ReactElement;
  footerText: React.ReactElement;
  footerAction: () => void;
}
