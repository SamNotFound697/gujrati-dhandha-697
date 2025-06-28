import { useState } from 'react';
import { Header } from '@/components/Header';
import { RevenueTracker } from '@/components/RevenueTracker';
import { MinorBusinessSetup } from '@/components/MinorBusinessSetup';
import { AdBanner } from '@/components/AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Platform Admin Dashboard
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Manage your marketplace revenue and business operations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="advertising">Advertising</TabsTrigger>
            <TabsTrigger value="setup">Business Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <RevenueTracker />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <CardHeader>
                    <CardTitle style={{ color: 'var(--text-primary)' }}>
                      Revenue Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span style={{ color: 'var(--text-secondary)' }}>Commission Revenue (10%)</span>
                        <span className="font-bold text-green-500">$0.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: 'var(--text-secondary)' }}>Ad Revenue</span>
                        <span className="font-bold text-blue-500">$0.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: 'var(--text-secondary)' }}>Affiliate Revenue</span>
                        <span className="font-bold text-purple-500">$0.00</span>
                      </div>
                      <hr />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Total Revenue</span>
                        <span className="font-bold text-xl" style={{ color: 'var(--accent)' }}>$0.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <CardHeader>
                    <CardTitle style={{ color: 'var(--text-primary)' }}>
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      View Payout History
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analytics Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Sellers
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Platform Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--text-primary)' }}>
                  Commission Payment System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                      How Commission Works:
                    </h3>
                    <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                      <li>• Customer pays full amount for product</li>
                      <li>• Platform automatically deducts 10% commission</li>
                      <li>• Remaining 90% goes to seller</li>
                      <li>• Commission is instantly credited to your account</li>
                      <li>• Monthly payouts to your bank account</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-500">10%</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your Commission</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">90%</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Seller Gets</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>$0</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Earned</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advertising">
            <div className="space-y-6">
              <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text-primary)' }}>
                    Ad Revenue Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Strategic ad placement to maximize revenue without hurting user experience.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                          Recommended Ad Networks:
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Google AdSense</span>
                            <span className="text-green-500">Best for beginners</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Amazon Associates</span>
                            <span className="text-blue-500">Product-focused</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Media.net</span>
                            <span className="text-purple-500">High-paying</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                          Ad Placement Preview:
                        </h3>
                        <div className="space-y-2">
                          <AdBanner placement="header" className="mx-auto" />
                          <AdBanner placement="sidebar" className="mx-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="setup">
            <MinorBusinessSetup />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}