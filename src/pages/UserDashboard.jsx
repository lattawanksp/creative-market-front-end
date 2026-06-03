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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#eeedf8]">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="flex flex-1 items-center justify-center p-6 lg:p-10">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="mt-4 text-sm font-medium text-[#4C1D95]">
              กำลังโหลดข้อมูลแดชบอร์ด...
            </p>
          </div>
        </main>
      </div>
    );
  }

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
