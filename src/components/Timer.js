import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ intervalTime }) => {
  const [timeLeft, setTimeLeft] = useState(intervalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [minutes, setMinutes] = useState(Math.floor(intervalTime / 60));
  const [seconds, setSeconds] = useState(intervalTime % 60);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  // 音楽ファイルを参照として保持
  const alarmSound = useRef(new Audio('/sounds/sky-loop.wav')).current;

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
            return minutes * 60 + seconds;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds]);

  const toggleTimer = () => {
    if (isAlarmPlaying) {
      alarmSound.pause();  // 音楽を停止
      alarmSound.currentTime = 0;  // 音楽を最初に戻す
      setIsAlarmPlaying(false);  // 音楽停止状態
    } else {
      setIsRunning((prev) => !prev);  // タイマーの状態を切り替え
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 60)) {
      setMinutes(value);
      setTimeLeft((value === '' ? 0 : parseInt(value)) * 60 + seconds);
    }
  };

  const handleSecondsChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
      setSeconds(value);
      setTimeLeft(minutes * 60 + (value === '' ? 0 : parseInt(value)));
    }
  };

  return (
    <div className="timer-container">
      <h3>インターバルタイマー</h3>
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <div className="timer-input">
        <div className="time-input-group">
          <label>分: </label>
          <input
            type="number"
            value={minutes}
            onChange={handleMinutesChange}
            min="0"
            max="60"
            placeholder="分"
          />
        </div>
        <div className="time-input-group">
          <label>秒: </label>
          <input
            type="number"
            value={seconds}
            onChange={handleSecondsChange}
            min="0"
            max="59"
            placeholder="秒"
          />
        </div>
      </div>
      <button onClick={toggleTimer}>
        {isAlarmPlaying ? '音楽を停止' : (isRunning ? '停止' : '開始')}
      </button>
    </div>
  );
};

export default Timer;