import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

import { login as loginService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthDivider from "../../components/auth/AuthDivider";
import AuthFooter from "../../components/auth/AuthFooter";
import SocialButton from "../../components/auth/SocialButton";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginService(formData);
console.log("Login user:", response.user);
     login(response.user, response.token);

     if (response.user?.onboardingCompleted) {
       navigate("/dashboard");
     } else {
       navigate("/onboarding");
     }
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Welcome Back 👋"
          subtitle="Continue creating content that grows your audience."
        />

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="mb-6 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              Forgot Password?
            </Link>
          </div>

          <Button loading={loading} type="submit">
            Login
          </Button>
        </form>

        <AuthDivider />

        <SocialButton />

        <AuthFooter
          text="Don't have an account?"
          linkText="Create Account"
          to="/register"
        />
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
