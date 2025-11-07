import { useApi } from "@/hooks/useApi";
import type { Setting } from "@/types/type";

const SettingPage = () => {
  const {
    data: settings,
    loading,
    updateItem,
    fetchData,
  } = useApi<Setting>({
    endpoint: "/settings",
    transform: (data) => [data],

    // your backend endpoint
  });

  // Assume there's always 1 setting row
  const setting = settings[0];

  const toggleMaintenance = async () => {
    if (!setting) return;
    await updateItem(undefined, {
      underMaintenance: !setting.underMaintenance,
    });
    fetchData(); // refresh after update
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Website Settings</h1>
      <div className="flex items-center space-x-4">
        <span>Status:</span>
        <span
          className={
            setting?.underMaintenance ? "text-red-600" : "text-green-600"
          }
        >
          {setting?.underMaintenance ? "Under Maintenance" : "Live"}
        </span>
      </div>
      <button
        onClick={toggleMaintenance}
        className={`px-4 py-2 rounded text-white ${
          setting?.underMaintenance ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {setting?.underMaintenance
          ? "Turn OFF Maintenance"
          : "Turn ON Maintenance"}
      </button>
    </div>
  );
};

export default SettingPage;
