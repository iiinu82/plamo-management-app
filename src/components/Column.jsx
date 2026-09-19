// ドロップ可能なカラム（列）コンポーネント：コンテンツエリアをドロップ先として登録する
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

export function Column({ id, title, items, onEdit }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="column">
      <h3>{title}</h3>
      <div className="column-content" ref={setNodeRef}>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem key={item.id} {...item} onEdit={() => onEdit(item)} />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div className="empty-notice">ここにドロップ</div>
        )}
      </div>
    </div>
  );
}
