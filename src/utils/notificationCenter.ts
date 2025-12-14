export type NotificationPayload = {
  type:
    | 'achievement'
    | 'score_milestone'
    | 'room_discovery'
    | 'puzzle_solved'
    | 'relationship_improved'
    | 'level_up'
    | 'item_collected';
  title: string;
  description: string;
  points?: number;
  duration?: number;
};

export function showNotification(payload: NotificationPayload) {
  const event = new CustomEvent('gorstan-notification', { detail: payload });
  window.dispatchEvent(event);
}

export default showNotification;
