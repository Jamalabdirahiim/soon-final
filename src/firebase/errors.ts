export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const message = `FirestoreError: Missing or insufficient permissions. The following request was denied by Firestore Security Rules: \n${JSON.stringify(
      {
        operation: context.operation,
        path: context.path,
        ...(context.requestResourceData && {
          requestData: context.requestResourceData,
        }),
      },
      null,
      2
    )}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }

  toContextObject() {
    return {
      operation: this.context.operation,
      path: this.context.path,
      ...(this.context.requestResourceData && {
        requestData: this.context.requestData,
      }),
    };
  }
}
