import { CheckCircle2, Eye, Search } from "lucide-react";
import { Channel } from "../types";
import { useState } from "react";

interface ChannelListProps {
  channels: Channel[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ChannelList({ channels, selectedId, onSelect }: ChannelListProps) {
  const [search, setSearch] = useState("");

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Live Channels</h3>
        <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700">
          {channels.length} channels
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Search channel name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-md py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredChannels.map((channel) => {
          const isSelected = channel.id === selectedId;
          return (
            <div
              key={channel.id}
              onClick={() => onSelect(channel.id)}
              className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                isSelected ? "border-blue-500" : "border-slate-800 hover:border-slate-700"
              } bg-slate-800 flex flex-col`}
            >
              {/* Image Area */}
              <div className="relative h-28 bg-white flex items-center justify-center p-4">
                <img
                  src={channel.logoUrl || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                  alt={channel.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                
                {/* Status Badges on Image */}
                {isSelected ? (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 size={22} className="text-white fill-blue-600 drop-shadow-md" />
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    LIVE
                  </div>
                )}
              </div>

              {/* Bottom Info Area */}
              <div className="p-3 flex flex-col gap-2">
                <h4 className="text-white text-[13px] font-medium truncate">
                  {channel.name}
                </h4>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/50 border border-slate-700/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                    <span className="text-emerald-500 text-[10px] font-semibold tracking-wider">Live</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/50 border border-slate-700/50">
                    <Eye size={12} className="text-slate-400" />
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                      {channel.streamType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
