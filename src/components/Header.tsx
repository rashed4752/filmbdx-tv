import { Download, Send, Share2 } from "lucide-react";

export function Header() {
  const handleDownload = () => {
    window.location.href = "https://github.com/rasheddevx/filmbdx-app/releases/download/v1.0/FiFa-FilmBDX.1.0_1.apk";
  };

  const handleShare = async () => {
    const url = "https://filmbdx-tv.onrender.com";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FilmBDX",
          url: url,
        });
      } catch (e) {
        console.log("Share failed:", e);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="flex items-center gap-2">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 5.8C6 3.6 8.3 2.4 10.1 3.4L18.8 8.4C20.6 9.4 20.6 12.2 18.8 13.2L10.1 18.2C8.3 19.2 6 18 6 15.8V5.8Z"
            stroke="#E2B720"
            strokeWidth="4.5"
            strokeLinejoin="round"
            fill="none"
          ></path>
        </svg>
        <h1 className="text-xl font-bold tracking-tight">Film<span className="text-[#E2B720]">BDX</span></h1>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={handleDownload} className="flex items-center gap-2 bg-[#E2B720] hover:bg-[#d1a81e] text-black font-semibold px-4 py-1.5 rounded-md text-sm transition-colors">
          <Download size={16} />
          <span className="hidden sm:inline">Download App</span>
        </button>
        <button onClick={handleShare} className="p-2 bg-slate-800 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
          <Share2 size={18} />
        </button>
        <button className="p-2 bg-slate-800 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
          <Send size={18} />
        </button>
      </div>
    </header>
  );
}
