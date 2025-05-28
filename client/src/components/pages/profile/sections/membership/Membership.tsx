import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';
import { MembershipLevel, MEMBERSHIP_LEVELS } from '../../../../../types/membership';
import { useMembershipContext } from '../../../../../contexts/MembershipContext';
import './Membership.css';

const Membership: React.FC = () => {
  const location = useLocation();
  const { membership, loading, error } = useMembershipContext();
  const [highlightPoints, setHighlightPoints] = useState(false);
  const [prevPoints, setPrevPoints] = useState(0);
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    if (location.state?.fromCompletedBooking && location.state?.earnedPoints) {
      setHighlightPoints(true);
      setPrevPoints(membership?.points ? membership.points - location.state.earnedPoints : 0);
      setAnimateProgress(true);
      const timer = setTimeout(() => {
        setHighlightPoints(false);
        setAnimateProgress(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state, membership?.points]);

  if (loading) {
    return (
      <div className="membership-container loading">
        <div className="loading-spinner" />
        <p>Loading membership details...</p>
      </div>
    );
  }

  if (error || !membership) {
    return (
      <div className="membership-container error">
        <p>{error || 'No membership found'}</p>
      </div>
    );
  }

  const getLevelColor = (level: MembershipLevel): string => {
    switch (level) {
      case MembershipLevel.DIAMOND:
        return 'membership-diamond';
      case MembershipLevel.GOLD:
        return 'membership-gold';
      case MembershipLevel.SILVER:
      default:
        return 'membership-silver';
    }
  };

  const getLevelProgress = (): { current: number; previous: number } => {
    const nextLevel = membership.level === MembershipLevel.SILVER 
      ? MembershipLevel.GOLD 
      : membership.level === MembershipLevel.GOLD 
        ? MembershipLevel.DIAMOND 
        : null;
    
    if (!nextLevel) return { current: 100, previous: 100 };
    
    const pointsNeeded = nextLevel === MembershipLevel.GOLD ? 1000 : 5000;
    const currentProgress = (membership.points / pointsNeeded) * 100;
    const previousProgress = animateProgress ? (prevPoints / pointsNeeded) * 100 : currentProgress;
    
    return { current: currentProgress, previous: previousProgress };
  };

  const getBenefits = (): string[] => {
    return MEMBERSHIP_LEVELS[membership.level].perks;
  };

  const progress = getLevelProgress();

  return (
    <div className="membership-container">
      <div className={`membership-status-card ${getLevelColor(membership.level)}`}>
        <div className="status-header">
          <div>
            <h3>{membership.level} Member</h3>
            <p className={highlightPoints ? 'points-highlight' : ''}>
              {membership.points} Points
              {highlightPoints && location.state?.earnedPoints && (
                <span className="points-earned">
                  {' '}(+{location.state.earnedPoints})
                </span>
              )}
            </p>
          </div>
          <FaCrown className="level-icon" />
        </div>
        
        <div className="benefits-section">
          <h4>Your Benefits:</h4>
          <ul>
            {getBenefits().map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
        
        {membership.level !== MembershipLevel.DIAMOND && (
          <div className="progress-section">
            <p>Progress to next level</p>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${animateProgress ? progress.current : progress.previous}%`
                }}
              />
            </div>
            <p className="points-needed">
              {membership.level === MembershipLevel.SILVER 
                ? `${1000 - membership.points} points to Gold`
                : `${5000 - membership.points} points to Diamond`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Membership;
