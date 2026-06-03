import { useState } from "react";
import Sidebar from "../components/UserDashboard/01_Sidebar";
import Overview from "../components/UserDashboard/Overview/00_Overview";
import MyOrders from "../components/UserDashboard/MyOrders/00_MyOrders";
import MyAddress from "../components/UserDashboard/MyAddress/00_MyAddress";
import useUserDashboard from "../hooks/useUserDashboard";

const UserDashboard = () => {
  const [activePage, setActivePage] = useState("overview");
  const { dashboardData, loading, error, refetchDashboardData } =
    useUserDashboard();

  const renderPage = () => {
    switch (activePage) {
      case "my-orders":
        return (
          <MyOrders
            orders={dashboardData.orders}
            summary={dashboardData.ordersSummary}
            loading={loading}
            error={error}
            onRefresh={refetchDashboardData}
          />
        );
      case "my-address":
        return <MyAddress />;
      case "overview":
      default:
        return (
          <Overview
            profile={dashboardData.profile}
            summary={dashboardData.summary}
            statusOrders={dashboardData.statusOrders}
            historyOrders={dashboardData.historyOrders}
            loading={loading}
            error={error}
            onOpenOrders={() => setActivePage("my-orders")}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#eeedf8]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 p-6 lg:p-10">{renderPage()}</main>
    </div>
  );
};

export default UserDashboard;
