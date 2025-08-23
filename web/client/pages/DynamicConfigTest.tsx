import React from "react";
import { AntiCheatConfigurationPage } from "@/components/AntiCheatConfigurationPage";

export function DynamicConfigTest() {
  return (
    <div className="min-h-screen">
      <AntiCheatConfigurationPage serverId="test-server-id" />
    </div>
  );
}
