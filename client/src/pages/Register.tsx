
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Join ParkVista
          </h1>
          <p className="text-muted-foreground">
            Create your parking management account
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;