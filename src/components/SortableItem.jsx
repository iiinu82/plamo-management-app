import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ id, name, price, url, onEdit }) {
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

  const handleOpenPopup = (e) => {
    e.preventDefault(); // 通常のリンク動作（新しいタブで開く）をストップ
    if (!url) return;

    // Google検索のときと同じサイズ・位置を指定
    const windowFeatures =
      "width=1000,height=700,left=500,top=100,resizable=yes,scrollbars=yes";

    window.open(url, "ProductPopup", windowFeatures);
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="multi-item"
    >
      <span className="item-name">{name}</span>
      <div className="item-right-area">
        <span className="item-price">¥{price.toLocaleString()}</span>
        <button
          type="button"
          className="item-edit-btn"
          onClick={() => onEdit({ id, name, price, url })}
          onPointerDown={(e) => e.stopPropagation()} // ドラッグ暴発防止
          title="編集する"
        >
          edit
        </button>

        {/* urlが存在する場合だけリンクボタンを表示 */}
        {url && (
          <a
            href={url}
            onClick={handleOpenPopup}

            className="item-link-btn"
            onPointerDown={(e) => e.stopPropagation()}
            title="公式サイトを開く"
          >
            link
          </a>
        )}
      </div>
    </div>
  );
}
