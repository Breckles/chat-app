export interface ChatMessage {
  value: string;
  author: string;

  /** When creating a chatmessage, a placeholder object is assigned to
   * timestamp. This will cause firebase to inject a numbervalue during the
   * write operation. When the record is retrieved, timestamp will be a number
   * value (number of milliseconds since Jan. 1, 1970) */
  timeStamp: Object | number;
}
