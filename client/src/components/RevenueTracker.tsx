import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, ShoppingBag } from 'lucide-react';

interface RevenueData {
  totalCommissions: number;
  adRevenue: number;
  totalOrders: number;
  activeSellers: number;
  monthlyGrowth: number;
}

export function RevenueTracker() {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalCommissions: 0,
    adRevenue: 0,
    totalOrders: 0,
    activeSellers: 0,
    monthlyGrowth: 0,
  });

  useEffect(() => {
    // Load revenue data from localStorage or API
    const storedData = localStorage.getItem('platformRevenue');
    if (storedData) {
      setRevenueData(JSON.parse(storedData));
    }
  }, []);

  const updateRevenue = (type: 'commission' | 'ad', amount: number) => {
    setRevenueData(prev => {
      const updated = {
        ...prev,
        totalCommissions: type === 'commission' ? prev.totalCommissions + amount : prev.totalCommissions,
        adRevenue: type === 'ad' ? prev.adRevenue + amount : prev.adRevenue,
      };
      localStorage.setItem('platformRevenue', JSON.stringify(updated));
      return updated;
    });
  };

  const totalRevenue = revenueData.totalCommissions + revenueData.adRevenue;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            <DollarSign className="h-4 w-4 mr-2" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            +{revenueData.monthlyGrowth}% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Commission Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            ${revenueData.totalCommissions.toFixed(2)}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            10% from each sale
          </p>
        </CardContent>
      </Card>

      <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Ad Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            ${revenueData.adRevenue.toFixed(2)}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            From banner ads
          </p>
        </CardContent>
      </Card>

      <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            <Users className="h-4 w-4 mr-2" />
            Active Sellers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">
            {revenueData.activeSellers}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Generating commissions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}