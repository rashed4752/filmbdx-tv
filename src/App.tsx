import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Player } from "./components/Player";
import { ChannelList } from "./components/ChannelList";
import { Channel, DatabaseData } from "./types";

export default function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Anti-Sniffing / Anti-DevTools Protection
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch("https://streamhub-fb5cf-default-rtdb.asia-southeast1.firebasedatabase.app/.json");
        const data: DatabaseData = await response.json();
        
        if (data && data.channels) {
          const channelsList = Object.values(data.channels).sort((a, b) => {
            // Sort by order first (if exists), then by id ascending (default)
            if (typeof a.order === 'number' && typeof b.order === 'number') {
              return a.order - b.order;
            }
            if (typeof a.order === 'number') return -1;
            if (typeof b.order === 'number') return 1;
            
            // Admin panel default order seems to be based on ascending ID
            return a.id.localeCompare(b.id);
          });
          
          setChannels(prev => {
            // Only update if data changed (compare stringified lists)
            if (JSON.stringify(prev) !== JSON.stringify(channelsList)) {
              return channelsList;
            }
            return prev;
          });
          
          if (channelsList.length > 0 && !selectedId) {
            // First time load: Pre-select the first channel
            setSelectedId(channelsList[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
    
    // Poll every 5 seconds for real-time updates
    const intervalId = setInterval(fetchChannels, 5000);
    return () => clearInterval(intervalId);
  }, [selectedId]);

  const selectedChannel = channels.find((c) => c.id === selectedId) || null;

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-blue-500/30">
      <Header />
      <main className="max-w-4xl mx-auto pb-12">
        {loading && channels.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            <Player channel={selectedChannel} />
            <ChannelList
              channels={channels}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </>
        )}
      </main>
    </div>
  );
}

