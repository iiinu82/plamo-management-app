import React, { useState } from "react";

export function SearchForm() {
  const [category, setCategory] = useState(""); // 選択中のカテゴリー
  const [searchQuery, setSearchQuery] = useState(""); // 入力されたワード

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // ★ 選択したカテゴリーと検索ワードをスペースでくっつける（例: "HG Zガンダム"）
    const fullQuery = category ? `${category} ${searchQuery}` : searchQuery;

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(fullQuery)}`;

    // 新しいタブで安全に開く
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="googleForm" onSubmit={handleSearchSubmit}>
      <div className="inputWrapper" style={{ display: "flex", gap: "8px" }}>
        {/* カテゴリー選択 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #475569",
          }}
        >
          <option value="">指定なし</option>
          <option value="HG">HG</option>
          <option value="RG">RG</option>
          <option value="MG">MG</option>
          <option value="PG">PG</option>
          <option value="30MM">30MM</option>
        </select>

        {/* 入力欄 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            className="googleInput"
            type="text"
            placeholder="プラモデル名を入力（例：Zガンダム）"
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
      </div>

      <button className="googleBtn" type="submit">
        Google検索
      </button>
    </form>
  );
}
