import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ onEdit, ...item }) {
  const { id, name, price, url, isGundamBase, isPremium } = item;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1, // ドラッグ中は半透明にする
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`multi-item ${
        isGundamBase ? "gundam-base-item" : isPremium ? "premium-item" : ""
      }`}
    >
      <span className="item-name">{name}</span>
      <div className="item-right-area">
        <span className="item-price">¥{price.toLocaleString()}</span>
        <button
          type="button"
          className="item-edit-btn"
          onClick={() => onEdit(item)}
          onPointerDown={(e) => e.stopPropagation()} // ドラッグ暴発防止
          title="編集する"
        >
          edit
        </button>

        {/* urlが存在する場合だけリンクボタンを表示 */}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="item-link-btn"
            onPointerDown={(e) => e.stopPropagation()} // ドラッグ暴発防止だけ残す
            title="公式サイトを開く"
          >
            link
          </a>
        )}
      </div>
    </div>
  );
}
