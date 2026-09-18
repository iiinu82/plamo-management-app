import React, { useState } from "react";

export function SearchForm() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <form
      className="googleForm"
      action="https://www.google.com/search"
      method="GET"
      target="_blank"
      onSubmit={(e) => {
        // 空文字のときは検索させずにストップする
        if (!searchQuery.trim()) {
          e.preventDefault();
        }
      }}
    >
      <div className="inputWrapper">
        <input
          className="googleInput"
          type="text"
          name="q" /* ← ★Googleがキーワードとして受け取るための超重要パラメータ名 */
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
