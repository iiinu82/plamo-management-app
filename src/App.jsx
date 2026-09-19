import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import "./App.css";
import { Column } from "./components/Column";
import { initialProducts } from "./data/Products";
import { ProductModal } from "./components/ProductModal";
import { v4 as uuidv4 } from "uuid";
import { SearchForm } from "./components/SearchForm";

// 読み込み時のデータ
const loadInitialContainers = () => {
  const savedData = localStorage.getItem("plamo_containers");
  if (savedData) {
    try {
      return JSON.parse(savedData); // 保存されていればそれを復元
    } catch (e) {
      console.error("データの読み込みに失敗しました", e);
    }
  }
  // 保存データがない（初回やクリア時）はサンプルデータを使う
  return {
    left: initialProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      url: p.url,
      isGundamBase: p.isGundamBase || false,
      isPremium: p.isPremium || false,
    })),
    center: [],
    right: [],
  };
};

// -----------------------------------------------------------------------------------------------

function App() {
  // 3つのカラム（left, center, right）のデータを状態（State）として管理
  const [containers, setContainers] = useState(loadInitialContainers);
  // 現在ドラッグしているアイテムのIDを保持（プレビュー表示用）
  const [activeId, setActiveId] = useState(null);

  // モーダルの開閉状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 編集中のアイテムID（nullなら新規追加モード、IDがあれば編集モード）
  const [editingId, setEditingId] = useState(null);
  // 新規登録・編集フォームの入力値の状態
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    url: "",
    isGundamBase: false,
    isPremium: false,
  });

  // データの変更があるたびに localStorage に自動保存する
  useEffect(() => {
    localStorage.setItem("plamo_containers", JSON.stringify(containers));
  }, [containers]);

  //! ------------------------------------ここからドラッグドロップ関連-----------------

  // マウス、タッチ、キーボード操作を有効にするセンサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 指定されたID（アイテムまたはカラム名）がどのコンテナに所属しているかを探すヘルパー関数
  const findContainer = (id) => {
    if (!id) return null;
    if (["left", "center", "right"].includes(id)) return id;
    if (containers.left.some((item) => item.id === id)) return "left";
    if (containers.center.some((item) => item.id === id)) return "center";
    if (containers.right.some((item) => item.id === id)) return "right";
    return null;
  };

  // ドラッグを開始した瞬間の処理：掴んだアイテムのIDを保存する
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // ドラッグ中に別のカラムやアイテムの上を通過したときの処理：リアルタイムでリスト間の移動を行う
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceContainer = findContainer(activeId);
    let targetContainer = findContainer(overId);

    if (
      !sourceContainer ||
      !targetContainer ||
      sourceContainer === targetContainer
    ) {
      return;
    }

    setContainers((prev) => {
      const sourceItems = [...prev[sourceContainer]];
      const targetItems = [...prev[targetContainer]];

      const activeIndex = sourceItems.findIndex((item) => item.id === activeId);
      if (activeIndex === -1) return prev;

      const [movedItem] = sourceItems.splice(activeIndex, 1);

      const targetIndex = targetItems.findIndex((item) => item.id === overId);
      if (targetIndex >= 0) {
        targetItems.splice(targetIndex, 0, movedItem);
      } else {
        targetItems.push(movedItem);
      }

      return {
        ...prev,
        [sourceContainer]: sourceItems,
        [targetContainer]: targetItems,
      };
    });
  };
  // ドラッグ操作が完了（ドロップ）したときの処理：同じリスト内での並び順を確定させる
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceContainer = findContainer(activeId);
    let targetContainer = findContainer(overId);

    if (!sourceContainer || !targetContainer) return;

    if (sourceContainer === targetContainer) {
      const items = containers[sourceContainer];
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);

      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        setContainers((prev) => ({
          ...prev,
          [sourceContainer]: arrayMove(
            prev[sourceContainer],
            oldIndex,
            newIndex,
          ),
        }));
      }
    }
  };

  // 現在ドラッグ中のアイテムオブジェクトを取得（DragOverlay用）
  const activeItem = Object.values(containers)
    .flat()
    .find((item) => item.id === activeId);

  //! ------------------------------------ここまでドラッグドロップ関連-----------------

  // 新規登録ボタンを押した時。空のデータを渡してモーダルをオープン
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", url: "" });
    setIsModalOpen(true);
  };

  // 変更ボタンを押した時。item情報を引数で渡し、エディットIDを設定、フォームデータを入れる、モーダルをオープン
  const handleOpenEditModal = (item) => {
    console.log("クリックされたアイテムの中身：", item); // ← これを入れてみる
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: item.price,
      url: item.url,
      isGundamBase: item.isGundamBase || false,
      isPremium: item.isPremium || false,
    });
    setIsModalOpen(true);
  };

  // フォーム入力値の変更ハンドラー
  const handleFormChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "isGundamBase" && checked) updated.isPremium = false;
      if (name === "isPremium" && checked) updated.isGundamBase = false;
      return updated;
    });
  };

  // 登録の関数。エディットIDがあるなら編集モード
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      setContainers((prev) => {
        const updateList = (list) =>
          list.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  name: formData.name,
                  price: Number(formData.price) || 0,
                  url: formData.url,
                  isGundamBase: formData.isGundamBase,
                  isPremium: formData.isPremium,
                }
              : item,
          );

        return {
          left: updateList(prev.left),
          center: updateList(prev.center),
          right: updateList(prev.right),
        };
      });
    } else {
      // --- 【新規追加モード】新しいアイテムを追加 ---
      const newItem = {
        id: uuidv4(),
        name: formData.name,
        price: Number(formData.price) || 0,
        url: formData.url,
        isGundamBase: formData.isGundamBase,
        isPremium: formData.isPremium,
      };

      setContainers((prev) => ({
        ...prev,
        left: [newItem, ...prev.left],
      }));
    }

    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      url: "",
      isGundamBase: false,
      isPremium: false,
    });
  };

  const handleDeleteItem = () => {
    if (!editingId) return;
    if (!window.confirm("本当にこの商品を削除しますか？")) return;

    setContainers((prev) => {
      const removeList = (list) => list.filter((item) => item.id !== editingId);
      return {
        left: removeList(prev.left),
        center: removeList(prev.center),
        right: removeList(prev.right),
      };
    });

    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", price: "", url: "" });
  };

  //------------------------------------------------------------------------------------------------------------------------------

  return (
    <>
      <div className="appContainer">
        <h1>
          PLASTIC MODEL MANAGEMENT APP
          <span className="titleSpan">// VERSION 1.0</span>
        </h1>
        <div className="header">
          <div className="addArea">
            <button onClick={handleOpenAddModal} className="addBtn">
              +
            </button>
            <span className="addText">新規追加</span>
          </div>

          <div className="formArea">
            <SearchForm />
          </div>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="listArea">
            <Column
              id="left"
              title="INVENTORY（所持一覧）"
              items={containers.left}
              onEdit={handleOpenEditModal}
            />
            <Column
              id="center"
              title="BUILDING（作成中）"
              items={containers.center}
              onEdit={handleOpenEditModal}
            />
            <Column
              id="right"
              title="COMPLETED（完成済み）"
              items={containers.right}
              onEdit={handleOpenEditModal}
            />
          </div>

          {/* ドラッグ中にマウスに追従するプレビュー表示 */}
          <DragOverlay>
            {activeItem ? (
              <div className="multi-item dragging-overlay">
                <span className="item-name">{activeItem.name}</span>
                <div className="item-right-area">
                  <span className="item-price">
                    ¥{activeItem.price.toLocaleString()}
                  </span>
                  <button type="button" className="item-edit-btn">
                    edit
                  </button>
                  {activeItem.url && <a className="item-link-btn">link</a>}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          onDelete={handleDeleteItem}
          isEditing={Boolean(editingId)}
        />
      </div>
    </>
  );
}

export default App;
