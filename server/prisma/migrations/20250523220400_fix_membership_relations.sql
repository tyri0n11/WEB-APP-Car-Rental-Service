-- Update PointHistory model constraints
ALTER TABLE "point_history"
  DROP CONSTRAINT IF EXISTS "ph_user_fkey",
  DROP CONSTRAINT IF EXISTS "ph_reward_fkey",
  DROP CONSTRAINT IF EXISTS "ph_membership_fkey",
  ADD CONSTRAINT "ph_user_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "ph_reward_fkey" FOREIGN KEY ("rewardId") REFERENCES "rewards"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "ph_membership_fkey" FOREIGN KEY ("userId") REFERENCES "memberships"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add unique constraint on userId in memberships if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'memberships_userId_key') THEN
    ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_key" UNIQUE ("userId");
  END IF;
END $$;
