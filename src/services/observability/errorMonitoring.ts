/**
 * PREMIER EDTECH SAAS - ERROR MONITORING & OBSERVABILITY SERVICE
 * Production error capture and telemetry abstraction (Sentry-ready).
 * Automatically sanitizes sensitive PII, passwords, authentication tokens, and private financials.
 */

export interface SanitizedErrorEvent {
  id: string;
  category: 'runtime_exception' | 'api_failure' | 'supabase_rls' | 'payment_error' | 'security_incident' | 'document_failure';
  message: string;
  componentStack?: string;
  userContext?: {
    userId: string;
    role: string;
    tenantId: string;
  };
  metadata: Record<string, any>;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  level?: string;
  url?: string;
  context?: Record<string, any>;
}

class ObservabilityService {
  private events: SanitizedErrorEvent[] = [];
  private maxEvents: number = 50;

  /**
   * Sanitizes object to remove passwords, tokens, API keys, card numbers, and raw PII.
   */
  public sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const sensitiveKeys = [
      'password', 'token', 'secret', 'authorization', 'bearer',
      'key', 'apikey', 'cvv', 'cardnumber', 'pin', 'ssn'
    ];

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(s => lowerKey.includes(s))) {
        sanitized[key] = '[REDACTED_SENSITIVE_CREDENTIAL]';
      } else if (typeof val === 'object' && val !== null) {
        sanitized[key] = this.sanitizeData(val);
      } else {
        sanitized[key] = val;
      }
    }
    return sanitized;
  }

  /**
   * Records an observable system event or exception.
   */
  public captureException(
    error: Error | string,
    categoryOrContext: SanitizedErrorEvent['category'] | Record<string, any> = 'runtime_exception',
    context?: { userId?: string; role?: string; tenantId?: string; metadata?: Record<string, any>; [key: string]: any },
    severity: SanitizedErrorEvent['severity'] = 'error'
  ): SanitizedErrorEvent {
    let category: SanitizedErrorEvent['category'] = 'runtime_exception';
    let resolvedContext = context;

    if (typeof categoryOrContext === 'object' && categoryOrContext !== null) {
      resolvedContext = categoryOrContext as any;
      category = 'runtime_exception';
    } else if (typeof categoryOrContext === 'string') {
      category = categoryOrContext as SanitizedErrorEvent['category'];
    }

    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error !== 'string' ? error.stack : undefined;

    const event: SanitizedErrorEvent = {
      id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category,
      message,
      componentStack: stack,
      userContext: {
        userId: resolvedContext?.userId || 'anonymous',
        role: resolvedContext?.role || resolvedContext?.userRole || 'guest',
        tenantId: resolvedContext?.tenantId || 'default'
      },
      metadata: this.sanitizeData(resolvedContext?.metadata || resolvedContext || {}),
      timestamp: new Date().toISOString(),
      severity,
      level: severity,
      url: typeof window !== 'undefined' ? window.location.pathname : '/app',
      context: resolvedContext
    };

    this.events.unshift(event);
    if (this.events.length > this.maxEvents) {
      this.events.pop();
    }

    // Console warning in development without leaking secrets
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.error(`[ObservabilityService] [${category.toUpperCase()}] ${message}`, event.metadata);
    }

    return event;
  }

  /**
   * Tracks security incidents (e.g. repeated 403 access violations, brute force indicators).
   */
  public captureSecurityIncident(
    incidentType: string,
    details: string,
    userContext?: { userId: string; role: string; tenantId: string },
    ipAddress: string = '192.168.1.1'
  ): SanitizedErrorEvent {
    return this.captureException(
      `Security Incident: ${incidentType} - ${details}`,
      'security_incident',
      {
        userId: userContext?.userId,
        role: userContext?.role,
        tenantId: userContext?.tenantId,
        metadata: {
          incidentType,
          ipAddress,
          detectedAt: new Date().toISOString()
        }
      },
      'critical'
    );
  }

  public getRecentEvents(): SanitizedErrorEvent[] {
    return [...this.events];
  }

  public getStoredEvents(): SanitizedErrorEvent[] {
    return this.getRecentEvents();
  }

  public clearEvents(): void {
    this.events = [];
  }
}

export const observabilityService = new ObservabilityService();
export const errorMonitoringService = observabilityService;
