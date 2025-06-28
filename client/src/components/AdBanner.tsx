import { useEffect, useState } from 'react';

interface AdBannerProps {
  placement: 'header' | 'sidebar' | 'footer';
  className?: string;
}

export function AdBanner({ placement, className = '' }: AdBannerProps) {
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    // Load Google AdSense script
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    script.onload = () => {
      setIsAdLoaded(true);
      // Initialize ads
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      } catch (error) {
        console.log('Ad loading error:', error);
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const getAdDimensions = () => {
    switch (placement) {
      case 'header':
        return { width: '728px', height: '90px' }; // Leaderboard
      case 'sidebar':
        return { width: '300px', height: '250px' }; // Medium Rectangle
      case 'footer':
        return { width: '320px', height: '50px' }; // Mobile Banner
      default:
        return { width: '300px', height: '250px' };
    }
  };

  const dimensions = getAdDimensions();

  return (
    <div className={`ad-container ${className}`} style={{ 
      width: dimensions.width, 
      height: dimensions.height,
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px 0'
    }}>
      {isAdLoaded ? (
        <ins 
          className="adsbygoogle"
          style={{ 
            display: 'block',
            width: dimensions.width,
            height: dimensions.height
          }}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
          data-ad-slot={`${placement}-slot-id`}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '12px',
          textAlign: 'center'
        }}>
          <div>Advertisement</div>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>
            {dimensions.width} × {dimensions.height}
          </div>
        </div>
      )}
    </div>
  );
}