export type EventType =
  | 'view_property'
  | 'like_property'
  | 'save_property'
  | 'share_property'
  | 'click_ripple'
  | 'contact_seller'
  | 'start_transaction'
  | 'complete_transaction';

export interface Event {
  id: string;
  userId?: string;
  sessionId: string;
  type: EventType;
  entityId: string;
  entityType: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}
