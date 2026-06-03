import {
  BarChart3,
  LayoutDashboard,
  PackagePlus,
  ShoppingCart,
} from "lucide-react";
// import { useNavigate } from "react-router-dom";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "sales", label: "Sales", icon: BarChart3 },
  { id: "artist-drop", label: "Artist Drop", icon: PackagePlus },
];

const Sidebar = ({ activePage, onNavigate }) => {
  // const navigate = useNavigate();

  return (
    <aside className="flex min-h-screen w-36 shrink-0 flex-col bg-[#1e1b4b] px-3 py-5 md:w-44 md:px-4 md:py-6">
      <div className="mb-2 border-b border-white/10 pb-5">
        <p className="text-base font-bold text-white md:text-lg">
          Admin Dashboard
        </p>
        <p className="mt-1 text-[11px] text-white/40">Admin workspace</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                // if (item.id === "artist-drop") {
                // navigate("/artist-drop");
                //   return;
                // }

                onNavigate(item.id);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="h-5 w-5 shrink-0">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
