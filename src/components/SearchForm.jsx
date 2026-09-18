import React, { useState } from "react";

export function SearchForm() {
  const [searchQuery, setSearchQuery] = useState("");

  // Google検索ポップアップを開く関数
  const handleGoogleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    // サイズ指定を外し、安全な新しいタブとして開く（これならブロックされません）
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="googleForm" onSubmit={handleGoogleSearch}>
      <div className="inputWrapper">
        <input
          className="googleInput"
          type="text"
          placeholder="調べたいプラモデルを入力（例：HG Zガンダム）"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="clearBtn"
            onClick={() => setSearchQuery("")}
            title="入力をクリア"
          >
            ×
          </button>
        )}
      </div>
      <button className="googleBtn" type="submit">
        Google検索
      </button>
    </form>
  );
}
