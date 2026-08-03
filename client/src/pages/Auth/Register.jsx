import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

import { register as registerService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthDivider from "../../components/auth/AuthDivider";
import AuthFooter from "../../components/auth/AuthFooter";
import SocialButton from "../../components/auth/SocialButton";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await registerService(payload);

      login(response.user, response.token);

      navigate("/onboarding");
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create Account 🚀"
          subtitle="Let's build your AI content assistant."
        />

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="name"
            icon={User}
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            icon={Lock}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Button loading={loading} type="submit">
            Create Account
          </Button>
        </form>

        <AuthDivider />

        <SocialButton />

        <AuthFooter
          text="Already have an account?"
          linkText="Login"
          to="/login"
        />
      </AuthCard>
    </AuthLayout>
  );
};

export default Register;
