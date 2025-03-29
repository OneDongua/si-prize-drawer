import React, { useState } from "react";

// 新增弹窗组件
const SettingsModal = ({ isOpen, onClose, onConfirm }) => {
  const [inputJson, setInputJson] = useState("");

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 999,
        }}
      />
      <div
        className="card"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "1.5rem",
          backgroundColor: "white",
          zIndex: 1000,
        }}>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}>
          抽奖设置
        </div>
        <div className="gap" />
        <textarea
          rows="10"
          cols="50"
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          placeholder="在此输入奖品JSON数据"
        />
        <div className="gap" />
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}>
          <button onClick={() => onConfirm(inputJson)}>确认</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </>
  );
};

const PrizeDrawer = () => {
  const [prizes, setPrizes] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastPrize, setLastPrize] = useState("");

  const [isCoolingDown, setIsCoolingDown] = useState(false); // 冷却状态
  const [tempPrize, setTempPrize] = useState(""); // 临时奖品状态

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

    setIsCoolingDown(true); // 开始冷却

    // 随机变换临时奖品
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availablePrizes.length);
      const [randomPrizeName] = availablePrizes[randomIndex];
      setTempPrize(randomPrizeName);
    }, 100);

    // 最终确定奖品
    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    const [prizeName, prizeCount] = availablePrizes[randomIndex];

    setTimeout(() => {
      clearInterval(intervalId); // 停止随机变换

      const updatedPrizes = { ...prizes };
      updatedPrizes[prizeName] -= 1;
      setPrizes(updatedPrizes);
      //alert(`恭喜抽中：${prizeName}！剩余数量：${updatedPrizes[prizeName]}`);

      setLastPrize(prizeName); // 更新最终奖品
      setTempPrize(""); // 清空临时奖品
      setTimeout(() => {
        setIsCoolingDown(false); // 结束冷却
      }, 200);

      navigator.clipboard
        .writeText(JSON.stringify(updatedPrizes, null, 2))
        .catch((err) => {
          console.error("无法写入剪贴板:", err);
          alert("写入剪贴板失败，请检查权限！");
        });
    }, 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        minWidth: "600px",
      }}>
      <button
        style={{
          alignSelf: "flex-start",
        }}
        onClick={openModal}>
        设置奖品数据
      </button>

      <div className="card">
        <div>上一次抽中的奖品：</div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "1rem",
            fontSize: "3.5rem",
            fontWeight: "bold",
          }}>
          {isCoolingDown ? tempPrize || lastPrize : lastPrize || "无"}
        </div>
      </div>
      <button
        style={{ alignSelf: "center" }}
        onClick={handleDraw}
        disabled={!prizes || isCoolingDown}>
        {isCoolingDown ? "冷却中..." : "抽奖"}
      </button>

      <div>当前奖品数据：</div>
      <pre>{JSON.stringify(prizes, null, 2)}</pre>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default PrizeDrawer;
