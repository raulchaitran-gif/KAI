/**
 * KAI Notification Service
 * Uses the Web Notifications API — works in browser and Capacitor WebView on Android.
 * On Android, Capacitor exposes native notification support through the WebView bridge.
 */

export type NotificationPayload = {
  title: string;
  body: string;
  icon?: string;
};

// ── Permission ───────────────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

// ── Core send ────────────────────────────────────────────────────────────────

export async function sendNotification({ title, body, icon }: NotificationPayload): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (!granted) return false;
  new Notification(title, {
    body,
    icon: icon ?? '/src/assets/logo.png',
    badge: '/src/assets/logo.png',
  });
  return true;
}

// ── Scheduled check (runs on app load) ──────────────────────────────────────

export interface BudgetAlert {
  categoryName: string;
  spent: number;
  limit: number;
}

export interface RecurringAlert {
  note: string;
  amount: number;
  currency: string;
}

/**
 * Check budgets and fire a notification if any category exceeds 85% of its limit.
 */
export async function checkBudgetAlerts(alerts: BudgetAlert[]): Promise<void> {
  const overBudget = alerts.filter(a => a.limit > 0 && a.spent / a.limit >= 0.85);
  if (overBudget.length === 0) return;

  for (const alert of overBudget) {
    const pct = Math.round((alert.spent / alert.limit) * 100);
    await sendNotification({
      title: `⚠️ Budget Alert — ${alert.categoryName}`,
      body: `You've used ${pct}% of your ${alert.categoryName} budget. Spent: ${alert.spent.toFixed(2)} / ${alert.limit.toFixed(2)}.`,
    });
  }
}

/**
 * Notify the user when a recurring transaction was auto-processed.
 */
export async function notifyRecurringProcessed(items: RecurringAlert[]): Promise<void> {
  if (items.length === 0) return;

  if (items.length === 1) {
    const { note, amount, currency } = items[0];
    await sendNotification({
      title: '🔁 Recurring Transaction',
      body: `"${note}" was processed: ${new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)}`,
    });
  } else {
    await sendNotification({
      title: `🔁 ${items.length} Recurring Transactions`,
      body: `${items.map(i => i.note).join(', ')} were automatically processed.`,
    });
  }
}

/**
 * Welcome notification on first launch.
 */
export async function sendWelcomeNotification(userName: string): Promise<void> {
  await sendNotification({
    title: `👋 Welcome to KAI, ${userName}!`,
    body: 'Your finance tracker is ready. Add your first transaction to get started.',
  });
}

/**
 * Daily savings tip (shown once per day).
 */
const TIPS = [
  'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
  'Review your subscriptions — cancel what you don\'t use.',
  'Set a savings goal this week and track it in KAI.',
  'Small daily expenses add up — check your spending trends.',
  'Aim to save at least 3 months of expenses as an emergency fund.',
];

export async function sendDailyTip(): Promise<void> {
  const lastTipDate = localStorage.getItem('kai-last-tip-date');
  const today = new Date().toDateString();
  if (lastTipDate === today) return; // already shown today
  localStorage.setItem('kai-last-tip-date', today);
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  await sendNotification({ title: '💡 Daily Money Tip', body: tip });
}

// ── Transaction Reminder ──────────────────────────────────────────────────────

const REMINDER_TIME_KEY = 'kai-reminder-time';      // e.g. "20:00"
const REMINDER_TIMER_KEY = 'kai-reminder-timer-id'; // setTimeout id (as string)

const REMINDER_MESSAGES = [
  "Don't forget to log today's expenses in KAI! 💸",
  "Quick check — did you record all your transactions today? 📋",
  "Keep your finances accurate — log today's spending now! ✅",
  "Your money tracker is waiting! Add today's transactions. 💰",
  "Stay on top of your budget — log any new expenses today. 📊",
];

export function getReminderTime(): string | null {
  return localStorage.getItem(REMINDER_TIME_KEY);
}

export function setReminderTime(time: string | null): void {
  // Clear any existing scheduled reminder
  const existingId = localStorage.getItem(REMINDER_TIMER_KEY);
  if (existingId) clearTimeout(Number(existingId));
  localStorage.removeItem(REMINDER_TIMER_KEY);

  if (!time) {
    localStorage.removeItem(REMINDER_TIME_KEY);
    return;
  }

  localStorage.setItem(REMINDER_TIME_KEY, time);
  scheduleNextReminder(time);
}

function scheduleNextReminder(time: string): void {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(hours, minutes, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (next <= now) next.setDate(next.getDate() + 1);

  const msUntil = next.getTime() - now.getTime();

  const id = window.setTimeout(async () => {
    const msg = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
    await sendNotification({
      title: '📝 Log Your Transactions',
      body: msg,
    });
    // Reschedule for the next day
    scheduleNextReminder(time);
  }, msUntil);

  localStorage.setItem(REMINDER_TIMER_KEY, String(id));
}

/**
 * Call this on app load to re-arm the reminder if one was previously set.
 */
export function restoreReminder(): void {
  const time = getReminderTime();
  if (time) scheduleNextReminder(time);
}
