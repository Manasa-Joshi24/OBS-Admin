import { createBrowserRouter, Navigate } from "react-router";
import { AdminLayout } from "./components/layout/AdminLayout";
import { Dashboard } from "./pages/Dashboard";
import { UserManagement } from "./pages/UserManagement";
import { KYCReview } from "./pages/KYCReview";
import { AccountOversight } from "./pages/AccountOversight";
import { FraudRisk } from "./pages/FraudRisk";
import { LoanOperations } from "./pages/LoanOperations";
import { Reports } from "./pages/Reports";
import { SupportTicketing } from "./pages/SupportTicketing";
import { Notifications as NotificationsPage } from "./pages/Notifications";
import { Configuration as ConfigurationPage } from "./pages/Configuration";
import { AuditCompliance as AuditCompliancePage } from "./pages/AuditCompliance";
import { Reconciliation as ReconciliationPage } from "./pages/Reconciliation";
import { SystemOperations as SystemOperationsPage } from "./pages/SystemOperations";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("nexus_token");
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", Component: Dashboard },
          { path: "users", Component: UserManagement },
          { path: "kyc", Component: KYCReview },
          { path: "accounts", Component: AccountOversight },
          { path: "fraud", Component: FraudRisk },
          { path: "loans", Component: LoanOperations },
          { path: "reports", Component: Reports },
          { path: "support", Component: SupportTicketing },
          { path: "notifications", Component: NotificationsPage },
          { path: "configuration", Component: ConfigurationPage },
          { path: "audit", Component: AuditCompliancePage },
          { path: "reconciliation", Component: ReconciliationPage },
          { path: "system", Component: SystemOperationsPage },
          { path: "help", element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
]);
