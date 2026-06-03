import { useEffect, useState } from "react";

const serverBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";

const initialState = {
  overview: {
    totalSales: 0,
    orderCount: 0,
    itemSold: 0,
    averageOrderValue: 0,
    salesOverview: [],
    categoryBreakdown: [],
    recentOrders: [],
  },
  orders: {
    summary: {
      allOrders: 0,
      pendingCount: 0,
      paidCount: 0,
      cancelledCount: 0,
    },
    orders: [],
  },
  sales: {
    totalSales: 0,
    orderCount: 0,
    itemSold: 0,
    averageOrderValue: 0,
    salesOverview: [],
    categoryBreakdown: [],
  },
};

const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestDashboardData = async (signal) => {
    const options = {
      credentials: "include",
      ...(signal ? { signal } : {}),
    };

    const requests = await Promise.all([
      fetch(`${serverBaseUrl}/api/admin-dashboard/overview`, options),
      fetch(`${serverBaseUrl}/api/admin-dashboard/orders`, options),
      fetch(`${serverBaseUrl}/api/admin-dashboard/sales`, options),
    ]);

    const responses = await Promise.all(requests.map((request) => request.json()));
    const failedIndex = requests.findIndex((request) => !request.ok);

    if (failedIndex >= 0) {
      throw new Error(
        responses[failedIndex]?.message || "Failed to load admin dashboard",
      );
    }

    return {
      overview: responses[0]?.data || initialState.overview,
      orders: responses[1]?.data || initialState.orders,
      sales: responses[2]?.data || initialState.sales,
    };
  };

  const refetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const nextDashboardData = await requestDashboardData();
      setDashboardData(nextDashboardData);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    requestDashboardData(controller.signal)
      .then((nextDashboardData) => {
        setDashboardData(nextDashboardData);
        setError("");
      })
      .catch((fetchError) => {
        if (fetchError.name === "AbortError") {
          return;
        }

        setError(fetchError.message || "Failed to load admin dashboard");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { dashboardData, loading, error, refetchDashboardData };
};

export default useAdminDashboard;
