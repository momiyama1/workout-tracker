import React, { useState, useEffect } from 'react';
import WorkoutForm from './components/WorkoutForm';
import Timer from './components/Timer';
import WorkoutHistory from './components/WorkoutHistory';
import './styles/App.css';  // CSSファイルのパスが正しいことを確認

const App = () => {
  const [workouts, setWorkouts] = useState([]);
  const [intervalTime] = useState(60);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
      setWorkouts(savedWorkouts);
    } catch (err) {
      setError('データの読み込みに失敗しました。');
      console.error('Error loading workouts:', err);
    }
  }, []);

  const saveWorkout = (workout) => {
    try {
      const existingIndex = workouts.findIndex(w => w.exercise === workout.exercise);
      let newWorkouts;
      
      if (existingIndex !== -1) {
        newWorkouts = [...workouts];
        newWorkouts[existingIndex] = workout;
      } else {
        newWorkouts = [...workouts, workout];
      }
      
      setWorkouts(newWorkouts);
      localStorage.setItem('workouts', JSON.stringify(newWorkouts));
      setError(null);
    } catch (err) {
      setError('データの保存に失敗しました。');
      console.error('Error saving workout:', err);
    }
  };

  const deleteWorkout = (index) => {
    try {
      const updatedWorkouts = workouts.filter((_, i) => i !== index);
      setWorkouts(updatedWorkouts);
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      setError(null);
    } catch (err) {
      setError('データの削除に失敗しました。');
      console.error('Error deleting workout:', err);
    }
  };

  const exerciseList = [...new Set(workouts.map(workout => workout.exercise))];  // 種目名の一意なリスト

  return (
    <div className="app-container">
      <h1>筋トレ記録アプリ</h1>
      {error && <div className="error-message">{error}</div>}
      <WorkoutForm onSave={saveWorkout} exerciseList={exerciseList} workouts={workouts} />
      <Timer intervalTime={intervalTime} />
      <WorkoutHistory workouts={workouts} onDelete={deleteWorkout} />
    </div>
  );
};

export default App;
