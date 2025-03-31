import React, { useState, useEffect } from 'react';

const MAX_SETS = 100;

const WorkoutForm = ({ onSave, exerciseList, workouts }) => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState(['']);  // 現在の回数入力
  const [savedReps, setSavedReps] = useState({});  // 以前入力した回数を保持
  const [date, setDate] = useState('');
  const [lastWorkout, setLastWorkout] = useState(null);

  // 種目が選択された時に前回の記録を取得
  useEffect(() => {
    if (exercise) {
      const lastWorkoutForExercise = workouts
        .filter(w => w.exercise === exercise)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      setLastWorkout(lastWorkoutForExercise);
    } else {
      setLastWorkout(null);
    }
  }, [exercise, workouts]);

  const handleExerciseChange = (e) => {
    setExercise(e.target.value);
  };

  const handleSetsChange = (e) => {
    const newSets = parseInt(e.target.value, 10);
    if (newSets >= 1 && newSets <= MAX_SETS) {
      setSets(newSets);
      // 以前入力した回数を復元しながら、新しいセットを追加
      const newReps = Array(newSets).fill('').map((_, index) => {
        return savedReps[index] || '';
      });
      setReps(newReps);
    } else if (newSets > MAX_SETS) {
      setSets(MAX_SETS);
      const newReps = Array(MAX_SETS).fill('').map((_, index) => {
        return savedReps[index] || '';
      });
      setReps(newReps);
    } else {
      setSets('');
      setReps(['']);
    }
  };

  const handleRepsChange = (index, e) => {
    const newReps = [...reps];
    const value = parseInt(e.target.value, 10) || '';
    newReps[index] = value;
    setReps(newReps);
    // 入力された回数を保存
    setSavedReps(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 入力値のバリデーション
    if (!exercise.trim()) {
      alert('種目名を入力してください。');
      return;
    }

    if (!sets || sets < 1) {
      alert('セット数を正しく入力してください。');
      return;
    }

    if (reps.some(rep => rep === '')) {
      alert('すべてのセットの回数を入力してください。');
      return;
    }

    if (reps.some(rep => rep < 1)) {
      alert('回数は1以上を入力してください。');
      return;
    }

    const workoutData = {
      exercise: exercise.trim(),
      sets,
      reps,
      date: date || new Date().toLocaleDateString(),
    };
    onSave(workoutData);
    setExercise('');
    setSets(1);
    setReps(['']);
    setSavedReps({});
    setDate('');
  };

  // 前回の記録との差分を計算
  const getRepsDifference = (currentReps, lastReps, index) => {
    if (!lastReps || !lastReps[index]) return null;
    const diff = currentReps - lastReps[index];
    if (diff === 0) return null;
    return diff > 0 ? `+${diff}` : diff.toString();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>種目:</label>
        <select value={exercise} onChange={handleExerciseChange}> 
          <option value="">種目を選択してください</option>
          {exerciseList.map((exerciseItem, index) => (
            <option key={index} value={exerciseItem}>
              {exerciseItem}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={exercise}
          onChange={handleExerciseChange}
          placeholder="種目名"
          required
        />
      </div>
      {lastWorkout && (
        <div className="last-workout-info">
          <p>前回の記録 ({lastWorkout.date}):</p>
          <div className="last-reps">
            {lastWorkout.reps.map((rep, index) => (
              <span key={index} className="last-rep">
                {index + 1}セット目: {rep}回
              </span>
            ))}
          </div>
        </div>
      )}
      <div>
        <label>セット数:</label>
        <input
          type="number"
          value={sets}
          onChange={handleSetsChange}
          min="1"
          required
        />
      </div>
      {Array.from({ length: sets }).map((_, index) => (
        <div key={index} className="rep-input-container">
          <label>{index + 1}セット目:</label>
          <div className="rep-input-wrapper">
            <input
              type="number"
              value={reps[index]}
              onChange={(e) => handleRepsChange(index, e)}
              placeholder={`回数`}
              required
            />
            {lastWorkout && reps[index] && (
              <span className={`reps-difference ${getRepsDifference(reps[index], lastWorkout.reps, index)?.startsWith('+') ? 'increase' : 'decrease'}`}>
                {getRepsDifference(reps[index], lastWorkout.reps, index)}
              </span>
            )}
          </div>
        </div>
      ))}
      <div>
        <label>日付:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button type="submit">保存</button>
    </form>
  );
};

export default WorkoutForm;
