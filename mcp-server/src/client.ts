import net from 'node:net';

/**
 * Pixera JSON-RPC client over TCP.
 *
 * Modes (must match the API port mode configured in Pixera > Settings > API):
 *   'tcp' - "JSON/TCP":      every message is  "pxr1" + uint32LE(byteLength) + UTF-8 JSON
 *   'dl'  - "JSON/TCP (dl)": every message is  UTF-8 JSON + "0xPX"
 *
 * Requests always carry an id; Pixera replies (also for `null` returns) with the
 * same id. Messages with type === 'monEvent' are monitoring events and are buffered.
 */

export type PixeraMode = 'tcp' | 'dl';

export interface PixeraConfig {
  host: string;
  port: number;
  mode: PixeraMode;
  timeoutMs: number;
}

export class PixeraRpcError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'PixeraRpcError';
  }
}

interface Pending {
  method: string;
  resolve: (v: unknown) => void;
  reject: (e: Error) => void;
  timer: NodeJS.Timeout;
}

const TAG = Buffer.from('pxr1', 'ascii');
const DELIM = Buffer.from('0xPX', 'ascii');
const MAX_EVENTS = 2000;

export function configFromEnv(env: NodeJS.ProcessEnv = process.env): PixeraConfig {
  const mode = (env.PIXERA_MODE ?? 'tcp').toLowerCase();
  if (mode !== 'tcp' && mode !== 'dl') {
    throw new Error(`PIXERA_MODE must be 'tcp' (JSON/TCP) or 'dl' (JSON/TCP (dl)), got '${env.PIXERA_MODE}'`);
  }
  return {
    host: env.PIXERA_HOST ?? '127.0.0.1',
    port: Number(env.PIXERA_PORT ?? 1400),
    mode,
    timeoutMs: Number(env.PIXERA_TIMEOUT_MS ?? 5000),
  };
}

export function encodeMessage(json: string, mode: PixeraMode): Buffer {
  const payload = Buffer.from(json, 'utf8');
  if (mode === 'dl') return Buffer.concat([payload, DELIM]);
  const size = Buffer.alloc(4);
  size.writeUInt32LE(payload.length, 0);
  return Buffer.concat([TAG, size, payload]);
}

/**
 * Incremental decoder. Accepts both framings so a reply in either format is
 * understood regardless of the configured send mode.
 */
export class FrameDecoder {
  private buf: Buffer = Buffer.alloc(0);

  push(chunk: Buffer): string[] {
    this.buf = this.buf.length ? Buffer.concat([this.buf, chunk]) : chunk;
    const out: string[] = [];
    for (;;) {
      if (this.buf.length === 0) break;
      // Skip whitespace between frames.
      if (this.buf[0] === 0x0a || this.buf[0] === 0x0d || this.buf[0] === 0x20) {
        this.buf = this.buf.subarray(1);
        continue;
      }
      if (this.buf.length >= 4 && this.buf.subarray(0, 4).equals(TAG)) {
        if (this.buf.length < 8) break;
        const size = this.buf.readUInt32LE(4);
        if (this.buf.length < 8 + size) break;
        out.push(this.buf.subarray(8, 8 + size).toString('utf8'));
        this.buf = this.buf.subarray(8 + size);
        continue;
      }
      if (this.buf.length < 4 && TAG.subarray(0, this.buf.length).equals(this.buf)) break; // partial tag
      const idx = this.buf.indexOf(DELIM);
      if (idx < 0) break;
      out.push(this.buf.subarray(0, idx).toString('utf8'));
      this.buf = this.buf.subarray(idx + DELIM.length);
    }
    return out;
  }

  reset() {
    this.buf = Buffer.alloc(0);
  }
}

export class PixeraClient {
  private socket: net.Socket | null = null;
  private connecting: Promise<net.Socket> | null = null;
  private decoder = new FrameDecoder();
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private events: unknown[] = [];
  private lastError: string | null = null;

  constructor(private cfg: PixeraConfig) {}

  get config(): Readonly<PixeraConfig> {
    return this.cfg;
  }

  status() {
    return {
      ...this.cfg,
      connected: !!this.socket && !this.socket.destroyed,
      pendingRequests: this.pending.size,
      bufferedEvents: this.events.length,
      lastError: this.lastError,
    };
  }

  /** Change connection settings; drops the current connection. */
  reconfigure(patch: Partial<PixeraConfig>) {
    this.cfg = { ...this.cfg, ...patch };
    this.disconnect();
  }

  disconnect() {
    const s = this.socket;
    this.socket = null;
    this.connecting = null;
    if (s) s.destroy();
    this.failAll(new Error('Disconnected from Pixera'));
    this.decoder.reset();
  }

  /** Drain buffered monitoring events (type === 'monEvent'). */
  takeEvents(max = MAX_EVENTS): unknown[] {
    return this.events.splice(0, max);
  }

  async connect(): Promise<net.Socket> {
    if (this.socket && !this.socket.destroyed) return this.socket;
    if (this.connecting) return this.connecting;
    const { host, port, timeoutMs } = this.cfg;
    this.connecting = new Promise<net.Socket>((resolve, reject) => {
      const s = net.createConnection({ host, port });
      s.setNoDelay(true);
      const timer = setTimeout(() => {
        s.destroy();
        reject(new Error(`Timed out connecting to Pixera at ${host}:${port}`));
      }, timeoutMs);
      s.once('connect', () => {
        clearTimeout(timer);
        this.socket = s;
        this.lastError = null;
        resolve(s);
      });
      s.on('data', (chunk) => this.onData(chunk));
      s.on('error', (err) => {
        clearTimeout(timer);
        this.lastError = err.message;
        reject(
          new Error(
            `Cannot reach Pixera at ${host}:${port} (${err.message}). ` +
              `Check that Pixera is running and an API port is set to ${
                this.cfg.mode === 'dl' ? "'JSON/TCP (dl)'" : "'JSON/TCP'"
              } on this port.`,
          ),
        );
      });
      s.on('close', () => {
        if (this.socket === s) {
          this.socket = null;
          this.decoder.reset();
          this.failAll(new Error('Connection to Pixera closed'));
        }
      });
    }).finally(() => {
      this.connecting = null;
    });
    return this.connecting;
  }

  /** Invoke a Pixera API method, e.g. call('Pixera.Timelines.getTimelines'). */
  async call(method: string, params?: Record<string, unknown>): Promise<unknown> {
    const socket = await this.connect();
    const id = this.nextId++;
    if (this.nextId > 2_000_000_000) this.nextId = 1;
    const msg: Record<string, unknown> = { jsonrpc: '2.0', id, method };
    if (params && Object.keys(params).length) msg.params = params;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Pixera did not answer '${method}' within ${this.cfg.timeoutMs} ms`));
      }, this.cfg.timeoutMs);
      this.pending.set(id, { method, resolve, reject, timer });
      socket.write(encodeMessage(JSON.stringify(msg), this.cfg.mode), (err) => {
        if (err) {
          clearTimeout(timer);
          this.pending.delete(id);
          reject(err);
        }
      });
    });
  }

  private onData(chunk: Buffer) {
    for (const text of this.decoder.push(chunk)) {
      let msg: any;
      try {
        msg = JSON.parse(text);
      } catch {
        this.lastError = `Unparseable message from Pixera: ${text.slice(0, 200)}`;
        continue;
      }
      if (msg && msg.type === 'monEvent') {
        this.events.push(msg);
        if (this.events.length > MAX_EVENTS) this.events.splice(0, this.events.length - MAX_EVENTS);
        continue;
      }
      const p = typeof msg?.id === 'number' ? this.pending.get(msg.id) : undefined;
      if (!p) continue;
      this.pending.delete(msg.id);
      clearTimeout(p.timer);
      if (msg.error) {
        const e = msg.error;
        p.reject(new PixeraRpcError(typeof e === 'string' ? e : e.message ?? JSON.stringify(e), e.code, e.data));
      } else {
        p.resolve(msg.result ?? null);
      }
    }
  }

  private failAll(err: Error) {
    for (const [id, p] of this.pending) {
      clearTimeout(p.timer);
      p.reject(err);
      this.pending.delete(id);
    }
  }
}
