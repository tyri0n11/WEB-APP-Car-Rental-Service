import React from 'react';
import { useMembershipContext } from '../../../../../contexts/MembershipContext';
import './Membership.css';

const PointsHistory: React.FC = () => {
  const { pointsHistory, loading, error } = useMembershipContext();

  if (loading) {
    return <div className="loading-spinner">Loading points history...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="points-history-section">
      <h2>Points History</h2>
      {pointsHistory.length > 0 ? (
        <div className="history-list">
          {pointsHistory.map((history) => (
            <div key={history.id} className="history-item">
              <div className="history-info">
                <p className="history-description">{history.description}</p>
                <p className="history-date">
                  {new Date(history.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className={`points-change ${history.points > 0 ? 'points-earned' : 'points-spent'}`}>
                {history.points > 0 ? '+' : ''}{history.points}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No points history yet. Start earning points with your first booking!</p>
        </div>
      )}
    </div>
  );
};

export default PointsHistory;
