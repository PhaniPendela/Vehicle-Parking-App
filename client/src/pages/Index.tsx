
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ParkVista
          </h1>
          <p className="text-muted-foreground">
            Vehicle Parking Management System
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;