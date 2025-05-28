import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { membershipApi } from '../apis/membership';
import { Membership, Reward, PointHistory } from '../types/membership';
import { useLocation } from 'react-router-dom';

interface MembershipContextType {
  membership: Membership | null;
  rewards: Reward[];
  pointsHistory: PointHistory[];
  loading: boolean;
  error: string | null;
  refreshMembership: () => Promise<void>;
  exchangePoints: (rewardId: string, points: number) => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const MembershipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const refreshMembership = async () => {
    if (!user) {
      setMembership(null);
      setRewards([]);
      setPointsHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Refreshing membership data...');

      const membershipData = await membershipApi.getMembership();
      console.log('Received membership data:', membershipData);

      if (membershipData) {
        // Fetch rewards and history in parallel
        const [rewardsData, historyData] = await Promise.all([
          membershipApi.getRewards(),
          membershipApi.getPointsHistory()
        ]);

        console.log('Updated membership state:', {
          membership: membershipData,
          rewards: rewardsData,
          history: historyData
        });

        // Only update state if all requests were successful
        setMembership(membershipData);
        setRewards(rewardsData);
        setPointsHistory(historyData);
      } else {
        // User doesn't have a membership yet
        setMembership(null);
        setRewards([]);
        setPointsHistory([]);
      }
    } catch (err) {
      console.error('Error refreshing membership:', err);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const exchangePoints = async (rewardId: string, points: number) => {
    if (!user || !membership) return;

    try {
      setError(null);
      await membershipApi.exchangePoints(rewardId, points);
      // Refresh data after successful exchange
      await refreshMembership();
    } catch (err) {
      if (err instanceof Error && err.message === 'Authentication token expired. Please log in again.') {
        setMembership(null);
        setRewards([]);
        setPointsHistory([]);
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to exchange points');
      }
      throw err; // Re-throw to handle in component
    }
  };

  // Refresh membership when user changes or when coming from completed booking
  useEffect(() => {
    refreshMembership();
  }, [user]);

  // Force refresh when coming from completed booking page
  useEffect(() => {
    if (location.pathname.includes('completed-booking')) {
      console.log('Coming from completed booking, refreshing membership...');
      refreshMembership();
    }
  }, [location.pathname]);

  return (
    <MembershipContext.Provider 
      value={{
        membership,
        rewards,
        pointsHistory,
        loading,
        error,
        refreshMembership,
        exchangePoints
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembershipContext = () => {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembershipContext must be used within a MembershipProvider');
  }
  return context;
};