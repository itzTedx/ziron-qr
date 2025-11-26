import Header from "@/components/layout/header";

import SettingsProfile from "@/features/auth/components/settings-profile";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div>
      <Header title="Settings" />

      <div className="p-6">
        <SettingsProfile />
      </div>
    </div>
  );
}
