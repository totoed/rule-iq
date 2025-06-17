import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // List of admin emails
  const adminEmails = [
    // Add your admin emails here
    "admin@example.com",
  ];

  useEffect(() => {
    if (!loading && (!user || !adminEmails.includes(user.email))) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user || !adminEmails.includes(user.email)) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
