import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface PasswordProtectionProps {
  correctPassword: string;
  title: string;
  description: string;
  onAuthenticated: () => void;
}

export default function PasswordProtection({ 
  correctPassword, 
  title, 
  description, 
  onAuthenticated 
}: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onAuthenticated();
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
          <CardDescription className="text-gray-600">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-right"
                dir="rtl"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 text-right">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              دخول
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}