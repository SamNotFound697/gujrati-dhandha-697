import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, DollarSign } from 'lucide-react';

export function MinorBusinessSetup() {
  const [setupData, setSetupData] = useState({
    guardianName: '',
    guardianEmail: '',
    businessName: 'Gujrati Dhandha',
    guardianPhone: '',
    relationship: 'Brother',
  });

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleSetup = async () => {
    // In production, this would call your backend API
    console.log('Setting up business account with guardian:', setupData);
    setIsSetupComplete(true);
  };

  return (
    <Card className="max-w-2xl mx-auto theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <CardHeader>
        <CardTitle className="flex items-center" style={{ color: 'var(--text-primary)' }}>
          <Shield className="h-5 w-5 mr-2" />
          Minor Business Account Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Since you're under 18, we'll set up the business account with your brother as the legal guardian. 
            This ensures compliance with financial regulations while keeping you in control of operations.
          </AlertDescription>
        </Alert>

        {!isSetupComplete ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Guardian Name (Your Brother)</Label>
                <Input
                  value={setupData.guardianName}
                  onChange={(e) => setSetupData(prev => ({ ...prev, guardianName: e.target.value }))}
                  placeholder="Enter your brother's full name"
                />
              </div>
              <div>
                <Label>Guardian Email</Label>
                <Input
                  type="email"
                  value={setupData.guardianEmail}
                  onChange={(e) => setSetupData(prev => ({ ...prev, guardianEmail: e.target.value }))}
                  placeholder="brother@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <Input
                  value={setupData.businessName}
                  onChange={(e) => setSetupData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Gujrati Dhandha"
                />
              </div>
              <div>
                <Label>Guardian Phone</Label>
                <Input
                  value={setupData.guardianPhone}
                  onChange={(e) => setSetupData(prev => ({ ...prev, guardianPhone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                How This Works:
              </h3>
              <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Your brother will be the legal account holder</li>
                <li>• You maintain full operational control</li>
                <li>• All revenue flows to the business account</li>
                <li>• 10% commission automatically deducted from each sale</li>
                <li>• Monthly payouts to your designated account</li>
              </ul>
            </div>

            <Button
              onClick={handleSetup}
              className="w-full bg-accent hover:bg-orange-600 text-white"
              disabled={!setupData.guardianName || !setupData.guardianEmail}
            >
              Set Up Business Account
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Business Account Ready!
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your commission-based payment system is now active. You'll earn 10% from every sale!
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">10%</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Commission Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">$0</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">0</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Transactions</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}