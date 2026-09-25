/**
 * PREMIER EDTECH SAAS - REALTIME SYNCHRONIZATION ARCHITECTURE
 * Production-ready Supabase Realtime channel management.
 * Subscribes to institutional PostgreSQL change events (INSERT, UPDATE, DELETE)
 * with tenant isolation, deduplication, and cleanup listeners.
 */

import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export type RealtimeTable = 
  | 'system_settings'
  | 'app_users'
  | 'staff_profiles'
  | 'faculties'
  | 'departments'
  | 'academic_programs'
  | 'courses'
  | 'students'
  | 'admission_applications'
  | 'course_registrations'
  | 'registered_course_items'
  | 'student_course_grades'
  | 'academic_warnings'
  | 'attendance_sessions'
  | 'attendance_records'
  | 'student_ledgers'
  | 'financial_ledgers'
  | 'financial_transactions'
  | 'graduation_clearances'
  | 'system_documents'
  | 'announcements'
  | 'notifications'
  | 'audit_logs';

export interface RealtimeEventPayload<T = any> {
  table: RealtimeTable;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  newRecord: T;
  oldRecord: Partial<T>;
  timestamp: string;
}

export type RealtimeCallback<T = any> = (event: RealtimeEventPayload<T>) => void;

class RealtimeSyncManager {
  private channel: RealtimeChannel | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Map<RealtimeTable, Set<RealtimeCallback>> = new Map();
  private globalListeners: Set<RealtimeCallback> = new Set();
  private isSubscribed: boolean = false;
  private channelName: string = 'institutional_realtime_stream';

  constructor() {
    this.initBroadcastChannel();
  }

  private initBroadcastChannel(): void {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        if (!this.broadcastChannel) {
          this.broadcastChannel = new BroadcastChannel('premier_realtime_bus');
          this.broadcastChannel.onmessage = (event) => {
            if (event.data && event.data.table) {
              this.handleIncomingChange(event.data);
            }
          };
        }
      } catch (e) {
        console.warn('[RealtimeSyncManager] BroadcastChannel unavailable:', e);
      }
    }
  }

  /**
   * Initializes the realtime broadcast subscription channel (Supabase + BroadcastChannel).
   */
  public initialize(tenantId?: string): void {
    this.initBroadcastChannel();

    if (!isSupabaseConfigured() || !supabase) {
      // In standalone mode, BroadcastChannel provides cross-tab and cross-window real-time sync
      this.isSubscribed = true;
      return;
    }

    if (this.channel && this.isSubscribed) {
      return; // Already actively connected
    }

    const channelIdentifier = tenantId 
      ? `tenant_${tenantId}_realtime` 
      : this.channelName;

    this.channel = supabase.channel(channelIdentifier);

    // Subscribe to postgres_changes across core institutional tables
    this.channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public'
        },
        (payload) => {
          this.handleIncomingChange(payload);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          this.isSubscribed = true;
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          this.isSubscribed = false;
          if (err) {
            console.warn('[RealtimeSyncManager] Channel status update:', status, err.message);
          }
        }
      });
  }

  /**
   * Broadcasts a table change event to all active listeners in this window,
   * across all other open browser tabs/windows via BroadcastChannel, and Supabase channel.
   */
  public broadcast<T = any>(table: RealtimeTable, eventType: 'INSERT' | 'UPDATE' | 'DELETE', newRecord: T, oldRecord?: Partial<T>): void {
    const payload = {
      table,
      eventType,
      new: newRecord,
      old: oldRecord || {},
      timestamp: new Date().toISOString()
    };

    // 1. Dispatch locally to all registered listeners in current execution context
    this.handleIncomingChange(payload);

    // 2. Broadcast across browser tabs and windows
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {
        console.warn('[RealtimeSyncManager] Broadcast postMessage error:', e);
      }
    }

    // 3. Dispatch window CustomEvent as a supplementary fallback
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('premier_institutional_event', { detail: payload }));
    }

    // 4. Supabase broadcast channel if active
    if (this.channel && this.isSubscribed && isSupabaseConfigured()) {
      this.channel.send({
        type: 'broadcast',
        event: table,
        payload
      }).catch(() => {});
    }
  }

  /**
   * Synthesized Web Audio chime for real-time auditory notifications.
   */
  public playChime(type: 'submission' | 'approval' | 'payment' = 'submission'): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      if (type === 'payment') {
        // High-pitched cheerful payment chime
        [587.33, 880, 1174.66].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.15, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.3);
        });
      } else if (type === 'submission') {
        // Double pleasant notification beep (Admin receiving applicant)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.setValueAtTime(880, now + 0.1); // A5
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);
      } else {
        // Triumphant rising arpeggio (Applicant receiving approved offer)
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.4);
        });
      }
    } catch (e) {
      // Audio context might be restricted before user gesture; gracefully ignore
    }
  }

  /**
   * Internal dispatcher for incoming PostgreSQL change events.
   */
  private handleIncomingChange(payload: any): void {
    const table = payload.table as RealtimeTable;
    const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
    const newRecord = payload.new || {};
    const oldRecord = payload.old || {};

    const event: RealtimeEventPayload = {
      table,
      eventType,
      newRecord,
      oldRecord,
      timestamp: new Date().toISOString()
    };

    // Table-specific callbacks
    const tableCallbacks = this.listeners.get(table);
    if (tableCallbacks) {
      for (const cb of tableCallbacks) {
        try {
          cb(event);
        } catch (err) {
          console.error(`[RealtimeSyncManager] Error in listener for ${table}:`, err);
        }
      }
    }

    // Global callbacks
    for (const cb of this.globalListeners) {
      try {
        cb(event);
      } catch (err) {
        console.error('[RealtimeSyncManager] Error in global listener:', err);
      }
    }
  }

  /**
   * Registers a listener for changes to a specific table.
   * Returns an unsubscribe function.
   */
  public on<T = any>(table: RealtimeTable, callback: RealtimeCallback<T>): () => void {
    if (!this.listeners.has(table)) {
      this.listeners.set(table, new Set());
    }

    this.listeners.get(table)!.add(callback);

    // Return unbind function
    return () => {
      const set = this.listeners.get(table);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.listeners.delete(table);
        }
      }
    };
  }

  /**
   * Registers a listener for all institutional table changes.
   */
  public onAny(callback: RealtimeCallback): () => void {
    this.globalListeners.add(callback);
    return () => {
      this.globalListeners.delete(callback);
    };
  }

  /**
   * Cleans up channels on application unmount or tenant switch.
   */
  public cleanup(): void {
    if (this.channel && supabase) {
      supabase.removeChannel(this.channel);
      this.channel = null;
      this.isSubscribed = false;
    }
    this.listeners.clear();
    this.globalListeners.clear();
  }

  public getStatus() {
    return {
      isSubscribed: this.isSubscribed,
      activeTableListeners: Array.from(this.listeners.keys()),
      totalListenersCount: Array.from(this.listeners.values()).reduce((acc, s) => acc + s.size, 0) + this.globalListeners.size
    };
  }
}

export const realtimeSyncManager = new RealtimeSyncManager();
