import React, { useMemo } from 'react';

const WorkoutHistory = ({ workouts, onDelete }) => {
  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [workouts]);

  return (
    <div className="workout-history">
      <h2>記録履歴</h2>
      {sortedWorkouts.length === 0 ? (
        <p>記録がありません</p>
      ) : (
        <ul>
          {sortedWorkouts.map((workout, index) => (
            <li key={index}>
              <div className="workout-item">
                <div className="workout-header">
                  <h3>{workout.exercise}</h3>
                  <span className="workout-date">{workout.date}</span>
                </div>
                <div className="workout-details">
                  <p>セット数: {workout.sets}</p>
                  <div className="reps-list">
                    {workout.reps.map((rep, repIndex) => (
                      <span key={repIndex} className="rep-item">
                        {repIndex + 1}セット目: {rep}回
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => onDelete(index)} className="delete-button">
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutHistory;
