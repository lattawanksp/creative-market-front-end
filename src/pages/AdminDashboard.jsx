import { useState } from "react";
import Sidebar from "../components/AdminDashboard/01_Sidebar";
import Overview from "../components/AdminDashboard/Overview/00_Overview";
import Orders from "../components/AdminDashboard/Orders/00_Orders";
import Sales from "../components/AdminDashboard/Sales/00_Sales";
import useAdminDashboard from "../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("overview");
  const { dashboardData, loading, error, refetchDashboardData } =
    useAdminDashboard();

  const renderPage = () => {
    switch (activePage) {
      case "orders":
        return (
          <Orders
            summary={dashboardData.orders.summary}
            orders={dashboardData.orders.orders}
            loading={loading}
            error={error}
            onRefresh={refetchDashboardData}
          />
        );
      case "sales":
        return (
          <Sales
            stats={dashboardData.sales}
            loading={loading}
            error={error}
          />
        );
      case "overview":
      default:
        return (
          <Overview
            stats={dashboardData.overview}
            loading={loading}
            error={error}
            onOpenOrders={() => setActivePage("orders")}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#eeedf8]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-auto p-5 md:p-8">{renderPage()}</main>
    </div>
  );
};

export default AdminDashboard;
