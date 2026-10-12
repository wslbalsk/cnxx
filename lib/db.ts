import sql from 'mssql';

// Configuration from environment variables
const dbConfig: sql.config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASS || '',
  server: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_NAME || 'MuOnline',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT !== 'false',
    connectTimeout: 4000,
    requestTimeout: 8000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Mock data must be explicitly enabled for local development; never enable it by default online.
const mockDbEnabled = process.env.NODE_ENV !== 'production' && process.env.DB_ALLOW_MOCK === 'true';
const retryDelayMs = 15000;

const dbSchema = {
  accountTable: process.env.DB_ACCOUNT_TABLE || 'MEMB_INFO',
  characterTable: process.env.DB_CHARACTER_TABLE || 'Character',
  guildTable: process.env.DB_GUILD_TABLE || 'Guild',
  guildMemberTable: process.env.DB_GUILD_MEMBER_TABLE || 'GuildMember',
  onlineTable: process.env.DB_ONLINE_TABLE || 'MEMB_STAT',
  onlineStatusColumn: process.env.DB_ONLINE_STATUS_COLUMN || 'ConnectStat',
  onlineStatusValue: process.env.DB_ONLINE_STATUS_VALUE || '1',
  characterGuildColumn: process.env.DB_CHARACTER_GUILD_COLUMN || 'Guild',
  guildMemberCharacterColumn: process.env.DB_GUILD_MEMBER_CHARACTER_COLUMN || 'Name',
  guildMemberGuildColumn: process.env.DB_GUILD_MEMBER_GUILD_COLUMN || 'G_Name',
  masterLevelColumn: process.env.DB_MASTER_LEVEL_COLUMN || 'MasterLevel',
  siegeTable: process.env.DB_SIEGE_TABLE || 'MuCastle_DATA',
  siegeOwnerColumn: process.env.DB_SIEGE_OWNER_COLUMN || 'OWNER_GUILD',
};

function quoteIdentifierPath(identifier: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_.]*$/.test(identifier)) {
    throw new Error(`Identificador SQL inválido: ${identifier}`);
  }

  return identifier
    .split('.')
    .map((part) => `[${part}]`)
    .join('.');
}

function getMockStore(): MockStore {
  if (!mockDbEnabled) {
    throw new Error('SQL Server indisponível e fallback mock desativado. Configure as variáveis DB_* no ambiente.');
  }

  return global.__mockDbStore!;
}

// Global pool cache across hot reloads in Next.js development
declare global {
  var __mssqlPool: sql.ConnectionPool | undefined;
  var __mssqlAvailable: boolean | undefined;
  var __mssqlRetryAt: number | undefined;
  var __mockDbStore: MockStore | undefined;
}

// In-Memory store fallback for immediate preview / dev when real MSSQL instance is not attached
interface MockStore {
  accounts: Array<{
    memb___id: string;
    memb__passwd: string;
    mail_addr: string;
    bloc_code: string;
    appl_days?: string;
  }>;
  characters: Array<{
    AccountID: string;
    Name: string;
    cLevel: number;
    ResetCount: number;
    m_GrandReset: number;
    Class: number;
    Money: number;
    Strength: number;
    Dexterity: number;
    Vitality: number;
    Energy: number;
    Leadership: number;
    PkCount: number;
    PkLevel: number;
    MapNumber: number;
    MapPosX: number;
    MapPosY: number;
    GuildName?: string;
  }>;
  shopPoints: Map<string, { WCoinC: number; WCoinP: number; GoblinPoint: number }>;
  transactions: Array<{
    id: number;
    memb___id: string;
    payment_id: string;
    amount_brl: number;
    wcoin_added: number;
    status: 'pending' | 'approved' | 'cancelled';
    created_at: string;
  }>;
}

function getInitialMockStore(): MockStore {
  return {
    accounts: [
      {
        memb___id: 'admin',
        memb__passwd: 'admin123',
        mail_addr: 'admin@muonline-s6.com',
        bloc_code: '0',
      },
      {
        memb___id: 'conqueror',
        memb__passwd: 'mu123456',
        mail_addr: 'player1@gmail.com',
        bloc_code: '0',
      },
      {
        memb___id: 'valkyrie',
        memb__passwd: 'mu123456',
        mail_addr: 'player2@gmail.com',
        bloc_code: '0',
      },
    ],
    characters: [
      {
        AccountID: 'conqueror',
        Name: 'LordKael',
        cLevel: 400,
        ResetCount: 98,
        m_GrandReset: 14,
        Class: 18, // Blade Master
        Money: 1850000000,
        Strength: 1800,
        Dexterity: 1200,
        Vitality: 1500,
        Energy: 400,
        Leadership: 0,
        PkCount: 0,
        PkLevel: 3,
        MapNumber: 0, // Lorencia
        MapPosX: 125,
        MapPosY: 125,
        GuildName: 'Valhalla',
      },
      {
        AccountID: 'valkyrie',
        Name: 'ArchmageNyx',
        cLevel: 400,
        ResetCount: 95,
        m_GrandReset: 12,
        Class: 2, // Grand Master
        Money: 950000000,
        Strength: 450,
        Dexterity: 800,
        Vitality: 900,
        Energy: 2400,
        Leadership: 0,
        PkCount: 0,
        PkLevel: 3,
        MapNumber: 2, // Devias
        MapPosX: 215,
        MapPosY: 45,
        GuildName: 'Valhalla',
      },
      {
        AccountID: 'admin',
        Name: 'HighQueenSylv',
        cLevel: 395,
        ResetCount: 91,
        m_GrandReset: 10,
        Class: 34, // High Elf
        Money: 450000000,
        Strength: 350,
        Dexterity: 2200,
        Vitality: 800,
        Energy: 1200,
        Leadership: 0,
        PkCount: 0,
        PkLevel: 3,
        MapNumber: 3, // Noria
        MapPosX: 172,
        MapPosY: 104,
        GuildName: 'Imperium',
      },
      {
        AccountID: 'conqueror',
        Name: 'DarthVader',
        cLevel: 400,
        ResetCount: 88,
        m_GrandReset: 9,
        Class: 66, // Lord Emperor
        Money: 620000000,
        Strength: 1400,
        Dexterity: 900,
        Vitality: 1100,
        Energy: 1200,
        Leadership: 1600,
        PkCount: 2,
        PkLevel: 4,
        MapNumber: 30, // Valley of Loren
        MapPosX: 140,
        MapPosY: 100,
        GuildName: 'Valhalla',
      },
      {
        AccountID: 'valkyrie',
        Name: 'BloodOmen',
        cLevel: 388,
        ResetCount: 84,
        m_GrandReset: 8,
        Class: 50, // Duel Master
        Money: 330000000,
        Strength: 1600,
        Dexterity: 1000,
        Vitality: 900,
        Energy: 1800,
        Leadership: 0,
        PkCount: 5,
        PkLevel: 5,
        MapNumber: 37, // Kanturu
        MapPosX: 140,
        MapPosY: 180,
        GuildName: 'Imperium',
      },
      {
        AccountID: 'admin',
        Name: 'DimensionWitch',
        cLevel: 380,
        ResetCount: 79,
        m_GrandReset: 7,
        Class: 82, // Dimension Master
        Money: 210000000,
        Strength: 300,
        Dexterity: 800,
        Vitality: 700,
        Energy: 2300,
        Leadership: 0,
        PkCount: 0,
        PkLevel: 3,
        MapNumber: 8, // Tarkan
        MapPosX: 150,
        MapPosY: 80,
        GuildName: 'DragonLords',
      },
    ],
    shopPoints: new Map([
      ['admin', { WCoinC: 50000, WCoinP: 10000, GoblinPoint: 25000 }],
      ['conqueror', { WCoinC: 7500, WCoinP: 1200, GoblinPoint: 3400 }],
      ['valkyrie', { WCoinC: 3200, WCoinP: 800, GoblinPoint: 1900 }],
    ]),
    transactions: [
      {
        id: 1,
        memb___id: 'conqueror',
        payment_id: 'pix_928172648',
        amount_brl: 50.0,
        wcoin_added: 6000,
        status: 'approved',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 2,
        memb___id: 'valkyrie',
        payment_id: 'pix_928172649',
        amount_brl: 25.0,
        wcoin_added: 2750,
        status: 'approved',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ],
  };
}

if (!global.__mockDbStore) {
  global.__mockDbStore = getInitialMockStore();
}

/**
 * Gets a singleton MSSQL connection pool.
 * Gracefully handles connection failures and returns null if MSSQL is unreachable.
 */
export async function getDbPool(): Promise<sql.ConnectionPool | null> {
  // Avoid hammering SQL Server while still retrying if it comes back online.
  if (global.__mssqlAvailable === false && (global.__mssqlRetryAt || 0) > Date.now()) {
    return null;
  }

  if (global.__mssqlPool && global.__mssqlPool.connected) {
    return global.__mssqlPool;
  }

  if (!process.env.DB_PASS && !process.env.DB_HOST) {
    global.__mssqlAvailable = false;
    global.__mssqlRetryAt = Date.now() + retryDelayMs;
    return null;
  }

  try {
    const pool = new sql.ConnectionPool(dbConfig);
    const connectedPool = await pool.connect();
    global.__mssqlPool = connectedPool;
    global.__mssqlAvailable = true;
    global.__mssqlRetryAt = undefined;
    console.log('[MSSQL] Conectado com sucesso ao Microsoft SQL Server (MuOnline)');
    return connectedPool;
  } catch (err) {
    global.__mssqlRetryAt = Date.now() + retryDelayMs;
    console.warn('[MSSQL] Conexão com SQL Server indisponível:', (err as Error).message);
    global.__mssqlAvailable = false;
    return null;
  }
}

/**
 * Executes a prepared query against MSSQL or falls back to Season 6 Mock Engine
 */
export async function executeQuery<T = any>(
  queryText: string,
  parameters: Record<string, { type: sql.ISqlType; value: any }> = {}
): Promise<T[]> {
  const pool = await getDbPool();
  if (pool) {
    try {
      const request = pool.request();
      for (const [key, param] of Object.entries(parameters)) {
        request.input(key, param.type, param.value);
      }
      const result = await request.query(queryText);
      return result.recordset as T[];
    } catch (err) {
      console.error('[MSSQL Query Error]:', err);
      throw err;
    }
  }

  return [];
}

// -------------------------------------------------------------
// HIGHER-LEVEL MU ONLINE SEASON 6 DATABASE REPOSITORY METHODS
// -------------------------------------------------------------

export interface MembInfoRow {
  memb___id: string;
  memb__passwd?: string;
  mail_addr: string;
  bloc_code: string;
  appl_days?: string;
}

export interface CharacterRow {
  AccountID?: string;
  Name: string;
  cLevel: number;
  ResetCount: number;
  m_GrandReset: number;
  Class: number;
  Money: number;
  Strength: number;
  Dexterity: number;
  Vitality: number;
  Energy: number;
  Leadership: number;
  PkCount: number;
  PkLevel: number;
  MapNumber: number;
  MapPosX: number;
  MapPosY: number;
  GuildName?: string;
}

export interface InGameShopRow {
  memb___id: string;
  WCoinC: number;
  WCoinP: number;
  GoblinPoint: number;
}

export interface RmtTransactionRow {
  id: number;
  memb___id: string;
  payment_id: string;
  amount_brl: number;
  wcoin_added: number;
  status: 'pending' | 'approved' | 'cancelled';
  created_at: string;
}

export const MuDatabase = {
  /**
   * Find account by memb___id (Prepared Statement)
   */
  async findAccount(username: string): Promise<MembInfoRow | null> {
    const pool = await getDbPool();
    if (pool) {
      try {
        const req = pool.request();
        req.input('memb___id', sql.VarChar(10), username);
        const result = await req.query<MembInfoRow>(`
          SELECT memb___id, memb__pwd AS memb__passwd, mail_addr, bloc_code, appl_days
          FROM MEMB_INFO
          WHERE memb___id = @memb___id
        `);
        return result.recordset[0] || null;
      } catch {
        // Retry with memb__passwd column variant if server uses that naming
        const req2 = pool.request();
        req2.input('memb___id', sql.VarChar(10), username);
        const result = await req2.query<MembInfoRow>(`
          SELECT memb___id, memb__passwd, mail_addr, bloc_code, appl_days
          FROM MEMB_INFO
          WHERE memb___id = @memb___id
        `);
        return result.recordset[0] || null;
      }
    }

    // Fallback Engine
    const store = getMockStore();
    const acc = store.accounts.find((a) => a.memb___id.toLowerCase() === username.toLowerCase());
    return acc ? { ...acc } : null;
  },

  /**
   * Create account in MEMB_INFO and initialize T_InGameShop_Point (Prepared Statement)
   */
  async createAccount(username: string, passwordHashOrPlain: string, email: string): Promise<boolean> {
    const pool = await getDbPool();
    if (pool) {
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      try {
        const req1 = new sql.Request(transaction);
        req1.input('memb___id', sql.VarChar(10), username);
        req1.input('memb__pwd', sql.VarChar(50), passwordHashOrPlain);
        req1.input('mail_addr', sql.VarChar(50), email);

        await req1.query(`
          INSERT INTO MEMB_INFO (memb___id, memb__pwd, mail_addr, bloc_code, ctl1_code)
          VALUES (@memb___id, @memb__pwd, @mail_addr, '0', '0')
        `);

        // Check if T_InGameShop_Point exists and insert default 0 points
        const req2 = new sql.Request(transaction);
        req2.input('memb___id', sql.VarChar(10), username);
        await req2.query(`
          IF NOT EXISTS (SELECT 1 FROM T_InGameShop_Point WHERE memb___id = @memb___id)
          BEGIN
            INSERT INTO T_InGameShop_Point (memb___id, WCoinC, WCoinP, GoblinPoint)
            VALUES (@memb___id, 0, 0, 0)
          END
        `);

        await transaction.commit();
        return true;
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    }

    // Fallback Engine
    const store = getMockStore();
    if (store.accounts.some((a) => a.memb___id.toLowerCase() === username.toLowerCase())) {
      throw new Error('Nome de usuário já existe no servidor.');
    }

    store.accounts.push({
      memb___id: username,
      memb__passwd: passwordHashOrPlain,
      mail_addr: email,
      bloc_code: '0',
    });

    store.shopPoints.set(username, {
      WCoinC: 100, // Welcome gift
      WCoinP: 0,
      GoblinPoint: 50,
    });

    // Create a starter character for the new player
    store.characters.push({
      AccountID: username,
      Name: `${username.slice(0, 7)}Hero`,
      cLevel: 1,
      ResetCount: 0,
      m_GrandReset: 0,
      Class: 16, // Dark Knight starter
      Money: 100000,
      Strength: 28,
      Dexterity: 20,
      Vitality: 25,
      Energy: 10,
      Leadership: 0,
      PkCount: 0,
      PkLevel: 3,
      MapNumber: 0, // Lorencia
      MapPosX: 125,
      MapPosY: 125,
    });

    return true;
  },

  /**
   * Change account password (Prepared Statement)
   */
  async updatePassword(username: string, newPassword: string): Promise<boolean> {
    const pool = await getDbPool();
    if (pool) {
      const req = pool.request();
      req.input('memb___id', sql.VarChar(10), username);
      req.input('new_pwd', sql.VarChar(50), newPassword);
      try {
        await req.query(`
          UPDATE MEMB_INFO
          SET memb__pwd = @new_pwd
          WHERE memb___id = @memb___id
        `);
        return true;
      } catch {
        const req2 = pool.request();
        req2.input('memb___id', sql.VarChar(10), username);
        req2.input('new_pwd', sql.VarChar(50), newPassword);
        await req2.query(`
          UPDATE MEMB_INFO
          SET memb__passwd = @new_pwd
          WHERE memb___id = @memb___id
        `);
        return true;
      }
    }

    const store = getMockStore();
    const acc = store.accounts.find((a) => a.memb___id.toLowerCase() === username.toLowerCase());
    if (acc) {
      acc.memb__passwd = newPassword;
      return true;
    }
    return false;
  },

  /**
   * Get WCoinC, WCoinP and GoblinPoint from T_InGameShop_Point
   */
  async getShopPoints(username: string): Promise<InGameShopRow> {
    const pool = await getDbPool();
    if (pool) {
      try {
        const req = pool.request();
        req.input('memb___id', sql.VarChar(10), username);
        const result = await req.query<InGameShopRow>(`
          SELECT memb___id, ISNULL(WCoinC, 0) AS WCoinC, ISNULL(WCoinP, 0) AS WCoinP, ISNULL(GoblinPoint, 0) AS GoblinPoint
          FROM T_InGameShop_Point
          WHERE memb___id = @memb___id
        `);
        if (result.recordset[0]) {
          return result.recordset[0];
        }
      } catch (err) {
        console.warn('[MSSQL getShopPoints error]:', err);
      }
    }

    const store = getMockStore();
    const points = store.shopPoints.get(username) || { WCoinC: 0, WCoinP: 0, GoblinPoint: 0 };
    return {
      memb___id: username,
      ...points,
    };
  },

  /**
   * Add WCoinC to account and log RMT transaction
   */
  async addWCoinAndLogPayment(
    username: string,
    wcoinAmount: number,
    paymentId: string,
    amountBRL: number
  ): Promise<boolean> {
    const pool = await getDbPool();
    if (pool) {
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      try {
        // Update or insert T_InGameShop_Point
        const req1 = new sql.Request(transaction);
        req1.input('memb___id', sql.VarChar(10), username);
        req1.input('wcoin', sql.Int, wcoinAmount);
        await req1.query(`
          IF EXISTS (SELECT 1 FROM T_InGameShop_Point WHERE memb___id = @memb___id)
            UPDATE T_InGameShop_Point SET WCoinC = WCoinC + @wcoin WHERE memb___id = @memb___id;
          ELSE
            INSERT INTO T_InGameShop_Point (memb___id, WCoinC, WCoinP, GoblinPoint) VALUES (@memb___id, @wcoin, 0, 0);
        `);

        // Check if RMT_Transactions table exists, if not create it
        const reqEnsure = new sql.Request(transaction);
        await reqEnsure.query(`
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RMT_Transactions' and xtype='U')
          CREATE TABLE RMT_Transactions (
            id INT IDENTITY(1,1) PRIMARY KEY,
            memb___id VARCHAR(10) NOT NULL,
            payment_id VARCHAR(100) NOT NULL,
            amount_brl DECIMAL(10,2) NOT NULL,
            wcoin_added INT NOT NULL,
            status VARCHAR(20) NOT NULL,
            created_at DATETIME DEFAULT GETDATE()
          );
        `);

        // Insert or update transaction log
        const req2 = new sql.Request(transaction);
        req2.input('memb___id', sql.VarChar(10), username);
        req2.input('payment_id', sql.VarChar(100), paymentId);
        req2.input('amount_brl', sql.Decimal(10, 2), amountBRL);
        req2.input('wcoin_added', sql.Int, wcoinAmount);
        req2.input('status', sql.VarChar(20), 'approved');

        await req2.query(`
          IF EXISTS (SELECT 1 FROM RMT_Transactions WHERE payment_id = @payment_id)
            UPDATE RMT_Transactions SET status = 'approved' WHERE payment_id = @payment_id;
          ELSE
            INSERT INTO RMT_Transactions (memb___id, payment_id, amount_brl, wcoin_added, status, created_at)
            VALUES (@memb___id, @payment_id, @amount_brl, @wcoin_added, @status, GETDATE());
        `);

        await transaction.commit();
        return true;
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    }

    // Fallback store
    const store = getMockStore();
    const current = store.shopPoints.get(username) || { WCoinC: 0, WCoinP: 0, GoblinPoint: 0 };
    store.shopPoints.set(username, {
      ...current,
      WCoinC: current.WCoinC + wcoinAmount,
    });

    const existingTx = store.transactions.find((t) => t.payment_id === paymentId);
    if (existingTx) {
      existingTx.status = 'approved';
    } else {
      store.transactions.unshift({
        id: store.transactions.length + 1,
        memb___id: username,
        payment_id: paymentId,
        amount_brl: amountBRL,
        wcoin_added: wcoinAmount,
        status: 'approved',
        created_at: new Date().toISOString(),
      });
    }

    return true;
  },

  /**
   * Log initiated transaction in RMT_Transactions
   */
  async createPendingTransaction(
    username: string,
    paymentId: string,
    amountBRL: number,
    wcoinAmount: number
  ): Promise<void> {
    const pool = await getDbPool();
    if (pool) {
      try {
        const reqEnsure = pool.request();
        await reqEnsure.query(`
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RMT_Transactions' and xtype='U')
          CREATE TABLE RMT_Transactions (
            id INT IDENTITY(1,1) PRIMARY KEY,
            memb___id VARCHAR(10) NOT NULL,
            payment_id VARCHAR(100) NOT NULL,
            amount_brl DECIMAL(10,2) NOT NULL,
            wcoin_added INT NOT NULL,
            status VARCHAR(20) NOT NULL,
            created_at DATETIME DEFAULT GETDATE()
          );
        `);

        const req = pool.request();
        req.input('memb___id', sql.VarChar(10), username);
        req.input('payment_id', sql.VarChar(100), paymentId);
        req.input('amount_brl', sql.Decimal(10, 2), amountBRL);
        req.input('wcoin_added', sql.Int, wcoinAmount);
        req.input('status', sql.VarChar(20), 'pending');

        await req.query(`
          INSERT INTO RMT_Transactions (memb___id, payment_id, amount_brl, wcoin_added, status, created_at)
          VALUES (@memb___id, @payment_id, @amount_brl, @wcoin_added, @status, GETDATE())
        `);
        return;
      } catch (err) {
        console.warn('[MSSQL createPendingTransaction error]:', err);
      }
    }

    const store = getMockStore();
    store.transactions.unshift({
      id: store.transactions.length + 1,
      memb___id: username,
      payment_id: paymentId,
      amount_brl: amountBRL,
      wcoin_added: wcoinAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
  },

  /**
   * Get transaction status by payment_id
   */
  async getTransaction(paymentId: string): Promise<RmtTransactionRow | null> {
    const pool = await getDbPool();
    if (pool) {
      try {
        const req = pool.request();
        req.input('payment_id', sql.VarChar(100), paymentId);
        const result = await req.query<RmtTransactionRow>(`
          SELECT id, memb___id, payment_id, amount_brl, wcoin_added, status, created_at
          FROM RMT_Transactions
          WHERE payment_id = @payment_id
        `);
        return result.recordset[0] || null;
      } catch {
        return null;
      }
    }

    const store = getMockStore();
    const tx = store.transactions.find((t) => t.payment_id === paymentId);
    return tx || null;
  },

  /**
   * Get user's characters from Character table
   */
  async getUserCharacters(username: string): Promise<CharacterRow[]> {
    const pool = await getDbPool();
    if (pool) {
      try {
        const req = pool.request();
        req.input('AccountID', sql.VarChar(10), username);
        const result = await req.query<CharacterRow>(`
          SELECT 
            c.AccountID, c.Name, c.cLevel, 
            ISNULL(c.ResetCount, 0) AS ResetCount, 
            ISNULL(c.m_GrandReset, 0) AS m_GrandReset,
            c.Class, c.Money, c.Strength, c.Dexterity, c.Vitality, c.Energy, 
            ISNULL(c.Leadership, 0) AS Leadership,
            ISNULL(c.PkCount, 0) AS PkCount,
            ISNULL(c.PkLevel, 3) AS PkLevel,
            c.MapNumber, c.MapPosX, c.MapPosY,
            ISNULL(g.G_Name, '') AS GuildName
          FROM Character c
          LEFT JOIN GuildMember g ON c.Name = g.G_Name
          WHERE c.AccountID = @AccountID
          ORDER BY c.ResetCount DESC, c.cLevel DESC
        `);
        return result.recordset;
      } catch (err) {
        console.warn('[MSSQL getUserCharacters error]:', err);
      }
    }

    const store = getMockStore();
    return store.characters.filter((c) => c.AccountID.toLowerCase() === username.toLowerCase());
  },

  /**
   * Reset Character Stats or Clear PK in Character table (Prepared Statement)
   */
  async performCharacterAction(
    username: string,
    characterName: string,
    action: 'clear_pk' | 'reset_stats' | 'unstuck'
  ): Promise<{ success: boolean; message: string }> {
    const pool = await getDbPool();
    if (pool) {
      try {
        const req = pool.request();
        req.input('AccountID', sql.VarChar(10), username);
        req.input('Name', sql.VarChar(10), characterName);

        if (action === 'clear_pk') {
          await req.query(`
            UPDATE Character
            SET PkCount = 0, PkLevel = 3
            WHERE AccountID = @AccountID AND Name = @Name
          `);
          return { success: true, message: `Status de PK do personagem ${characterName} foi limpo com sucesso!` };
        } else if (action === 'unstuck') {
          await req.query(`
            UPDATE Character
            SET MapNumber = 0, MapPosX = 125, MapPosY = 125
            WHERE AccountID = @AccountID AND Name = @Name
          `);
          return { success: true, message: `Personagem ${characterName} foi movido com sucesso para o centro de Lorencia!` };
        } else if (action === 'reset_stats') {
          await req.query(`
            UPDATE Character
            SET Strength = 30, Dexterity = 30, Vitality = 30, Energy = 30
            WHERE AccountID = @AccountID AND Name = @Name
          `);
          return { success: true, message: `Atributos de ${characterName} foram resetados com sucesso para redistribuição!` };
        }
      } catch (err) {
        return { success: false, message: (err as Error).message };
      }
    }

    const store = getMockStore();
    const char = store.characters.find(
      (c) => c.AccountID.toLowerCase() === username.toLowerCase() && c.Name.toLowerCase() === characterName.toLowerCase()
    );

    if (!char) {
      return { success: false, message: 'Personagem não encontrado nesta conta.' };
    }

    if (action === 'clear_pk') {
      char.PkCount = 0;
      char.PkLevel = 3;
      return { success: true, message: `Status de PK do personagem ${characterName} foi limpo com sucesso!` };
    } else if (action === 'unstuck') {
      char.MapNumber = 0;
      char.MapPosX = 125;
      char.MapPosY = 125;
      return { success: true, message: `Personagem ${characterName} foi movido com sucesso para Lorencia!` };
    } else if (action === 'reset_stats') {
      char.Strength = 30;
      char.Dexterity = 30;
      char.Vitality = 30;
      char.Energy = 30;
      return { success: true, message: `Atributos de ${characterName} foram resetados com sucesso!` };
    }

    return { success: false, message: 'Ação não reconhecida.' };
  },

  /**
   * Query Global Rankings (Top Resets, Top Level, Top Master, Top Guilds, Castle Siege)
   */
  async getRankings(category: 'resets' | 'level' | 'master' | 'guilds' | 'siege'): Promise<any[]> {
    const pool = await getDbPool();
    if (pool) {
      try {
        const req = pool.request();
        const characterTable = quoteIdentifierPath(dbSchema.characterTable);
        const guildTable = quoteIdentifierPath(dbSchema.guildTable);
        const guildMemberTable = quoteIdentifierPath(dbSchema.guildMemberTable);
        const guildMemberCharacterColumn = quoteIdentifierPath(dbSchema.guildMemberCharacterColumn);
        const guildMemberGuildColumn = quoteIdentifierPath(dbSchema.guildMemberGuildColumn);
        const masterLevelColumn = quoteIdentifierPath(dbSchema.masterLevelColumn);

        if (category === 'resets') {
          const result = await req.query(`
            SELECT TOP 50 
              c.Name, c.cLevel, 
              ISNULL(c.ResetCount, 0) AS ResetCount, 
              ISNULL(c.m_GrandReset, 0) AS m_GrandReset, 
              c.Class, 
              ISNULL(gm.${guildMemberGuildColumn}, '-') AS GuildName
            FROM ${characterTable} c
            LEFT JOIN ${guildMemberTable} gm ON c.Name = gm.${guildMemberCharacterColumn}
            ORDER BY c.m_GrandReset DESC, c.ResetCount DESC, c.cLevel DESC
          `);
          return result.recordset;
        } else if (category === 'level') {
          const result = await req.query(`
            SELECT TOP 50 
              c.Name, c.cLevel, 
              ISNULL(c.ResetCount, 0) AS ResetCount, 
              c.Class, 
              ISNULL(gm.${guildMemberGuildColumn}, '-') AS GuildName
            FROM ${characterTable} c
            LEFT JOIN ${guildMemberTable} gm ON c.Name = gm.${guildMemberCharacterColumn}
            ORDER BY c.cLevel DESC, c.ResetCount DESC
          `);
          return result.recordset;
        } else if (category === 'master') {
          const result = await req.query(`
            SELECT TOP 50
              c.Name, c.cLevel,
              ISNULL(c.${masterLevelColumn}, 0) AS MasterLevel,
              ISNULL(c.ResetCount, 0) AS ResetCount,
              ISNULL(c.m_GrandReset, 0) AS m_GrandReset,
              c.Class,
              ISNULL(gm.${guildMemberGuildColumn}, '-') AS GuildName
            FROM ${characterTable} c
            LEFT JOIN ${guildMemberTable} gm ON c.Name = gm.${guildMemberCharacterColumn}
            WHERE ISNULL(c.${masterLevelColumn}, 0) > 0
            ORDER BY c.${masterLevelColumn} DESC, c.cLevel DESC, c.ResetCount DESC
          `);
          return result.recordset;
        } else if (category === 'guilds') {
          const result = await req.query(`
            SELECT TOP 20
              g.G_Name AS Name,
              g.G_Master AS Master,
              g.G_Score AS Score,
              COUNT(gm.${guildMemberCharacterColumn}) AS Members
            FROM ${guildTable} g
            LEFT JOIN ${guildMemberTable} gm ON gm.${guildMemberGuildColumn} = g.G_Name
            GROUP BY g.G_Name, g.G_Master, g.G_Score
            ORDER BY g.G_Score DESC
          `);
          return result.recordset;
        } else if (category === 'siege') {
          const siegeTable = quoteIdentifierPath(dbSchema.siegeTable);
          const siegeOwnerColumn = quoteIdentifierPath(dbSchema.siegeOwnerColumn);
          const result = await req.query(`
            SELECT TOP 1
              CAST(mc.${siegeOwnerColumn} AS VARCHAR(32)) AS CastleOwner,
              ISNULL(g.G_Master, '-') AS GuildMaster,
              '-' AS Alliance,
              '-' AS DefensesOccupied,
              '-' AS NextBattleDate,
              CAST('[]' AS NVARCHAR(MAX)) AS RegisteredGuilds
            FROM ${siegeTable} mc
            LEFT JOIN ${guildTable} g ON g.G_Name = mc.${siegeOwnerColumn}
          `);

          if (result.recordset[0]) {
            return [{
              ...result.recordset[0],
              RegisteredGuilds: [],
            }];
          }
          return [];
        }
      } catch (err) {
        if (!mockDbEnabled) {
          throw err;
        }
        console.warn('[MSSQL Rankings Query Error, using development mock]:', (err as Error).message);
      }
    }

    // Development-only fallback; production must never display fabricated rankings.
    const store = getMockStore();
    if (category === 'resets') {
      return [...store.characters]
        .sort((a, b) => b.m_GrandReset - a.m_GrandReset || b.ResetCount - a.ResetCount || b.cLevel - a.cLevel)
        .slice(0, 50);
    } else if (category === 'level') {
      return [...store.characters]
        .sort((a, b) => b.cLevel - a.cLevel || b.ResetCount - a.ResetCount)
        .slice(0, 50);
    } else if (category === 'master') {
      // 3rd Class characters sorted by Master Level
      return [...store.characters]
        .filter((c) => [2, 18, 34, 50, 66, 82].includes(c.Class))
        .map((c) => ({ ...c, MasterLevel: Math.floor(c.ResetCount * 3.8) }))
        .sort((a, b) => b.MasterLevel - a.MasterLevel);
    } else if (category === 'guilds') {
      return [
        { Name: 'Valhalla', Master: 'LordKael', Score: 14500, Members: 38, Alliance: 'Nordic Alliance' },
        { Name: 'Imperium', Master: 'HighQueenSylv', Score: 12800, Members: 35, Alliance: 'Iron Throne' },
        { Name: 'DragonLords', Master: 'DimensionWitch', Score: 9400, Members: 29, Alliance: '-' },
        { Name: 'ShadowOrder', Master: 'DarthVader', Score: 7800, Members: 24, Alliance: '-' },
        { Name: 'Aethelgard', Master: 'Ragnarok', Score: 6200, Members: 20, Alliance: '-' },
      ];
    } else if (category === 'siege') {
      return [
        {
          CastleOwner: 'Valhalla',
          GuildMaster: 'LordKael',
          Alliance: 'Nordic Alliance',
          DefensesOccupied: '5 semanas consecutivas',
          NextBattleDate: 'Próximo Domingo às 20:00 (Horário de Brasília)',
          RegisteredGuilds: [
            { Guild: 'Imperium', Master: 'HighQueenSylv', AttackStatus: 'Desafiante Principal' },
            { Guild: 'DragonLords', Master: 'DimensionWitch', AttackStatus: 'Desafiante 2' },
          ],
        },
      ];
    }

    return [];
  },

  /**
   * Server general statistics
   */
  async getServerStats() {
    const pool = await getDbPool();
    const baseStats = {
      serverName: process.env.SERVER_NAME || 'MU ONLINE SEASON 6',
      subTitle: process.env.SERVER_SUBTITLE || 'Classic Hard & Dynamic Engine',
      version: process.env.SERVER_VERSION || 'Season 6 Episode 3',
      experience: process.env.SERVER_EXPERIENCE || '20x ~ 5x (Dinâmica)',
      dropRate: process.env.SERVER_DROP_RATE || '20%',
      maxOnline: Number.parseInt(process.env.SERVER_MAX_ONLINE || '1500', 10),
      connectServerStatus: process.env.SERVER_CONNECT_STATUS || 'Online',
      gameServer1Status: process.env.SERVER_GAME1_STATUS || 'Online',
      gameServer2Status: process.env.SERVER_GAME2_STATUS || 'Online',
    };

    if (pool) {
      const onlineTable = quoteIdentifierPath(dbSchema.onlineTable);
      const onlineStatusColumn = quoteIdentifierPath(dbSchema.onlineStatusColumn);
      const accountTable = quoteIdentifierPath(dbSchema.accountTable);
      const characterTable = quoteIdentifierPath(dbSchema.characterTable);
      const guildTable = quoteIdentifierPath(dbSchema.guildTable);
      const statusValue = dbSchema.onlineStatusValue;
      const statusPredicate = /^-?\d+$/.test(statusValue)
        ? `= ${statusValue}`
        : '= @onlineStatusValue';
      const request = pool.request();

      if (statusPredicate.includes('@onlineStatusValue')) {
        request.input('onlineStatusValue', sql.VarChar(16), statusValue);
      }

      try {
        const result = await request.query(`
          SELECT
            (SELECT COUNT(*) FROM ${onlineTable} WHERE ${onlineStatusColumn} ${statusPredicate}) AS onlinePlayers,
            (SELECT COUNT(*) FROM ${accountTable}) AS totalAccounts,
            (SELECT COUNT(*) FROM ${characterTable}) AS totalCharacters,
            (SELECT COUNT(*) FROM ${guildTable}) AS totalGuilds
        `);
        const counts = result.recordset[0] || {};
        let siege: any[] = [];
        try {
          siege = await MuDatabase.getRankings('siege');
        } catch (siegeError) {
          console.warn('[MSSQL Siege Query Error]:', (siegeError as Error).message);
        }
        const owner = siege[0];

        return {
          ...baseStats,
          databaseConnected: true,
          onlinePlayers: Number(counts.onlinePlayers || 0),
          totalAccounts: Number(counts.totalAccounts || 0),
          totalCharacters: Number(counts.totalCharacters || 0),
          totalGuilds: Number(counts.totalGuilds || 0),
          castleSiegeOwner: owner?.CastleOwner || '-',
          castleSiegeMaster: owner?.GuildMaster || '-',
        };
      } catch (err) {
        if (!mockDbEnabled) {
          throw err;
        }
        console.warn('[MSSQL Stats Query Error, using development mock]:', (err as Error).message);
      }
    }

    const store = getMockStore();
    return {
      ...baseStats,
      databaseConnected: false,
      onlinePlayers: 0,
      totalAccounts: store.accounts.length,
      totalCharacters: store.characters.length,
      totalGuilds: 0,
      castleSiegeOwner: '-',
      castleSiegeMaster: '-',
    };
  },
};

export default MuDatabase;

