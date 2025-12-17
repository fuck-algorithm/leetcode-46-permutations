import { useState } from 'react';
import './AlgorithmIntro.css';

interface AlgorithmIntroProps {
  inputNumbers: number[];
}

export function AlgorithmIntro({ inputNumbers }: AlgorithmIntroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exampleInput = inputNumbers.length > 0 ? inputNumbers : [1, 2, 3];

  return (
    <>
      <button
        className="algorithm-intro-btn"
        onClick={() => setIsModalOpen(true)}
        title="查看算法思路"
      >
        💡 算法思路
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">💡</span>
              <span className="modal-title">算法思路</span>
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="intro-section">
                <div className="section-title">🎯 目标</div>
                <p>
                  给定数组 <code>[{exampleInput.join(', ')}]</code>，找出所有可能的排列组合。
                </p>
              </div>

              <div className="intro-section">
                <div className="section-title">🧠 核心思路</div>
                <p>像填空一样，一个位置一个位置地选数字：</p>
                <ol className="thought-steps">
                  <li>
                    <strong>选择</strong>：从剩余数字中选一个放入当前位置
                  </li>
                  <li>
                    <strong>递归</strong>：继续填下一个位置
                  </li>
                  <li>
                    <strong>回溯</strong>：填完或走不通时，撤销选择，尝试其他数字
                  </li>
                </ol>
              </div>

              <div className="intro-section">
                <div className="section-title">🔄 回溯的本质</div>
                <p className="key-insight">
                  <strong>回溯 = 撤销上一步选择</strong>
                  <br />
                  把刚选的数字放回"可选池"，然后尝试选择其他数字。
                </p>
              </div>

              <div className="intro-section visual-example">
                <div className="section-title">📊 观察要点</div>
                <ul className="watch-points">
                  <li><span className="color-dot select"></span> <strong>绿色</strong>：正在选择数字</li>
                  <li><span className="color-dot backtrack"></span> <strong>橙色</strong>：正在回溯</li>
                  <li><span className="color-dot complete"></span> <strong>紫色</strong>：找到一个完整排列</li>
                </ul>
              </div>

              <div className="intro-section">
                <div className="section-title">⌨️ 快捷键</div>
                <ul className="shortcut-list">
                  <li><kbd>空格</kbd> 播放/暂停</li>
                  <li><kbd>←</kbd> 上一步</li>
                  <li><kbd>→</kbd> 下一步</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
