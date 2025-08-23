import { RequestHandler } from "express";
import {
  DynamicConfigurations,
  Category,
  Section,
  Configuration,
} from "../../shared/api";

// Flattened configuration registry - all configs in one place for easy iteration
const createConfigurationRegistry = (serverConfig: any) => {
  return {
    // General Settings
    enable_shield: {
      id: "enable_shield",
      title: "Enable Shield",
      subtitle: "Turn the shield protection on or off",
      type: "toggle",
      defaultValue: true,
      tip: "When enabled, the shield will actively protect your server",
      category: "general_settings",
      section: "general",
    },
    protection_level: {
      id: "protection_level",
      title: "Protection Level",
      subtitle: "Set the overall protection intensity",
      type: "dropdown",
      defaultValue: "medium",
      options: ["low", "medium", "high", "maximum"],
      tip: "Higher levels provide better protection but may impact performance",
      category: "general_settings",
      section: "general",
    },
    server_name: {
      id: "server_name",
      title: "Server Name",
      subtitle: "Display name for your server",
      type: "text",
      defaultValue: serverConfig.serverName,
      tip: "This name will appear in logs and notifications",
      category: "general_settings",
      section: "general",
    },
    max_players: {
      id: "max_players",
      title: "Maximum Players",
      subtitle: "Maximum number of concurrent players",
      type: "number",
      defaultValue: serverConfig.maxPlayers,
      tip: "Set the player limit for your server",
      category: "general_settings",
      section: "general",
    },

    // Performance Settings
    enable_performance_mode: {
      id: "enable_performance_mode",
      title: "Performance Mode",
      subtitle: "Enable optimized performance settings",
      type: "toggle",
      defaultValue: false,
      tip: "Reduces resource usage but may affect detection accuracy",
      category: "general_settings",
      section: "performance",
    },
    scan_frequency: {
      id: "scan_frequency",
      title: "Scan Frequency (seconds)",
      subtitle: "How often to perform player scans",
      type: "number",
      defaultValue: 30,
      tip: "Lower values = more frequent scans (higher accuracy, more resources)",
      category: "general_settings",
      section: "performance",
    },
    memory_limit: {
      id: "memory_limit",
      title: "Memory Limit (MB)",
      subtitle: "Maximum memory usage for anti-cheat",
      type: "number",
      defaultValue: 512,
      tip: "Adjust based on your server's available memory",
      category: "general_settings",
      section: "performance",
    },

    // Detection Settings
    aimbot_detection: {
      id: "aimbot_detection",
      title: "Aimbot Detection",
      subtitle: "Detect automated aiming assistance",
      type: "toggle",
      defaultValue: true,
      tip: "Enables detection of aimbot and auto-aim cheats",
      category: "detection_settings",
      section: "detection_algorithms",
    },
    wallhack_detection: {
      id: "wallhack_detection",
      title: "Wallhack Detection",
      subtitle: "Detect wall penetration cheats",
      type: "toggle",
      defaultValue: true,
      tip: "Identifies players using ESP and wallhack cheats",
      category: "detection_settings",
      section: "detection_algorithms",
    },
    speed_hack_detection: {
      id: "speed_hack_detection",
      title: "Speed Hack Detection",
      subtitle: "Detect movement speed modifications",
      type: "toggle",
      defaultValue: true,
      tip: "Catches players using speed or teleportation hacks",
      category: "detection_settings",
      section: "detection_algorithms",
    },
    detection_sensitivity: {
      id: "detection_sensitivity",
      title: "Detection Sensitivity",
      subtitle: "Adjust the sensitivity of cheat detection",
      type: "number",
      defaultValue: serverConfig.detectionSensitivity,
      tip: "Higher values = more sensitive detection (1-100)",
      category: "detection_settings",
      section: "detection_algorithms",
    },
    detection_mode: {
      id: "detection_mode",
      title: "Detection Mode",
      subtitle: "Choose detection strategy",
      type: "dropdown",
      defaultValue: "balanced",
      options: ["lenient", "balanced", "strict", "paranoid"],
      tip: "Balanced recommended for most servers",
      category: "detection_settings",
      section: "detection_algorithms",
    },

    // Advanced Detection
    behavioral_analysis: {
      id: "behavioral_analysis",
      title: "Behavioral Analysis",
      subtitle: "Analyze player behavior patterns",
      type: "toggle",
      defaultValue: true,
      tip: "Uses machine learning to detect suspicious patterns",
      category: "detection_settings",
      section: "advanced_detection",
    },
    network_analysis: {
      id: "network_analysis",
      title: "Network Analysis",
      subtitle: "Monitor network traffic patterns",
      type: "toggle",
      defaultValue: false,
      tip: "Advanced feature that may impact performance",
      category: "detection_settings",
      section: "advanced_detection",
    },
    statistical_analysis: {
      id: "statistical_analysis",
      title: "Statistical Analysis",
      subtitle: "Track player statistics for anomalies",
      type: "toggle",
      defaultValue: true,
      tip: "Identifies players with impossible statistics",
      category: "detection_settings",
      section: "advanced_detection",
    },

    // Punishment Settings
    auto_ban: {
      id: "auto_ban",
      title: "Automatic Ban",
      subtitle: "Automatically ban detected cheaters",
      type: "toggle",
      defaultValue: true,
      tip: "When enabled, detected cheaters will be banned automatically",
      category: "punishment_settings",
      section: "punishment_actions",
    },
    ban_duration: {
      id: "ban_duration",
      title: "Ban Duration (hours)",
      subtitle: "Default ban length in hours (0 = permanent)",
      type: "number",
      defaultValue: 0,
      tip: "Set to 0 for permanent bans, or specify hours for temporary bans",
      category: "punishment_settings",
      section: "punishment_actions",
    },
    auto_kick: {
      id: "auto_kick",
      title: "Automatic Kick",
      subtitle: "Kick players before banning",
      type: "toggle",
      defaultValue: true,
      tip: "Gives players a chance before permanent action",
      category: "punishment_settings",
      section: "punishment_actions",
    },
    warning_system: {
      id: "warning_system",
      title: "Warning System",
      subtitle: "Issue warnings before punishment",
      type: "toggle",
      defaultValue: false,
      tip: "Give warnings for minor infractions",
      category: "punishment_settings",
      section: "punishment_actions",
    },
    escalation_policy: {
      id: "escalation_policy",
      title: "Escalation Policy",
      subtitle: "How to escalate punishments",
      type: "dropdown",
      defaultValue: "warn_kick_ban",
      options: ["immediate_ban", "warn_ban", "warn_kick_ban", "kick_ban"],
      tip: "Define the punishment escalation path",
      category: "punishment_settings",
      section: "punishment_actions",
    },

    // Punishment Customization
    ban_message: {
      id: "ban_message",
      title: "Ban Message",
      subtitle: "Message shown to banned players",
      type: "text",
      defaultValue:
        "You have been banned for using cheats. Appeal at our Discord.",
      tip: "Customize the message players see when banned",
      category: "punishment_settings",
      section: "punishment_customization",
    },
    kick_message: {
      id: "kick_message",
      title: "Kick Message",
      subtitle: "Message shown to kicked players",
      type: "text",
      defaultValue:
        "You have been kicked for suspicious activity. Rejoin allowed.",
      tip: "Customize the message players see when kicked",
      category: "punishment_settings",
      section: "punishment_customization",
    },
    global_ban: {
      id: "global_ban",
      title: "Global Ban Network",
      subtitle: "Share bans across network servers",
      type: "toggle",
      defaultValue: false,
      tip: "Bans will apply to all servers in your network",
      category: "punishment_settings",
      section: "punishment_customization",
    },

    // Exception Management
    admin_immunity: {
      id: "admin_immunity",
      title: "Admin Immunity",
      subtitle: "Exclude admins from detection",
      type: "toggle",
      defaultValue: true,
      tip: "Administrators will not trigger cheat detection",
      category: "hits_exceptions",
      section: "exception_management",
    },
    moderator_immunity: {
      id: "moderator_immunity",
      title: "Moderator Immunity",
      subtitle: "Exclude moderators from detection",
      type: "toggle",
      defaultValue: true,
      tip: "Moderators will not trigger cheat detection",
      category: "hits_exceptions",
      section: "exception_management",
    },
    whitelist_enabled: {
      id: "whitelist_enabled",
      title: "Whitelist Mode",
      subtitle: "Only scan non-whitelisted players",
      type: "toggle",
      defaultValue: false,
      tip: "When enabled, only non-whitelisted players will be scanned",
      category: "hits_exceptions",
      section: "exception_management",
    },
    vip_immunity: {
      id: "vip_immunity",
      title: "VIP Immunity",
      subtitle: "Exclude VIP players from detection",
      type: "toggle",
      defaultValue: false,
      tip: "VIP players will not trigger cheat detection",
      category: "hits_exceptions",
      section: "exception_management",
    },

    // Hit Management
    hit_threshold: {
      id: "hit_threshold",
      title: "Hit Threshold",
      subtitle: "Number of hits before action",
      type: "number",
      defaultValue: 3,
      tip: "How many detection hits before taking action",
      category: "hits_exceptions",
      section: "hit_management",
    },
    hit_decay_time: {
      id: "hit_decay_time",
      title: "Hit Decay Time (minutes)",
      subtitle: "Time before hits start to decay",
      type: "number",
      defaultValue: 60,
      tip: "Hits will decay after this time period",
      category: "hits_exceptions",
      section: "hit_management",
    },
    false_positive_learning: {
      id: "false_positive_learning",
      title: "False Positive Learning",
      subtitle: "Learn from false positive reports",
      type: "toggle",
      defaultValue: true,
      tip: "Improves detection accuracy over time",
      category: "hits_exceptions",
      section: "hit_management",
    },

    // Logging Settings
    log_all_detections: {
      id: "log_all_detections",
      title: "Log All Detections",
      subtitle: "Log every detection event",
      type: "toggle",
      defaultValue: true,
      tip: "Logs all detection events for review and analysis",
      category: "logging_notifications",
      section: "logging_settings",
    },
    log_player_actions: {
      id: "log_player_actions",
      title: "Log Player Actions",
      subtitle: "Log player joins, leaves, and actions",
      type: "toggle",
      defaultValue: true,
      tip: "Comprehensive player activity logging",
      category: "logging_notifications",
      section: "logging_settings",
    },
    log_level: {
      id: "log_level",
      title: "Log Level",
      subtitle: "Set the logging verbosity",
      type: "dropdown",
      defaultValue: "info",
      options: ["debug", "info", "warn", "error"],
      tip: "Higher levels log more details",
      category: "logging_notifications",
      section: "logging_settings",
    },
    log_retention_days: {
      id: "log_retention_days",
      title: "Log Retention (days)",
      subtitle: "How long to keep logs",
      type: "number",
      defaultValue: 30,
      tip: "Logs older than this will be automatically deleted",
      category: "logging_notifications",
      section: "logging_settings",
    },

    // Discord Notifications
    discord_webhook: {
      id: "discord_webhook",
      title: "Discord Webhook",
      subtitle: "Configure Discord notifications",
      type: "embed_json",
      defaultValue: "",
      tip: "Enter your Discord webhook URL to receive notifications",
      category: "logging_notifications",
      section: "discord_notifications",
    },
    notify_on_ban: {
      id: "notify_on_ban",
      title: "Notify on Ban",
      subtitle: "Send Discord notifications for bans",
      type: "toggle",
      defaultValue: true,
      tip: "Get notified when players are banned",
      category: "logging_notifications",
      section: "discord_notifications",
    },
    notify_on_kick: {
      id: "notify_on_kick",
      title: "Notify on Kick",
      subtitle: "Send Discord notifications for kicks",
      type: "toggle",
      defaultValue: false,
      tip: "Get notified when players are kicked",
      category: "logging_notifications",
      section: "discord_notifications",
    },
    notify_on_detection: {
      id: "notify_on_detection",
      title: "Notify on Detection",
      subtitle: "Send notifications for all detections",
      type: "toggle",
      defaultValue: false,
      tip: "Get notified for every cheat detection (can be spammy)",
      category: "logging_notifications",
      section: "discord_notifications",
    },

    // Data Management
    auto_backup: {
      id: "auto_backup",
      title: "Automatic Backups",
      subtitle: "Automatically backup configuration",
      type: "toggle",
      defaultValue: true,
      tip: "Creates daily backups of your configuration",
      category: "logging_notifications",
      section: "data_management",
    },
    backup_retention: {
      id: "backup_retention",
      title: "Backup Retention (days)",
      subtitle: "How long to keep backups",
      type: "number",
      defaultValue: 7,
      tip: "Number of backup files to retain",
      category: "logging_notifications",
      section: "data_management",
    },
    export_config: {
      id: "export_config",
      title: "Export Configuration",
      subtitle: "Download current configuration as JSON",
      type: "export_json",
      defaultValue: `atomicshield_config_${serverConfig.serverId || "server"}.json`,
      tip: "Download your current configuration for backup or sharing",
      category: "logging_notifications",
      section: "data_management",
    },
  };
};

// Helper function to build nested structure from flat registry
const buildNestedStructure = (configRegistry: any): DynamicConfigurations => {
  const categories = {
    general_settings: {
      id: "general_settings",
      label: "General Settings",
      description: "Basic configuration options",
      sections: {
        general: {
          id: "general",
          title: "General Settings",
          subtitle: "Configure basic shield behavior",
          configurations: [],
        },
        performance: {
          id: "performance",
          title: "Performance Settings",
          subtitle: "Optimize system performance",
          configurations: [],
        },
      },
    },
    detection_settings: {
      id: "detection_settings",
      label: "Detection Settings",
      description: "Advanced detection algorithms",
      sections: {
        detection_algorithms: {
          id: "detection_algorithms",
          title: "Detection Algorithms",
          subtitle: "Fine-tune detection algorithms",
          configurations: [],
        },
        advanced_detection: {
          id: "advanced_detection",
          title: "Advanced Detection",
          subtitle: "Specialized detection methods",
          configurations: [],
        },
      },
    },
    punishment_settings: {
      id: "punishment_settings",
      label: "Punishment Settings",
      description: "Configure punishment actions",
      sections: {
        punishment_actions: {
          id: "punishment_actions",
          title: "Punishment Actions",
          subtitle: "Define actions taken against cheaters",
          configurations: [],
        },
        punishment_customization: {
          id: "punishment_customization",
          title: "Punishment Customization",
          subtitle: "Customize punishment messages and actions",
          configurations: [],
        },
      },
    },
    hits_exceptions: {
      id: "hits_exceptions",
      label: "Hits & Exceptions",
      description: "Manage detection hits and exceptions",
      sections: {
        exception_management: {
          id: "exception_management",
          title: "Exception Management",
          subtitle: "Configure detection exceptions",
          configurations: [],
        },
        hit_management: {
          id: "hit_management",
          title: "Hit Management",
          subtitle: "Configure how detection hits are handled",
          configurations: [],
        },
      },
    },
    logging_notifications: {
      id: "logging_notifications",
      label: "Logging & Notifications",
      description: "Configure logging and Discord webhooks",
      sections: {
        logging_settings: {
          id: "logging_settings",
          title: "Logging Settings",
          subtitle: "Configure system logging",
          configurations: [],
        },
        discord_notifications: {
          id: "discord_notifications",
          title: "Discord Notifications",
          subtitle: "Configure Discord webhook notifications",
          configurations: [],
        },
        data_management: {
          id: "data_management",
          title: "Data Management",
          subtitle: "Backup and export configuration",
          configurations: [],
        },
      },
    },
  };

  // Populate configurations into their respective sections
  Object.values(configRegistry).forEach((config: any) => {
    const category = categories[config.category];
    if (category && category.sections[config.section]) {
      category.sections[config.section].configurations.push(config);
    }
  });

  // Convert to array format
  return {
    categories: Object.values(categories).map((category) => ({
      ...category,
      sections: Object.values(category.sections),
    })),
  };
};

// Simulate a realistic configuration database
const generateDynamicConfigurationData = (
  serverId: string,
): DynamicConfigurations & {
  configRegistry: ReturnType<typeof createConfigurationRegistry>;
  allConfigurations: any[];
} => {
  const serverSpecificConfigs = {
    "server-1": {
      serverName: "AtomicRP Main Server",
      maxPlayers: 64,
      detectionSensitivity: 85,
    },
    "server-2": {
      serverName: "AtomicRP Test Server",
      maxPlayers: 32,
      detectionSensitivity: 70,
    },
    default: {
      serverName: "FiveCity RP Demo Server",
      maxPlayers: 48,
      detectionSensitivity: 75,
    },
  };

  const serverConfig =
    serverSpecificConfigs[serverId as keyof typeof serverSpecificConfigs] ||
    serverSpecificConfigs.default;

  // Add serverId to serverConfig for export filenames
  const configWithServerId = { ...serverConfig, serverId };

  // Create the flattened configuration registry
  const configRegistry = createConfigurationRegistry(configWithServerId);

  // Create array of all configurations for easy iteration
  const allConfigurations = Object.values(configRegistry);

  // Build the nested structure from the registry
  const nestedStructure = buildNestedStructure(configRegistry);

  return {
    ...nestedStructure,
    configRegistry,
    allConfigurations,
  };
};

// Get configuration for a specific server
export const getConfiguration: RequestHandler = async (req, res) => {
  try {
    const { serverId } = req.params;

    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: "Server ID is required",
      });
    }

    // Simulate database lookup delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 500),
    );

    // Simulate occasional errors for realistic testing
    if (Math.random() < 0.05) {
      // 5% chance of error
      return res.status(500).json({
        success: false,
        error: "Database connection timeout. Please try again.",
      });
    }

    const configuration = generateDynamicConfigurationData(serverId);

    res.json({
      success: true,
      data: {
        anticheat: configuration,
        configRegistry: configuration.configRegistry,
        allConfigurations: configuration.allConfigurations,
        lastUpdated: new Date().toISOString(),
        serverId,
        version: "2.1.0",
        configSchema: "v2",
        totalConfigurations: configuration.allConfigurations.length,
      },
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching configuration",
    });
  }
};

// Update configuration for a specific server
export const updateConfiguration: RequestHandler = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { values, metadata } = req.body;

    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: "Server ID is required",
      });
    }

    if (!values) {
      return res.status(400).json({
        success: false,
        error: "Configuration values are required",
      });
    }

    // Simulate validation delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 1000),
    );

    // Simulate validation errors occasionally
    if (Math.random() < 0.1) {
      // 10% chance of validation error
      return res.status(400).json({
        success: false,
        error:
          "Invalid configuration: Detection sensitivity must be between 1 and 100",
      });
    }

    // Simulate save operation
    console.log(`Saving configuration for server ${serverId}:`, {
      valueCount: Object.keys(values).length,
      metadata,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        message: "Configuration saved successfully",
        savedAt: new Date().toISOString(),
        serverId,
        changesCount: Object.keys(values).length,
      },
    });
  } catch (error) {
    console.error("Error updating configuration:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while saving configuration",
    });
  }
};

// Get configuration history/versions
export const getConfigurationHistory: RequestHandler = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { limit = 10 } = req.query;

    // Simulate history lookup
    await new Promise((resolve) => setTimeout(resolve, 300));

    const history = Array.from({ length: Number(limit) }, (_, i) => ({
      id: `config-${Date.now()}-${i}`,
      version: `2.1.${i}`,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: i === 0 ? "Admin User" : `User ${i}`,
      changesCount: Math.floor(Math.random() * 15) + 1,
      description:
        i === 0
          ? "Current configuration"
          : `Updated ${Math.floor(Math.random() * 5) + 1} settings`,
    }));

    res.json({
      success: true,
      data: {
        history,
        serverId,
        totalVersions: 45 + Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching configuration history:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching configuration history",
    });
  }
};
