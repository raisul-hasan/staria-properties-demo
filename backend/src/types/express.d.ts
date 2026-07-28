declare global {
  namespace Express {
    interface UserContext {
      id: string;
      email: string;
      sessionId: string;
      roles: string[];
      permissions: string[];
    }

    interface Request {
      user?: UserContext;
      requestId?: string;
    }
  }
}

export {};
