import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ intervalTime }) => {
  const [timeLeft, setTimeLeft] = useState(intervalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [customTime, setCustomTime] = useState(intervalTime);  // 手動で設定する時間
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false); // 音楽が再生中かどうかの状態

  // 音楽ファイルを参照として保持
  const alarmSound = useRef(new Audio('/sounds/sky-loop.wav')).current;

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setIsRunning(false);
            alarmSound.play();  // タイマーが0になったらアラームを鳴らす
            setIsAlarmPlaying(true); // 音楽再生中に状態を更新
            return customTime;  // 手動設定の時間にリセット
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, customTime]);

  const toggleTimer = () => {
    if (isAlarmPlaying) {
      alarmSound.pause();  // 音楽を停止
      alarmSound.currentTime = 0;  // 音楽を最初に戻す
      setIsAlarmPlaying(false);  // 音楽停止状態
    } else {
      setIsRunning((prev) => !prev);  // タイマーの状態を切り替え
    }
  };

  const handleTimeChange = (e) => {
    const newTime = parseInt(e.target.value, 10) || 0;
    setCustomTime(newTime);
    setTimeLeft(newTime);  // タイマーの時間も手動設定に合わせて更新
  };

  return (
    <div className="timer-container">
      <h3>インターバルタイマー</h3>
      <div className="timer-display">残り時間: {timeLeft}秒</div>
      <div className="timer-input">
        <label>手動設定時間: </label>
        <input
          type="number"
          value={customTime}
          onChange={handleTimeChange}
          min="1"
          placeholder="秒数を入力"
        />
      </div>
      <button onClick={toggleTimer}>
        {isAlarmPlaying ? '音楽を停止' : (isRunning ? '停止' : '開始')}
      </button>
    </div>
  );
};

export default Timer;