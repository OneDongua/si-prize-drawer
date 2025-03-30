import React, { useState, useEffect } from "react";
import Switch from "../Switch";
import styles from "./index.module.css";

const PrizeDrawer = () => {
  const [prizes, setPrizes] = useState(null);
  const [lastPrize, setLastPrize] = useState("");
  const [initialPrizes, setInitialPrizes] = useState(null); // 保存初始数据
  const [isCoolingDown, setIsCoolingDown] = useState(false); // 冷却状态
  const [tempPrize, setTempPrize] = useState("无"); // 临时奖品状态

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);
  const [clipboardEnabled, setClipboardEnabled] = useState(false); // 是否启用剪贴板

  // 加载本地存储中的奖品数据
  useEffect(() => {
    const storedPrizes = localStorage.getItem("prizes");
    if (storedPrizes) {
      try {
        const parsedPrizes = JSON.parse(storedPrizes);
        setPrizes(parsedPrizes);
        setInitialPrizes(parsedPrizes);
      } catch (error) {
        console.error("无法解析本地存储中的奖品数据:", error);
      }
    }
  }, []);

  // 重置奖品数据
  const handleReset = () => {
    if (window.confirm("确定要重置奖品数据吗？")) {
      if (initialPrizes) {
        setPrizes(initialPrizes);
        localStorage.setItem("prizes", JSON.stringify(initialPrizes)); // 更新本地存储
        alert("奖品数据已重置！");
      } else {
        alert("没有可用的初始数据！");
      }
    }
  };

  // 打开弹窗
  const openModal = () => setIsModalOpen(true);

  // 关闭弹窗
  const closeModal = () => setIsModalOpen(false);

  // 确认奖品数据
  const handleConfirm = (inputJson) => {
    try {
      const parsedPrizes = JSON.parse(inputJson);
      setPrizes(parsedPrizes);
      setInitialPrizes(parsedPrizes);
      localStorage.setItem("prizes", JSON.stringify(parsedPrizes)); // 存储到本地
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
      localStorage.setItem("prizes", JSON.stringify(updatedPrizes)); // 更新本地存储

      setLastPrize(prizeName); // 更新最终奖品
      setTempPrize(""); // 清空临时奖品
      setTimeout(() => {
        setIsCoolingDown(false); // 结束冷却
      }, 200);

      if (clipboardEnabled) {
        navigator.clipboard
          .writeText(JSON.stringify(updatedPrizes, null, 2))
          .catch((err) => {
            console.error("无法写入剪贴板:", err);
            alert("写入剪贴板失败，请检查权限！");
          });
      }
    }, 2000);
  };

  return (
    <div className="content">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{ alignSelf: "flex-start" }}
          className={styles.unfoldable}
          onClick={() => setIsConfigCollapsed(!isConfigCollapsed)}>
          {isConfigCollapsed ? (
            <>
              <svg
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#1f1f1f">
                <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
              </svg>
              展开设置
            </>
          ) : (
            <>
              <svg
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#1f1f1f">
                <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
              </svg>
              折叠
            </>
          )}
        </div>
        <div
          className={`
            ${styles["collapse-content"]} ${
            isConfigCollapsed ? styles.collapsed : styles.expanded
          }
          `}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}>
            <button
              style={{
                alignSelf: "flex-start",
              }}
              onClick={openModal}>
              设置奖品数据
            </button>
            <button onClick={handleReset}>重置</button>
            写入剪贴板
            <Switch
              checked={clipboardEnabled}
              onChange={() => setClipboardEnabled(!clipboardEnabled)}
            />
          </div>
        </div>
      </div>

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

      <div>
        <div>当前奖品数据：</div>
        <pre>{JSON.stringify(prizes, null, 2)}</pre>
      </div>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

// 弹窗组件
const SettingsModal = ({ isOpen, onClose, onConfirm }) => {
  const [inputJson, setInputJson] = useState("");
  const defaultJson = `{
    "奶酪": 16,
    "海豹": 4,
    "玻璃": 31,
    "Doc": 3,
    "玫瑰花": 1,
    "螺丝盒子": 2,
    "起爆器": 1,
    "萝卜网": 2,
    "龙虾": 2,
    "MC模型": 5,
    "CS": 1,
    "立牌": 11,
    "挂件": 20,
    "解压玩具": 3,
    "骷髅": 1
  }`;

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
          rows="16"
          cols="40"
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
          <button onClick={() => setInputJson(defaultJson)}>
            加载默认数据
          </button>
        </div>
      </div>
    </>
  );
};

export default PrizeDrawer;
