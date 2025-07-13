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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spiritual-light flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 text-spiritual-blue mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

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
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
              disabled={isLoggingOut}
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-spiritual-dark">AR Rahman Waitlist Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Monitor waitlist signups, analyze user responses, and track engagement metrics.
            </p>
          </CardContent>
        </Card>

        <AnalyticsDashboard />
      </main>
    </div>
  );
}
