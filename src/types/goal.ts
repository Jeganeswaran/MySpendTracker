/**
 * MySpendTracker — Savings Goal Types
 * -----------------------------------
 */

export interface Goal {
  id: string;
  title: string;
  /** Target amount to save */
  target: number;
  /** Amount saved so far */
  current: number;
  /** Deadline — ISO date */
  deadline: string;
  /** Emoji or icon */
  icon: string;
  /** Optional description */
  description?: string;
  /** Color accent */
  color?: string;
  /** Whether the goal was completed */
  completed?: boolean;
  /** Metadata */
  createdAt: string;
  updatedAt: string;
}

export interface GoalProgress {
  percent: number;
  remaining: number;
  daysLeft: number;
  /** Behind / ahead / on track */
  status: 'on-track' | 'behind' | 'ahead' | 'completed';
}
