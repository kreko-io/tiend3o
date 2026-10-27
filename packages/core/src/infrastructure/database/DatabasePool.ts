import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const DEFAULT_DEV_DATABASE_URL = "postgres://tiend3o:tiend3o_secret@localhost:5433/tiend3o_db";

export interface DatabaseHealth {
  connected: boolean;
  latencyMs: number;
  database?: string;
  activeConnections?: number;
  error?: string;
}

export class DatabasePool {
  private static instance: DatabasePool | null = null;
  private pool: pg.Pool | null = null;
  private readonly connectionString: string | undefined;

  constructor(connectionString?: string) {
    this.connectionString = connectionString || process.env.DATABASE_URL || DEFAULT_DEV_DATABASE_URL;
  }

  public static getInstance(connectionString?: string): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool(connectionString);
    }
    return DatabasePool.instance;
  }

  public static resetInstance(): void {
    if (DatabasePool.instance) {
      DatabasePool.instance.close().catch(() => {});
      DatabasePool.instance = null;
    }
  }

  public getPool(): pg.Pool {
    if (!this.pool) {
      const connStr = this.connectionString || process.env.DATABASE_URL || DEFAULT_DEV_DATABASE_URL;

      this.pool = new Pool({
        connectionString: connStr,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      this.pool.on("error", (err) => {
        console.error("Unexpected error on idle PostgreSQL client:", err);
      });
    }

    return this.pool;
  }

  public async query<R extends pg.QueryResultRow = pg.QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<pg.QueryResult<R>> {
    const pool = this.getPool();
    return pool.query<R>(text, params);
  }

  public async checkHealth(): Promise<DatabaseHealth> {
    const start = Date.now();
    try {
      const pool = this.getPool();
      const res = await pool.query("SELECT current_database() as db, count(*) as count FROM pg_stat_activity WHERE state = 'active'");
      const latencyMs = Date.now() - start;
      const db = res.rows[0]?.db as string | undefined;
      const activeConnections = Number(res.rows[0]?.count || 1);

      return {
        connected: true,
        latencyMs,
        database: db,
        activeConnections,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown database error";
      return {
        connected: false,
        latencyMs: Date.now() - start,
        error: message,
      };
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}
