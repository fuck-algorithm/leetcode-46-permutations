import { useState } from 'react';
import { TutorialState } from '../types';
import './TutorialOverlay.css';

interface TutorialPrompt {
  title: string;
  message: string;
  options?: string[];
  showPrediction?: boolean;
}

interface TutorialOverlayProps {
  tutorialState: TutorialState;
  prompt: TutorialPrompt | null;
  onContinue: () => void;
  onExit: () => void;
  onPrediction: (prediction: string) => void;
}

export function TutorialOverlay({
  tutorialState,
  prompt,
  onContinue,
  onExit,
  onPrediction,
}: TutorialOverlayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!tutorialState.isActive || !prompt) return null;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onPrediction(option);
  };

  const handleContinue = () => {
    setSelectedOption(null);
    onContinue();
  };

  const isIntro = tutorialState.currentStep === 'intro';
  const isSummary = tutorialState.currentStep === 'summary';
  const needsPrediction = prompt.showPrediction && !tutorialState.userPrediction;

  return (
    <div className="tutorial-overlay">
      <div className={`tutorial-card ${tutorialState.currentStep}`}>
        {/* 关闭按钮 */}
        <button className="close-button" onClick={onExit} title="退出教程">
          ✕
        </button>

        {/* 标题 */}
        <div className="tutorial-header">
          <h3 className="tutorial-title">{prompt.title}</h3>
        </div>

        {/* 内容 */}
        <div className="tutorial-content">
          <p className="tutorial-message">{prompt.message}</p>

          {/* 选项按钮 */}
          {prompt.options && needsPrediction && (
            <div className="prediction-section">
              <p className="prediction-label">你的预测：</p>
              <div className="options-list">
                {prompt.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 用户预测反馈 */}
          {tutorialState.userPrediction && (
            <div className="prediction-feedback">
              <span className="feedback-icon">💡</span>
              <span className="feedback-text">
                你选择了：{tutorialState.userPrediction}
              </span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="tutorial-actions">
          {isIntro && (
            <>
              <button className="action-button secondary" onClick={onExit}>
                跳过教程
              </button>
              <button className="action-button primary" onClick={handleContinue}>
                开始学习 →
              </button>
            </>
          )}

          {isSummary && (
            <button className="action-button primary" onClick={onExit}>
              完成教程 🎉
            </button>
          )}

          {!isIntro && !isSummary && (
            <button
              className="action-button primary"
              onClick={handleContinue}
              disabled={needsPrediction}
            >
              {needsPrediction ? '请先选择你的预测' : '继续 →'}
            </button>
          )}
        </div>

        {/* 进度指示 */}
        <div className="tutorial-progress">
          <div className="progress-dots">
            {['intro', 'first-select', 'continue-select', 'first-complete', 'first-backtrack', 'summary'].map(
              (step) => (
                <span
                  key={step}
                  className={`progress-dot ${
                    tutorialState.currentStep === step ? 'active' : ''
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
