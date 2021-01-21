export interface ServerPlaceholder {
  '.sv': string;
}

export class ServerPlaceholders {
  /**
   * Returns a placeholder for a timestamp. When used as a value during a write
   * operation, firebase will convert this to a number representing the
   * milliseconds since January 1, 1970
   */
  static TIMESTAMP(): ServerPlaceholder {
    return {
      '.sv': 'timestamp',
    };
  }
}
