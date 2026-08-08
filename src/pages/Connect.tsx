import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Terminal, MessageCircle, Cpu, RefreshCcw, 
  Copy, Check, ExternalLink, Bot
} from "lucide-react";
import { getMcpUrl } from "@/lib/attendance-utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const ConnectPage = () => {
  const mcpUrl = getMcpUrl();
  const [copied, setCopied] = useState(false);
  const appSlug = "janhitkari-library-app";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Connect AI Assistant | Janhitkari Library"
        description="Learn how to connect ChatGPT, Claude, and other AI assistants to Janhitkari Library using MCP."
        path="/connect"
      />
      <Navbar />
      
      <main className="pt-32 pb-20 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold-dark rounded-full text-sm font-bold font-body mb-4">
              <Bot className="w-4 h-4" />
              Agent Integrations
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-navy mb-4">Connect Your AI Assistant</h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
              Use the Model Context Protocol (MCP) to let ChatGPT or Claude interact with library data, manage attendance, and check status.
            </p>
          </div>

          {/* MCP URL Card */}
          <div className="glass p-8 rounded-3xl shadow-soft mb-12 border-2 border-gold/20">
            <h2 className="font-display text-xl font-bold text-navy mb-4">Your MCP Server URL</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <code className="flex-1 bg-navy/5 p-4 rounded-xl font-mono text-sm break-all border border-navy/10 flex items-center">
                {mcpUrl}
              </code>
              <button 
                onClick={() => copyToClipboard(mcpUrl)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-navy text-cream rounded-xl font-bold hover:brightness-110 transition-all shrink-0"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy URL"}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ChatGPT */}
            <ClientCard 
              icon={MessageCircle} 
              title="ChatGPT" 
              steps={[
                "Open ChatGPT Connectors settings and enable Developer mode.",
                <a href="https://chatgpt.com/plugins#settings/Connectors?create-connector=true" target="_blank" rel="noopener" className="text-navy font-bold underline flex items-center gap-1">Open 'New Connector' dialog <ExternalLink className="w-3 h-3"/></a>,
                "Paste 'Janhitkari Library' and the MCP URL from above.",
                "Review, check 'I understand', and click 'Create'.",
                "Enable it from the chat composer."
              ]}
              refresh={[
                "Open Plugins page, select the app, and click 'Refresh'.",
                "If the URL changed, delete and recreate the connector."
              ]}
            />

            {/* Claude */}
            <ClientCard 
              icon={Bot} 
              title="Claude.ai" 
              steps={[
                <a href={`https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Janhitkari%20Library&connectorUrl=${encodeURIComponent(mcpUrl)}`} target="_blank" rel="noopener" className="text-navy font-bold underline flex items-center gap-1">Open Claude Connector Setup <ExternalLink className="w-3 h-3"/></a>,
                "Review the prefilled details and click 'Add'.",
                "If the link doesn't work, manually add a 'Custom Connector' with the URL above.",
                "Enable the connector in your chat."
              ]}
              refresh={[
                "Open Connectors page, select Janhitkari Library.",
                "Click 'Refresh' or update the tool list.",
                "If the URL changed, remove and re-add the connector."
              ]}
            />

            {/* Claude Code */}
            <div className="md:col-span-2">
              <div className="glass p-8 rounded-3xl shadow-soft border border-navy/5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-navy text-cream rounded-2xl flex items-center justify-center">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy">Claude Code</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-body font-bold text-navy mb-2 flex items-center gap-2">
                      <LogIn className="w-4 h-4" /> Connect
                    </h4>
                    <p className="text-sm text-muted-foreground font-body mb-3">Run this one-line command in your terminal:</p>
                    <div className="relative group">
                      <code className="block bg-navy text-cream p-4 rounded-xl font-mono text-xs md:text-sm break-all">
                        claude mcp add --scope user --transport http {appSlug} '{mcpUrl}'
                      </code>
                      <button 
                        onClick={() => copyToClipboard(`claude mcp add --scope user --transport http ${appSlug} '${mcpUrl}'`)}
                        className="absolute right-2 top-2 p-2 bg-cream/10 hover:bg-cream/20 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-cream" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-body font-bold text-navy mb-2 flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4" /> Refresh
                    </h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground font-body space-y-2">
                      <li>Start a new Claude Code session to load latest tools.</li>
                      <li>If the URL changed, run: <code className="bg-navy/5 px-1 rounded">claude mcp remove {appSlug}</code> and then re-run the install command.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Clients */}
            <ClientCard 
              icon={Cpu} 
              title="Other MCP Clients" 
              steps={[
                "Open your client's MCP server settings.",
                "Add a new 'Remote' or 'HTTP' MCP server.",
                "Paste the MCP URL and name it 'Janhitkari Library'.",
                "Sign in if prompted and enable the tools."
              ]}
              refresh={[
                "Find the connection in settings and click 'Refresh' or 'Reload'.",
                "If tools don't update, reconnect the server."
              ]}
            />
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

const ClientCard = ({ icon: Icon, title, steps, refresh }: any) => (
  <div className="glass p-8 rounded-3xl shadow-soft border border-navy/5 flex flex-col h-full">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-navy/5 text-navy rounded-2xl flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-2xl font-bold text-navy">{title}</h3>
    </div>

    <div className="space-y-6 flex-1">
      <div>
        <h4 className="font-body font-bold text-navy mb-3 flex items-center gap-2">
          <LogIn className="w-4 h-4" /> Connect
        </h4>
        <ol className="space-y-3">
          {steps.map((step: any, i: number) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground font-body">
              <span className="flex-shrink-0 w-5 h-5 bg-navy/5 text-navy rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h4 className="font-body font-bold text-navy mb-3 flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Refresh
        </h4>
        <ul className="list-disc list-inside space-y-2">
          {refresh.map((item: any, i: number) => (
            <li key={i} className="text-sm text-muted-foreground font-body leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default ConnectPage;
