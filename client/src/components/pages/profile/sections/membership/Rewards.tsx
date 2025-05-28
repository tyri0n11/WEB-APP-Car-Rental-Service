import React from 'react';
import { useMembershipContext } from '../../../../../contexts/MembershipContext';
import './Membership.css';

const Rewards: React.FC = () => {
  const { rewards, exchangePoints, membership, loading, error } = useMembershipContext();

  if (loading) {
    return <div className="loading-spinner">Loading rewards...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="rewards-section">
      <h2>Available Rewards</h2>
      {rewards.length > 0 ? (
        <div className="rewards-grid">
          {rewards.map((reward) => (
            <div key={reward.id} className="reward-card">
              <h3>{reward.title}</h3>
              <p>{reward.description}</p>
              <p className="points-cost">{reward.pointsCost} points</p>
              <button
                className="exchange-button"
                onClick={() => exchangePoints(reward.id, reward.pointsCost)}
                disabled={!membership || membership.points < reward.pointsCost}
              >
                Exchange
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No rewards available at this time.</p>
        </div>
      )}
    </div>
  );
};

export default Rewards;
