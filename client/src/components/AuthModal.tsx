import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onToggleMode: () => void;
}

// Client-side validation
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export function AuthModal({ isOpen, onClose, mode, onToggleMode }: AuthModalProps) {
  const { login, register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    isSeller: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
        newErrors.fullName = 'Full name can only contain letters and spaces';
      }

      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (mode === 'signup' && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (mode === 'login') {
      login({ 
        email: sanitizeInput(formData.email), 
        password: formData.password 
      });
    } else {
      register({
        fullName: sanitizeInput(formData.fullName),
        username: sanitizeInput(formData.username),
        email: sanitizeInput(formData.email),
        password: formData.password,
        isSeller: formData.isSeller,
      });
    }
    
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
                className={`theme-transition ${errors.fullName ? 'border-red-500' : ''}`}
                style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  color: 'var(--text-primary)' 
                }}
                required
                maxLength={100}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
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
                className={`theme-transition ${errors.username ? 'border-red-500' : ''}`}
                style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  color: 'var(--text-primary)' 
                }}
                required
                maxLength={50}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
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
              className={`theme-transition ${errors.email ? 'border-red-500' : ''}`}
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                color: 'var(--text-primary)' 
              }}
              required
              maxLength={255}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
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
              className={`theme-transition ${errors.password ? 'border-red-500' : ''}`}
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                color: 'var(--text-primary)' 
              }}
              required
              maxLength={128}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {mode === 'signup' && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Must contain uppercase, lowercase, number, and special character
              </p>
            )}
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