import { Pause, Play, RefreshCcw, Volume2, VolumeX, Maximize, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import { Channel } from "../types";

interface PlayerProps {
  channel: Channel | null;
}

export function Player({ channel }: PlayerProps) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const loadStream = () => {
    setErrorMsg(null);
    if (!channel || !videoRef.current) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;

      hls.loadSource(channel.streamUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play().catch((e) => {
          console.log("Auto-play prevented", e);
          setPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMsg("Network error. The stream might be offline, geo-blocked, or have CORS restrictions.");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setErrorMsg("Media error. Attempting to recover...");
              hls.recoverMediaError();
              break;
            default:
              setErrorMsg("A fatal error occurred while trying to play the stream.");
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari
      videoRef.current.src = channel.streamUrl;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current?.play().catch(() => setPlaying(false));
      });
      videoRef.current.addEventListener("error", () => {
        setErrorMsg("Failed to load stream. It might be offline or blocked.");
      });
    }
  };

  useEffect(() => {
    setPlaying(true);
    loadStream();
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [channel?.streamUrl]);

  const handleRefresh = () => {
    loadStream();
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (!channel) {
    return (
      <div className="w-full aspect-video bg-black flex flex-col items-center justify-center text-slate-500">
        <p>No channel selected</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* Video Player */}
      <div className="w-full aspect-video bg-black relative group overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          muted={muted}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        
        {errorMsg && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center">
            <div className="text-red-400 max-w-md space-y-2">
              <p className="font-semibold text-lg">Playback Error</p>
              <p className="text-sm">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls Area */}
      <div className="p-4 space-y-4">
        {/* Now Playing info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold">Now Playing</h2>
            <span className="text-slate-400 text-sm">·</span>
            <span className="text-slate-400 text-sm">{channel.name}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 rounded text-xs font-medium border border-red-500/20">
            <Users size={14} />
            <span>1 Watching</span>
          </div>
        </div>

        {/* Resolution Dropdown */}
        <div className="w-full bg-slate-800 rounded-md px-3 py-2.5 flex items-center justify-between cursor-pointer border border-slate-700">
          <span className="text-slate-300 text-sm">Auto</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
        </div>

        {/* Buttons Row */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-md text-sm font-medium transition-colors border border-slate-700"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={toggleMute}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-md text-sm font-medium transition-colors border border-slate-700"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            Sound
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-md text-sm font-medium transition-colors border border-slate-700"
          >
            <Maximize size={16} />
            Full
          </button>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-md text-sm font-medium transition-colors border border-slate-700"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>
    </div>
  );
}

