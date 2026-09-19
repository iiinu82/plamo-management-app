import React from "react";

export function ProductModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  onDelete, // 削除用の関数
  isEditing, // 編集モードかどうか
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>
          {isEditing ? "プラモデル情報の変更・削除" : "プラモデル新規登録"}
        </h2>
        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-group">
            <label>商品名</label>
            <textarea
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="例：RG 1/144 フリーダムガンダム "
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>価格 (円)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={onChange}
              placeholder="例：2800"
              required
            />
          </div>

          <div className="form-group">
            <label>公式サイト URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={onChange}
              placeholder="例：https://bandai-hobby.net/..."
            />
          </div>

          {/* ★ 追加：ガンダムベース・プレバンのチェックボックスエリア */}
          <div
            className="form-group checkbox-group"
            style={{ flexDirection: "row", gap: "20px", alignItems: "center" }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="isGundamBase"
                checked={Boolean(formData.isGundamBase)}
                onChange={onChange}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              ガンダムベース限定
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="isPremium"
                checked={Boolean(formData.isPremium)}
                onChange={onChange}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              プレミアムバンダイ
            </label>
          </div>

          <div className="modal-actions">
            {/* 編集モードのときだけ「削除」ボタンを表示 */}
            {isEditing && (
              <button type="button" onClick={onDelete} className="delete-btn">
                削除
              </button>
            )}
            <div className="right-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                キャンセル
              </button>
              <button type="submit" className="submit-btn">
                {isEditing ? "変更を保存" : "登録する"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
