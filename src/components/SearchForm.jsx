import React, { useState } from "react";

export function SearchForm() {
  const [category, setCategory] = useState(""); // 選択中のカテゴリー
  const [searchQuery, setSearchQuery] = useState(""); // 入力値

  return (
    <form
      className="googleForm"
      action="https://www.google.com/search"
      method="GET"
      target="_blank"
      onSubmit={(e) => {
        // 空文字（カテゴリー名だけ、または完全に空）のときは検索させずにストップ
        if (!searchQuery.trim() || searchQuery === category) {
          e.preventDefault();
        }
      }}
    >
      <div className="inputWrapper" style={{ display: "flex", gap: "8px" }}>
        {/* カテゴリー選択 */}
        <select
          value={category}
          onChange={(e) => {
            const newCat = e.target.value;
            setCategory(newCat);

            // ★ カテゴリーを変えたとき、すでにインプットに入っている文字の「前のカテゴリー部分」を新しいカテゴリーに置き換える
            setSearchQuery((prev) => {
              // 過去のカテゴリー部分を一旦剥がす簡易処理
              const cleanVal = prev.replace(/^(HG|RG|MG|PG|30MM)\s*/, "");
              return newCat ? `${newCat} ${cleanVal}` : cleanVal;
            });
          }}
          style={{
            padding: "8px",
            borderRadius: "6px",
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #475569",
          }}
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
            name="q" /* ← これでGoogleにそのまま直撃できる！ */
            placeholder="プラモデル名を入力（例：Zガンダム）"
            value={searchQuery}
            onChange={(e) => {
              const rawInput = e.target.value;

              // ★ ユーザーが入力したとき、すでにカテゴリーが先頭についていなければ、選ばれているカテゴリーを自動でくっつける
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
              onClick={() => setSearchQuery(category ? `${category} ` : "")} // クリアしてもカテゴリーは残すか、完全にするかはお好みで
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
