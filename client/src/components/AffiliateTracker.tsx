import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp } from "lucide-react";

interface AffiliateClick {
  id: string;
  productId: number;
  productName: string;
  timestamp: Date;
  estimatedCommission: number;
}

interface AffiliateTrackerProps {
  productId?: number;
  productName?: string;
  productPrice?: number;
  amazonUrl?: string;
}

export function AffiliateTracker({ productId, productName, productPrice, amazonUrl }: AffiliateTrackerProps) {
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    // Load affiliate data from localStorage
    const storedClicks = localStorage.getItem('affiliateClicks');
    if (storedClicks) {
      const parsedClicks = JSON.parse(storedClicks).map((click: any) => ({
        ...click,
        timestamp: new Date(click.timestamp)
      }));
      setClicks(parsedClicks);
      
      const total = parsedClicks.reduce((sum: number, click: AffiliateClick) => 
        sum + click.estimatedCommission, 0
      );
      setTotalCommission(total);
    }
  }, []);

  const trackAffiliateClick = () => {
    if (!productId || !productName || !productPrice) return;

    const newClick: AffiliateClick = {
      id: Date.now().toString(),
      productId,
      productName,
      timestamp: new Date(),
      estimatedCommission: productPrice * 0.04, // 4% commission estimate
    };

    const updatedClicks = [...clicks, newClick];
    setClicks(updatedClicks);
    setTotalCommission(prev => prev + newClick.estimatedCommission);
    
    // Store in localStorage
    localStorage.setItem('affiliateClicks', JSON.stringify(updatedClicks));

    // Open Amazon link
    if (amazonUrl) {
      window.open(amazonUrl, '_blank');
    }
  };

  if (productId && amazonUrl) {
    // Product view - show affiliate button
    return (
      <Button
        onClick={trackAffiliateClick}
        variant="outline"
        className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        View on Amazon (Affiliate Link)
      </Button>
    );
  }

  // Dashboard view - show analytics
  return (
    <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <CardHeader>
        <CardTitle className="flex items-center" style={{ color: 'var(--text-primary)' }}>
          <TrendingUp className="h-5 w-5 mr-2" />
          Affiliate Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              {clicks.length}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Total Clicks
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              ${totalCommission.toFixed(2)}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Estimated Earnings
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">
              4%
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Commission Rate
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Recent Clicks
          </h3>
          {clicks.slice(-5).reverse().map((click) => (
            <div key={click.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {click.productName}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {click.timestamp.toLocaleDateString()}
                </p>
              </div>
              <p className="font-bold text-green-500">
                +${click.estimatedCommission.toFixed(2)}
              </p>
            </div>
          ))}
          {clicks.length === 0 && (
            <p className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>
              No affiliate clicks yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}