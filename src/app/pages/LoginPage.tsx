import { AuthLayout } from "../components/auth/AuthLayout";
import { LoginForm } from "../components/auth/LoginForm";
import { useNavigate } from "react-router";
import api from "../utils/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (email: string, pass: string) => {
    try {
      console.log("Attempting admin login for:", email);
      
      const response = await api.post("/admin/login", { 
        email, 
        password: pass 
      });

      const { session, role } = response.data;
      
      // Store token and session info
      localStorage.setItem("nexus_token", session.access_token);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_email", email);
      
      // Set default auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
      
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.error || "Invalid administrative credentials");
    }
  };

  return (
    <AuthLayout 
      title="Finova Admin" 
      subtitle="Authorized Personnel Only"
    >
      <LoginForm onLogin={handleLogin} />
    </AuthLayout>
  );
}
