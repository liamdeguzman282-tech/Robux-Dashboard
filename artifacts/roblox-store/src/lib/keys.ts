export type KeyType = "7-Day" | "30-Day" | "Lifetime";

export interface ValidKey {
  key: string;
  type: KeyType;
  days: number | null; // null = lifetime
}

export interface KeySession {
  key: string;
  type: KeyType;
  activatedAt: number;
  expiresAt: number | null;
}

// ─── 90 hardcoded access keys ────────────────────────────────────────────────
export const VALID_KEYS: ValidKey[] = [
  // ── 7-Day (30 keys) ──
  { key: "7D-XKPF-MJRH-Q8VN", type: "7-Day",    days: 7    },
  { key: "7D-B3LA-WSZE-2CYT", type: "7-Day",    days: 7    },
  { key: "7D-NPQG-7FDK-RHJM", type: "7-Day",    days: 7    },
  { key: "7D-V6YA-3MPB-XKQF", type: "7-Day",    days: 7    },
  { key: "7D-LRHT-NWSY-5GBZ", type: "7-Day",    days: 7    },
  { key: "7D-4CKF-PVXM-9JWA", type: "7-Day",    days: 7    },
  { key: "7D-QMZB-8NYR-TLHG", type: "7-Day",    days: 7    },
  { key: "7D-FJWS-K2PD-3XNA", type: "7-Day",    days: 7    },
  { key: "7D-YBNH-5VXZ-LCPF", type: "7-Day",    days: 7    },
  { key: "7D-9KGM-RFJA-NQTS", type: "7-Day",    days: 7    },
  { key: "7D-HVZQ-4BCL-XWMY", type: "7-Day",    days: 7    },
  { key: "7D-ZRFA-8YKN-SMGD", type: "7-Day",    days: 7    },
  { key: "7D-3MPC-BFXQ-J7HN", type: "7-Day",    days: 7    },
  { key: "7D-NGBY-VZLK-5TWA", type: "7-Day",    days: 7    },
  { key: "7D-K8HX-FQRM-PJDS", type: "7-Day",    days: 7    },
  { key: "7D-TMWB-7VNA-YCHQ", type: "7-Day",    days: 7    },
  { key: "7D-FPJS-XNHG-3KZL", type: "7-Day",    days: 7    },
  { key: "7D-YABQ-CRNM-87VP", type: "7-Day",    days: 7    },
  { key: "7D-DJHF-QLKX-Z4NT", type: "7-Day",    days: 7    },
  { key: "7D-NWYV-2KBS-MGZQ", type: "7-Day",    days: 7    },
  { key: "7D-BJKR-MVYZ-P5CN", type: "7-Day",    days: 7    },
  { key: "7D-FXAW-9GPQ-HTLR", type: "7-Day",    days: 7    },
  { key: "7D-VLZK-WQAM-8JBN", type: "7-Day",    days: 7    },
  { key: "7D-MPHF-3NXY-RCSQ", type: "7-Day",    days: 7    },
  { key: "7D-YSTN-KPGB-L4JF", type: "7-Day",    days: 7    },
  { key: "7D-QKBM-XHCF-7AWN", type: "7-Day",    days: 7    },
  { key: "7D-GNAZ-5JSP-LMYK", type: "7-Day",    days: 7    },
  { key: "7D-RFJB-8KVW-QXMC", type: "7-Day",    days: 7    },
  { key: "7D-CPWM-NHTZ-6ABS", type: "7-Day",    days: 7    },
  { key: "7D-KWNA-FXJM-BQTZ", type: "7-Day",    days: 7    },

  // ── 30-Day (30 keys) ──
  { key: "30D-XPKM-7BWN-AFQY", type: "30-Day",   days: 30   },
  { key: "30D-LQHT-RNZV-3CMJ", type: "30-Day",   days: 30   },
  { key: "30D-YBNF-KPXM-S5GW", type: "30-Day",   days: 30   },
  { key: "30D-MAVZ-3FJK-HTQN", type: "30-Day",   days: 30   },
  { key: "30D-QNKH-BYCX-6WPF", type: "30-Day",   days: 30   },
  { key: "30D-FVLW-9MST-JKZN", type: "30-Day",   days: 30   },
  { key: "30D-ZKYG-CXPB-7NHF", type: "30-Day",   days: 30   },
  { key: "30D-NRMJ-QFKB-5LXW", type: "30-Day",   days: 30   },
  { key: "30D-BWQS-MPFN-2YHK", type: "30-Day",   days: 30   },
  { key: "30D-JXNZ-7LBY-HVQM", type: "30-Day",   days: 30   },
  { key: "30D-PKHF-4VNZ-XRMS", type: "30-Day",   days: 30   },
  { key: "30D-YNQM-BFXK-3JTL", type: "30-Day",   days: 30   },
  { key: "30D-CFLM-SPNH-8KVW", type: "30-Day",   days: 30   },
  { key: "30D-MQBK-JYZF-XGNR", type: "30-Day",   days: 30   },
  { key: "30D-7NVH-FLKM-QPBT", type: "30-Day",   days: 30   },
  { key: "30D-TPZQ-8MXN-FHWK", type: "30-Day",   days: 30   },
  { key: "30D-KLWJ-FQTM-N5PX", type: "30-Day",   days: 30   },
  { key: "30D-BJFX-RLMQ-7HNY", type: "30-Day",   days: 30   },
  { key: "30D-NYWK-3XPB-FZQM", type: "30-Day",   days: 30   },
  { key: "30D-VHJX-MZFA-L9NK", type: "30-Day",   days: 30   },
  { key: "30D-SRQF-NBWM-4KXP", type: "30-Day",   days: 30   },
  { key: "30D-MFKN-HQPZ-YLJA", type: "30-Day",   days: 30   },
  { key: "30D-BXPH-7NMA-SLKQ", type: "30-Day",   days: 30   },
  { key: "30D-QZNY-KFLB-W6JM", type: "30-Day",   days: 30   },
  { key: "30D-HLKF-PXWN-J3TM", type: "30-Day",   days: 30   },
  { key: "30D-NBMZ-7QYF-LKPX", type: "30-Day",   days: 30   },
  { key: "30D-XKFW-JQNB-MRTZ", type: "30-Day",   days: 30   },
  { key: "30D-FJLN-KHZQ-5XBM", type: "30-Day",   days: 30   },
  { key: "30D-PZNK-FMWH-YJLB", type: "30-Day",   days: 30   },
  { key: "30D-MHXQ-BNJK-7FZW", type: "30-Day",   days: 30   },

  // ── Lifetime (30 keys) ──
  { key: "LTM-XMKF-BWQN-5PJH", type: "Lifetime", days: null },
  { key: "LTM-QNBH-FJPX-ZKWM", type: "Lifetime", days: null },
  { key: "LTM-YKLF-7NMB-PXHZ", type: "Lifetime", days: null },
  { key: "LTM-BJNQ-MFWK-H3XP", type: "Lifetime", days: null },
  { key: "LTM-WZPK-NHJM-YFLQ", type: "Lifetime", days: null },
  { key: "LTM-FHNB-QXKZ-3JMP", type: "Lifetime", days: null },
  { key: "LTM-MKQB-7WFN-PYHZ", type: "Lifetime", days: null },
  { key: "LTM-NPJH-KXWM-BFQZ", type: "Lifetime", days: null },
  { key: "LTM-XWKN-BMFP-H9JZ", type: "Lifetime", days: null },
  { key: "LTM-FQHM-5NKP-XBJW", type: "Lifetime", days: null },
  { key: "LTM-BNKM-QWFH-J7XP", type: "Lifetime", days: null },
  { key: "LTM-WJQN-MXKP-BFHZ", type: "Lifetime", days: null },
  { key: "LTM-KFXB-HWJN-5QMP", type: "Lifetime", days: null },
  { key: "LTM-NMHQ-BJPK-FXWZ", type: "Lifetime", days: null },
  { key: "LTM-PXKF-QNWB-H7JM", type: "Lifetime", days: null },
  { key: "LTM-BQHM-FKPN-XJWZ", type: "Lifetime", days: null },
  { key: "LTM-FKNQ-MJXB-HPWZ", type: "Lifetime", days: null },
  { key: "LTM-HWBP-KXNM-FJQZ", type: "Lifetime", days: null },
  { key: "LTM-NXQM-7KBH-PFJW", type: "Lifetime", days: null },
  { key: "LTM-QBKX-FNHM-3WJP", type: "Lifetime", days: null },
  { key: "LTM-XFJN-MWKQ-BPHZ", type: "Lifetime", days: null },
  { key: "LTM-KHMB-FXNJ-QWPZ", type: "Lifetime", days: null },
  { key: "LTM-WPNF-QJKM-XHBZ", type: "Lifetime", days: null },
  { key: "LTM-FXJQ-BMHK-NWPZ", type: "Lifetime", days: null },
  { key: "LTM-MBJX-KFNQ-HWPZ", type: "Lifetime", days: null },
  { key: "LTM-NQHK-WXBM-FJPZ", type: "Lifetime", days: null },
  { key: "LTM-JHXF-KMNB-QWPZ", type: "Lifetime", days: null },
  { key: "LTM-BWMF-QXNK-PHJZ", type: "Lifetime", days: null },
  { key: "LTM-KPNX-FWBM-QHJZ", type: "Lifetime", days: null },
  { key: "LTM-XQKB-NHWM-FJPZ", type: "Lifetime", days: null },
];

const KEY_MAP = new Map(VALID_KEYS.map(k => [k.key.toUpperCase(), k]));

export function validateKey(input: string): ValidKey | null {
  return KEY_MAP.get(input.trim().toUpperCase()) ?? null;
}

// ─── Session helpers ──────────────────────────────────────────────────────────
const SESSION_KEY = "roblox-access-session";

export function loadSession(): KeySession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as KeySession;
  } catch { return null; }
}

export function saveSession(session: KeySession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isSessionValid(session: KeySession): boolean {
  if (session.expiresAt === null) return true;
  return Date.now() < session.expiresAt;
}

export function daysRemaining(session: KeySession): number | null {
  if (session.expiresAt === null) return null; // lifetime
  const ms = session.expiresAt - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function createSession(validKey: ValidKey): KeySession {
  const now = Date.now();
  return {
    key: validKey.key,
    type: validKey.type,
    activatedAt: now,
    expiresAt: validKey.days !== null ? now + validKey.days * 24 * 60 * 60 * 1000 : null,
  };
}
