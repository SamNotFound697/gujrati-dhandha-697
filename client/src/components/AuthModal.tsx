import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onToggleMode: () => void;
}

export function AuthModal({ isOpen, onClose, mode, onToggleMode }: AuthModalProps) {
  const { login, register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    isSeller: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      login({ email: formData.email, password: formData.password });
    } else {
      register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        isSeller: formData.isSeller,
      });
    }
    
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md w-full theme-transition"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--text-primary)' }}>
            {mode === 'signup' ? 'Sign Up' : 'Sign In'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <Label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </Label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className="theme-transition"
                style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  color: 'var(--text-primary)' 
                }}
                required
              />
            </div>
          )}
          
          {mode === 'signup' && (
            <div>
              <Label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Username
              </Label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Choose a username"
                className="theme-transition"
                style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  color: 'var(--text-primary)' 
                }}
                required
              />
            </div>
          )}
          
          <div>
            <Label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Email
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className="theme-transition"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                color: 'var(--text-primary)' 
              }}
              required
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Password
            </Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              className="theme-transition"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                color: 'var(--text-primary)' 
              }}
              required
            />
          </div>
          
          {mode === 'signup' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isSeller"
                checked={formData.isSeller}
                onChange={(e) => handleInputChange('isSeller', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isSeller" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                I want to sell products
              </Label>
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-white hover:bg-orange-600 transition-colors font-medium"
          >
            {isLoading ? 'Loading...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
          </Button>
        </form>
        
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            <Button
              type="button"
              variant="link"
              onClick={onToggleMode}
              className="text-accent hover:underline ml-1 p-0 h-auto"
            >
              {mode === 'signup' ? 'Sign In' : 'Sign Up'}
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
