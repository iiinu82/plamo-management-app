import React, { useState } from "react";

export function SearchForm() {
  const [category, setCategory] = useState(""); // 選択中のカテゴリー
  const [searchQuery, setSearchQuery] = useState(""); // 入力値

  const handleSearchClear = () => {
    setSearchQuery("");
    setCategory("");
  };

  return (
    <form
      className="googleForm"
      action="https://www.google.com/search"
      method="GET"
      target="_blank"
      onSubmit={(e) => {
        if (!searchQuery.trim() || searchQuery === category) {
          e.preventDefault();
        }
      }}
    >
      <div className="inputWrapper">
        {/* カテゴリー選択 */}
        <select
          value={category}
          onChange={(e) => {
            const newCat = e.target.value;
            setCategory(newCat);

            setSearchQuery((prev) => {
              // 過去のカテゴリー部分を一旦剥がす簡易処理
              const cleanVal = prev.replace(/^(HG|RG|MG|PG|30MM)\s*/, "");
              return newCat ? `${newCat} ${cleanVal}` : cleanVal;
            });
          }}
          className="googleInputCategory"
        >
          <option value="HG">HG</option>
          <option value="RG">RG</option>
          <option value="MG">MG</option>
          <option value="PG">PG</option>
          <option value="MGSD">MGSD</option>
          <option value="30MM">30MM</option>
          <option value="30MF">30MF</option>
          <option value="">指定なし</option>
        </select>

        <div className="googleInputArea">
          <input
            className="googleInput"
            type="text"
            name="q"
            placeholder="プラモデル名を入力（例：Zガンダム）"
            value={searchQuery}
            onChange={(e) => {
              const rawInput = e.target.value;

              if (category && !rawInput.startsWith(category)) {
                setSearchQuery(`${category} ${rawInput}`);
              } else {
                setSearchQuery(rawInput);
              }
            }}
          />

          {searchQuery && (
            <button
              type="button"
              className="clearBtn"
              onClick={handleSearchClear}
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
