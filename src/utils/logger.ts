class Logger {
  private isJsonLike(value: any): boolean {
    return (
      value !== null &&
      typeof value === "object" &&
      (Array.isArray(value) || value.constructor === Object)
    );
  }

  private formatValue(value: any): string {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return String(value);

    // Smart JSON detection and pretty printing
    if (this.isJsonLike(value)) {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }

    return String(value);
  }

  log(message: any, ...args: any[]) {
    if (!__DEV__) return;

    const formattedMessage = this.formatValue(message);
    const formattedArgs = args.map((arg) => this.formatValue(arg));

    console.log(formattedMessage, ...formattedArgs);
  }

  warn(message: any, ...args: any[]) {
    const formattedMessage = this.formatValue(message);
    const formattedArgs = args.map((arg) => this.formatValue(arg));

    console.warn(formattedMessage, ...formattedArgs);
  }

  error(message: any, ...args: any[]) {
    const formattedMessage = this.formatValue(message);
    const formattedArgs = args.map((arg) => this.formatValue(arg));

    console.error(formattedMessage, ...formattedArgs);
  }
}

export const logger = new Logger();

// Example usage:
/*
import { logger } from '@/utils/logger';

// Basic logging with smart JSON detection
logger.log('Simple message');
logger.log('User data:', { id: 1, name: 'John', preferences: { theme: 'dark' } });
logger.log('API Response:', apiResponse);

// Warning and error logging
logger.warn('Deprecated API used', { endpoint: '/old-api' });
logger.error('Request failed:', error);

// Objects and arrays are automatically pretty-printed
logger.log({ 
  user: { id: 1, name: 'John' }, 
  posts: [1, 2, 3],
  metadata: { created: new Date() }
});
*/
