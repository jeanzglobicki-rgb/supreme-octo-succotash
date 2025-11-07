// src/firebase/errors.ts
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;
  public originalError?: Error;

  constructor(context: SecurityRuleContext, originalError?: Error) {
    const message = `Firestore Permission Denied: Cannot ${context.operation} on path '${context.path}'.`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    this.originalError = originalError;

    // This is to make the error message more readable in the console.
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }

  toFriendlyString(): string {
    let str = `PERMISSION_DENIED for operation '${this.context.operation}' on path '${this.context.path}'.`;
    if (this.context.requestResourceData) {
      try {
        str += `\nRequest data: ${JSON.stringify(
          this.context.requestResourceData,
          null,
          2
        )}`;
      } catch (e) {
        str += `\nRequest data: [Could not serialize]`;
      }
    }
    return str;
  }
}
