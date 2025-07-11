
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, User, Shield, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
  userType: "user" | "admin";
}

const LoginForm = () => {
  const [userType, setUserType] = useState<"user" | "admin">("user");
  const [error, setError] = useState<string>("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      userType: "user"
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    
    const success = await login(data.email, data.password);
    
    if (success) {
      // Navigate based on user type
      if (data.userType === "admin") {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const isAdmin = userType === "admin";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={`w-full shadow-lg transition-all duration-300 ${
      isAdmin ? "border-destructive/20 bg-destructive/5" : "border-primary/20 bg-primary/5"
    }`}>
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          {isAdmin ? (
            <div className="p-3 rounded-full bg-destructive/10 border border-destructive/20">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
          ) : (
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Car className="h-8 w-8 text-primary" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl font-bold">
          {isAdmin ? "Admin Login" : "User Login"}
        </CardTitle>
        <CardDescription>
          {isAdmin 
            ? "Access the administrative dashboard" 
            : "Sign in to manage your parking"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userType">Login as</Label>
          <Select value={userType} onValueChange={(value: "user" | "admin") => setUserType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={isAdmin ? "admin@test.com" : "user@test.com"}
                className="pl-10"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            variant={isAdmin ? "destructive" : "default"}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {!isAdmin && (
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold"
                onClick={() => navigate("/register")}
              >
                Register here
              </Button>
            </p>
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Demo credentials: {isAdmin ? "admin@test.com / admin123" : "user@test.com / user123"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;