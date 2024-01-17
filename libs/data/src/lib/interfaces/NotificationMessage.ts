import { NotificationType } from "../enums/NotificationType";

export interface NotificationMessage {
  message?: string;
  type: NotificationType;
  title: string;
  icon: string;
}
