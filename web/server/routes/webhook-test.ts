import { RequestHandler } from "express";

export const testWebhook: RequestHandler = async (req, res) => {
  try {
    const { webhookUrl, eventType, embedTemplate } = req.body;

    if (!webhookUrl) {
      return res.status(400).json({
        success: false,
        message: "Webhook URL is required",
      });
    }

    if (!eventType) {
      return res.status(400).json({
        success: false,
        message: "Event type is required",
      });
    }

    // Validate Discord webhook URL format
    const webhookRegex = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
    if (!webhookRegex.test(webhookUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Discord webhook URL format",
      });
    }

    // Create test embed based on event type and template
    const testEmbed = createTestEmbed(eventType, embedTemplate);

    // Send the webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [testEmbed],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Discord webhook error:", errorText);
      return res.status(400).json({
        success: false,
        message: `Discord webhook error: ${response.status} ${response.statusText}`,
      });
    }

    res.json({
      success: true,
      message: `Test ${eventType} embed sent successfully to Discord!`,
    });
  } catch (error) {
    console.error("Webhook test error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test webhook",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

function createTestEmbed(eventType: string, embedTemplate?: any) {
  // Default test data
  const testData = {
    player_name: "TestPlayer",
    admin: "AdminTest",
    reason: "Testing webhook functionality",
    date: new Date().toLocaleString(),
    server_name: "Test Server",
    duration: "24 hours",
    player_id: "12345",
    screenshot_url:
      "https://via.placeholder.com/300x200/4f46e5/ffffff?text=Test+Screenshot",
  };

  // Use provided template or create default based on event type
  let template = embedTemplate;

  if (!template) {
    template = getDefaultTemplate(eventType);
  }

  // Replace placeholders in template
  const embed = {
    title: replacePlaceholders(template.title || "", testData),
    description: replacePlaceholders(template.description || "", testData),
    color: parseInt(template.color?.replace("#", "") || "dc2626", 16),
    thumbnail: template.thumbnail
      ? {
          url: replacePlaceholders(template.thumbnail, testData),
        }
      : undefined,
    footer: template.footer
      ? {
          text: replacePlaceholders(template.footer.text || "", testData),
          icon_url: template.footer.icon || undefined,
        }
      : undefined,
    fields:
      template.fields?.map((field: any) => ({
        name: replacePlaceholders(field.name || "", testData),
        value: replacePlaceholders(field.value || "", testData),
        inline: field.inline || false,
      })) || [],
    timestamp: new Date().toISOString(),
  };

  return embed;
}

function replacePlaceholders(
  text: string,
  data: Record<string, string>,
): string {
  let result = text;
  Object.entries(data).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, "g"), value);
  });
  return result;
}

function getDefaultTemplate(eventType: string) {
  const templates = {
    ban: {
      title: "🚫 Player Banned",
      description:
        "Player **{player_name}** has been banned by {admin}\n\n**Reason:** {reason}\n**Duration:** {duration}",
      color: "#dc2626",
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "👮 Admin", value: "{admin}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "⏰ Duration", value: "{duration}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
      footer: {
        text: "AtomicShield Security System",
      },
    },
    kick: {
      title: "⚠️ Player Kicked",
      description:
        "Player **{player_name}** has been kicked by {admin}\n\n**Reason:** {reason}",
      color: "#f59e0b",
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "👮 Admin", value: "{admin}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
      footer: {
        text: "AtomicShield Security System",
      },
    },
    unban: {
      title: "✅ Player Unbanned",
      description: "Player **{player_name}** has been unbanned by {admin}",
      color: "#16a34a",
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "👮 Admin", value: "{admin}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
      footer: {
        text: "AtomicShield Security System",
      },
    },
    screenshot: {
      title: "📸 Screenshot Taken",
      description: "Screenshot taken for player **{player_name}**",
      color: "#8b5cf6",
      thumbnail: "{screenshot_url}",
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
      footer: {
        text: "AtomicShield Security System",
      },
    },
    // Audit log event templates
    playerQuit: {
      title: "🚪 Player Quit",
      description:
        "Player **{player_name}** has left the server\n\n**Reason:** {reason}",
      color: "#dc2626",
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
      footer: {
        text: "AtomicShield Audit System",
      },
    },
    playerRequestJoin: {
      title: "🔄 Player Join Request",
      description: "Player **{player_name}** is requesting to join the server",
      color: "#3b82f6",
      fields: [
        { name: "🎮 Player", value: "{player_name}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "🆔 Player ID", value: "{player_id}", inline: true },
      ],
      footer: {
        text: "AtomicShield Audit System",
      },
    },
    serverStart: {
      title: "🟢 Server Started",
      description: "Server **{server_name}** has been started successfully",
      color: "#16a34a",
      fields: [
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
      ],
      footer: {
        text: "AtomicShield Audit System",
      },
    },
    antiCheatShutdown: {
      title: "🔴 AntiCheat Shutdown",
      description: "AtomicShield security system has been shut down",
      color: "#dc2626",
      fields: [
        { name: "🌐 Server", value: "{server_name}", inline: true },
        { name: "📅 Date", value: "{date}", inline: true },
        { name: "⚠️ Reason", value: "System shutdown", inline: true },
      ],
      footer: {
        text: "AtomicShield Security Alert",
      },
    },
  };

  return templates[eventType as keyof typeof templates] || templates.ban;
}
