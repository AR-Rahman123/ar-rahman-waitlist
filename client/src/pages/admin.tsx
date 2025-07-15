import React from "react";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { AdminLogin } from "@/components/admin-login";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Shield } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { isAuthenticated, isLoading, logout, isLoggingOut } = useAdminAuth();
  const { toast } = useToast();
  const [showLogin, setShowLogin] = React.useState(false);

  // Show login form after 1 second if still loading
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => {
        setShowLogin(true);
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged Out",
          description: "You have been safely logged out",
        });
      },
    });
  };

  // Determine what to show
  const shouldShowLogin = !isAuthenticated || (isLoading && showLogin);
  const shouldShowLoading = isLoading && !showLogin && !isAuthenticated;

  if (shouldShowLogin) {
    return <AdminLogin />;
  }

  if (shouldShowLoading) {
    return (
      <div className="min-h-screen bg-spiritual-light flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 text-spiritual-blue mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spiritual-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-spiritual-dark">Admin Dashboard</h1>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}