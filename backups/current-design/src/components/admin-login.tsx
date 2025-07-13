import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login, isLoggingIn, loginError } = useAdminAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter the admin password",
        variant: "destructive",
      });
      return;
    }

    login({ password }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Admin authentication successful",
        });
      },
      onError: () => {
        toast({
          title: "Access Denied",
          description: "Invalid admin password",
          variant: "destructive",
        });
        setPassword("");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spiritual-light via-white to-spiritual-light/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-spiritual-blue/10 rounded-full">
              <Shield className="w-8 h-8 text-spiritual-blue" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-spiritual-dark">
            Admin Access
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your admin password to access the dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pr-10"
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Invalid password. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-spiritual-blue hover:bg-spiritual-blue/90"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Security Note:</strong> This dashboard contains sensitive user data. 
              Only authorized personnel should have access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}