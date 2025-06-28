import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Account() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Please Log In
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                You need to be logged in to access your account.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
  };

  const handleBecomeSeller = () => {
    // In a real app, this would update user role with proper authorization
    console.log("Becoming seller...");
  };

  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Account Settings
          </h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text-primary)' }}>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {user?.fullName || user?.username}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user?.isSeller ? "default" : "secondary"}>
                          {user?.isSeller ? "Seller" : "Buyer"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Username</Label>
                      <Input
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile} className="bg-accent hover:bg-orange-600 text-white">
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text-primary)' }}>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    No orders found. Start shopping to see your order history here!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seller">
              <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text-primary)' }}>Seller Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.isSeller ? (
                    <div>
                      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                        You're already a seller! Access your seller dashboard to manage products.
                      </p>
                      <Button asChild className="bg-accent hover:bg-orange-600 text-white">
                        <a href="/seller/dashboard">Go to Seller Dashboard</a>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Want to start selling on Gujrati Dhandha? Become a seller to list your products!
                      </p>
                      <Button onClick={handleBecomeSeller} className="bg-accent hover:bg-orange-600 text-white">
                        Become a Seller
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text-primary)' }}>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Privacy & Security
                      </h3>
                      <Button variant="outline" className="mr-2">
                        Change Password
                      </Button>
                      <Button variant="outline">
                        Two-Factor Authentication
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Notifications
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span style={{ color: 'var(--text-secondary)' }}>Email notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span style={{ color: 'var(--text-secondary)' }}>Order updates</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}