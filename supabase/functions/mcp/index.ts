import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const projectId = Deno.env.get("SUPABASE_PROJECT_ID") || "wooddxlpdhhigocclrvp";
  const mcpUrl = `https://${projectId}.supabase.co/functions/v1/mcp`;

  const instructions = {
    mcpUrl,
    clients: {
      chatgpt: {
        connect: [
          "Open https://chatgpt.com/#settings/Connectors/Advanced and enable Developer mode.",
          "Link to https://chatgpt.com/plugins#settings/Connectors?create-connector=true",
          "Paste 'Janhitkari Library' as the name and the MCP URL into the fields.",
          "Review details, check 'I understand', and click 'Create'.",
          "Enable the app from the chat composer."
        ],
        refresh: [
          "Open ChatGPT's Plugins page and select this app.",
          "Click 'Refresh' under Information.",
          "If the URL changed, delete and recreate the app."
        ]
      },
      claude: {
        connect: [
          `Open https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Janhitkari%20Library&connectorUrl=${encodeURIComponent(mcpUrl)}`,
          "Review details and click 'Add'.",
          "If it doesn't open, manually add a custom connector with the name and URL."
        ],
        refresh: [
          "Open the Connectors page and select this connector.",
          "Refresh or update the connector's tools.",
          "If the URL changed, remove and recreate the connector."
        ]
      },
      claude_code: {
        connect: [
          `Run this command: claude mcp add --scope user --transport http janhitkari-library-app '${mcpUrl}'`,
          "Run /mcp in Claude Code to confirm connection.",
          "Ask Claude Code to use the library tools."
        ],
        refresh: [
          "Start a new Claude Code session.",
          `If the URL changed, run: claude mcp remove janhitkari-library-app`,
          "Then run the install command again with the new URL."
        ]
      }
    }
  };

  return new Response(JSON.stringify(instructions), {
    headers: jsonHeaders,
  });
});
