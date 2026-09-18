import React, { useState } from "react";

export function SearchForm() {
  const [searchQuery, setSearchQuery] = useState("");

  // Google検索ポップアップを開く関数
  const handleGoogleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    const windowFeatures =
      "width=1000,height=700,left=500,top=100,resizable=yes,scrollbars=yes";
    window.open(searchUrl, "GoogleSearchPopup", windowFeatures);
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
