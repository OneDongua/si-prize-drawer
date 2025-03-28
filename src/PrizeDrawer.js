import React, { useState } from "react";

// 新增弹窗组件
const SettingsModal = ({ isOpen, onClose, onConfirm }) => {
  const [inputJson, setInputJson] = useState("");

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      }}
    >
      <h2>抽奖设置</h2>
      <textarea
        rows="10"
        cols="50"
        value={inputJson}
        onChange={(e) => setInputJson(e.target.value)}
        placeholder="在此输入奖品JSON数据"
      />
      <br />
      <br />
      <button
        onClick={() => onConfirm(inputJson)}
        style={{ marginRight: "10px" }}
      >
        确认
      </button>
      <button onClick={onClose}>关闭</button>
    </div>
  );
};

const PrizeDrawer = () => {
  const [prizes, setPrizes] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastPrize, setLastPrize] = useState("");

  // 打开弹窗
  const openModal = () => setIsModalOpen(true);

  // 关闭弹窗
  const closeModal = () => setIsModalOpen(false);

  // 确认奖品数据
  const handleConfirm = (inputJson) => {
    try {
      const parsedPrizes = JSON.parse(inputJson);
      setPrizes(parsedPrizes);
      alert("奖品数据已成功加载！");
      closeModal();
    } catch (error) {
      alert("请输入有效的JSON格式数据！");
    }
  };

  // 抽奖逻辑
  const handleDraw = () => {
    if (!prizes) {
      alert("请先确认奖品数据！");
      return;
    }

    const availablePrizes = Object.entries(prizes).filter(
      ([_, count]) => count > 0
    );
    if (availablePrizes.length === 0) {
      alert("所有奖品已抽完！");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    const [prizeName, prizeCount] = availablePrizes[randomIndex];

    const updatedPrizes = { ...prizes };
    updatedPrizes[prizeName] -= 1;

    navigator.clipboard
      .writeText(JSON.stringify(updatedPrizes, null, 2))
      .then(() => {
        setPrizes(updatedPrizes);
        setLastPrize(prizeName);
        alert(`恭喜抽中：${prizeName}！剩余数量：${updatedPrizes[prizeName]}`);
      })
      .catch((err) => {
        console.error("无法写入剪贴板:", err);
        alert("写入剪贴板失败，请检查权限！");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>抽奖系统</h1>

      {/* 主页面按钮 */}
      <button onClick={openModal} style={{ marginBottom: "20px" }}>
        设置奖品数据
      </button>

      <div>
        <h3>上一次抽中的奖品：</h3>
        <p
          style={{
            fontSize: "50px",
            fontWeight: "bold",
          }}
        >
          {lastPrize || "无"}
        </p>
      </div>
      <button onClick={handleDraw} disabled={!prizes}>
        抽奖
      </button>

      {/* 显示当前奖品数据 */}
      <h3>当前奖品数据：</h3>
      <pre>{JSON.stringify(prizes, null, 2)}</pre>

      {/* 弹窗组件 */}
      <SettingsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default PrizeDrawer;
