import { Router } from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(__dirname, "../../data");
const USED_KEYS_FILE = join(DATA_DIR, "used-keys.json");

const VALID_KEYS = new Map<string, { type: string; days: number | null }>([
  ["7D-XKPF-MJRH-Q8VN", { type: "7-Day",    days: 7    }],
  ["7D-B3LA-WSZE-2CYT", { type: "7-Day",    days: 7    }],
  ["7D-NPQG-7FDK-RHJM", { type: "7-Day",    days: 7    }],
  ["7D-V6YA-3MPB-XKQF", { type: "7-Day",    days: 7    }],
  ["7D-LRHT-NWSY-5GBZ", { type: "7-Day",    days: 7    }],
  ["7D-4CKF-PVXM-9JWA", { type: "7-Day",    days: 7    }],
  ["7D-QMZB-8NYR-TLHG", { type: "7-Day",    days: 7    }],
  ["7D-FJWS-K2PD-3XNA", { type: "7-Day",    days: 7    }],
  ["7D-YBNH-5VXZ-LCPF", { type: "7-Day",    days: 7    }],
  ["7D-9KGM-RFJA-NQTS", { type: "7-Day",    days: 7    }],
  ["7D-HVZQ-4BCL-XWMY", { type: "7-Day",    days: 7    }],
  ["7D-ZRFA-8YKN-SMGD", { type: "7-Day",    days: 7    }],
  ["7D-3MPC-BFXQ-J7HN", { type: "7-Day",    days: 7    }],
  ["7D-NGBY-VZLK-5TWA", { type: "7-Day",    days: 7    }],
  ["7D-K8HX-FQRM-PJDS", { type: "7-Day",    days: 7    }],
  ["7D-TMWB-7VNA-YCHQ", { type: "7-Day",    days: 7    }],
  ["7D-FPJS-XNHG-3KZL", { type: "7-Day",    days: 7    }],
  ["7D-YABQ-CRNM-87VP", { type: "7-Day",    days: 7    }],
  ["7D-DJHF-QLKX-Z4NT", { type: "7-Day",    days: 7    }],
  ["7D-NWYV-2KBS-MGZQ", { type: "7-Day",    days: 7    }],
  ["7D-BJKR-MVYZ-P5CN", { type: "7-Day",    days: 7    }],
  ["7D-FXAW-9GPQ-HTLR", { type: "7-Day",    days: 7    }],
  ["7D-VLZK-WQAM-8JBN", { type: "7-Day",    days: 7    }],
  ["7D-MPHF-3NXY-RCSQ", { type: "7-Day",    days: 7    }],
  ["7D-YSTN-KPGB-L4JF", { type: "7-Day",    days: 7    }],
  ["7D-QKBM-XHCF-7AWN", { type: "7-Day",    days: 7    }],
  ["7D-GNAZ-5JSP-LMYK", { type: "7-Day",    days: 7    }],
  ["7D-RFJB-8KVW-QXMC", { type: "7-Day",    days: 7    }],
  ["7D-CPWM-NHTZ-6ABS", { type: "7-Day",    days: 7    }],
  ["7D-KWNA-FXJM-BQTZ", { type: "7-Day",    days: 7    }],
  ["30D-XPKM-7BWN-AFQY", { type: "30-Day",  days: 30   }],
  ["30D-LQHT-RNZV-3CMJ", { type: "30-Day",  days: 30   }],
  ["30D-YBNF-KPXM-S5GW", { type: "30-Day",  days: 30   }],
  ["30D-MAVZ-3FJK-HTQN", { type: "30-Day",  days: 30   }],
  ["30D-QNKH-BYCX-6WPF", { type: "30-Day",  days: 30   }],
  ["30D-FVLW-9MST-JKZN", { type: "30-Day",  days: 30   }],
  ["30D-ZKYG-CXPB-7NHF", { type: "30-Day",  days: 30   }],
  ["30D-NRMJ-QFKB-5LXW", { type: "30-Day",  days: 30   }],
  ["30D-BWQS-MPFN-2YHK", { type: "30-Day",  days: 30   }],
  ["30D-JXNZ-7LBY-HVQM", { type: "30-Day",  days: 30   }],
  ["30D-PKHF-4VNZ-XRMS", { type: "30-Day",  days: 30   }],
  ["30D-YNQM-BFXK-3JTL", { type: "30-Day",  days: 30   }],
  ["30D-CFLM-SPNH-8KVW", { type: "30-Day",  days: 30   }],
  ["30D-MQBK-JYZF-XGNR", { type: "30-Day",  days: 30   }],
  ["30D-7NVH-FLKM-QPBT", { type: "30-Day",  days: 30   }],
  ["30D-TPZQ-8MXN-FHWK", { type: "30-Day",  days: 30   }],
  ["30D-KLWJ-FQTM-N5PX", { type: "30-Day",  days: 30   }],
  ["30D-BJFX-RLMQ-7HNY", { type: "30-Day",  days: 30   }],
  ["30D-NYWK-3XPB-FZQM", { type: "30-Day",  days: 30   }],
  ["30D-VHJX-MZFA-L9NK", { type: "30-Day",  days: 30   }],
  ["30D-SRQF-NBWM-4KXP", { type: "30-Day",  days: 30   }],
  ["30D-MFKN-HQPZ-YLJA", { type: "30-Day",  days: 30   }],
  ["30D-BXPH-7NMA-SLKQ", { type: "30-Day",  days: 30   }],
  ["30D-QZNY-KFLB-W6JM", { type: "30-Day",  days: 30   }],
  ["30D-HLKF-PXWN-J3TM", { type: "30-Day",  days: 30   }],
  ["30D-NBMZ-7QYF-LKPX", { type: "30-Day",  days: 30   }],
  ["30D-XKFW-JQNB-MRTZ", { type: "30-Day",  days: 30   }],
  ["30D-FJLN-KHZQ-5XBM", { type: "30-Day",  days: 30   }],
  ["30D-PZNK-FMWH-YJLB", { type: "30-Day",  days: 30   }],
  ["30D-MHXQ-BNJK-7FZW", { type: "30-Day",  days: 30   }],
  ["LTM-XMKF-BWQN-5PJH", { type: "Lifetime", days: null }],
  ["LTM-QNBH-FJPX-ZKWM", { type: "Lifetime", days: null }],
  ["LTM-YKLF-7NMB-PXHZ", { type: "Lifetime", days: null }],
  ["LTM-BJNQ-MFWK-H3XP", { type: "Lifetime", days: null }],
  ["LTM-WZPK-NHJM-YFLQ", { type: "Lifetime", days: null }],
  ["LTM-FHNB-QXKZ-3JMP", { type: "Lifetime", days: null }],
  ["LTM-MKQB-7WFN-PYHZ", { type: "Lifetime", days: null }],
  ["LTM-NPJH-KXWM-BFQZ", { type: "Lifetime", days: null }],
  ["LTM-XWKN-BMFP-H9JZ", { type: "Lifetime", days: null }],
  ["LTM-FQHM-5NKP-XBJW", { type: "Lifetime", days: null }],
  ["LTM-BNKM-QWFH-J7XP", { type: "Lifetime", days: null }],
  ["LTM-WJQN-MXKP-BFHZ", { type: "Lifetime", days: null }],
  ["LTM-KFXB-HWJN-5QMP", { type: "Lifetime", days: null }],
  ["LTM-NMHQ-BJPK-FXWZ", { type: "Lifetime", days: null }],
  ["LTM-PXKF-QNWB-H7JM", { type: "Lifetime", days: null }],
  ["LTM-BQHM-FKPN-XJWZ", { type: "Lifetime", days: null }],
  ["LTM-FKNQ-MJXB-HPWZ", { type: "Lifetime", days: null }],
  ["LTM-HWBP-KXNM-FJQZ", { type: "Lifetime", days: null }],
  ["LTM-NXQM-7KBH-PFJW", { type: "Lifetime", days: null }],
  ["LTM-QBKX-FNHM-3WJP", { type: "Lifetime", days: null }],
  ["LTM-XFJN-MWKQ-BPHZ", { type: "Lifetime", days: null }],
  ["LTM-KHMB-FXNJ-QWPZ", { type: "Lifetime", days: null }],
  ["LTM-WPNF-QJKM-XHBZ", { type: "Lifetime", days: null }],
  ["LTM-FXJQ-BMHK-NWPZ", { type: "Lifetime", days: null }],
  ["LTM-MBJX-KFNQ-HWPZ", { type: "Lifetime", days: null }],
  ["LTM-NQHK-WXBM-FJPZ", { type: "Lifetime", days: null }],
  ["LTM-JHXF-KMNB-QWPZ", { type: "Lifetime", days: null }],
  ["LTM-BWMF-QXNK-PHJZ", { type: "Lifetime", days: null }],
  ["LTM-KPNX-FWBM-QHJZ", { type: "Lifetime", days: null }],
  ["LTM-XQKB-NHWM-FJPZ", { type: "Lifetime", days: null }],
]);

function loadUsedKeys(): Set<string> {
  try {
    if (existsSync(USED_KEYS_FILE)) {
      return new Set(JSON.parse(readFileSync(USED_KEYS_FILE, "utf-8")) as string[]);
    }
  } catch { /* ignore */ }
  return new Set();
}

function saveUsedKeys(set: Set<string>): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(USED_KEYS_FILE, JSON.stringify([...set]), "utf-8");
  } catch { /* ignore */ }
}

const usedKeys = loadUsedKeys();

const router = Router();

router.post("/keys/redeem", (req, res) => {
  const raw = req.body?.key;
  if (!raw || typeof raw !== "string") {
    res.status(400).json({ error: "Key is required." });
    return;
  }

  const key = raw.trim().toUpperCase();
  const valid = VALID_KEYS.get(key);

  if (!valid) {
    res.status(404).json({ error: "Invalid key. Please check and try again." });
    return;
  }

  if (usedKeys.has(key)) {
    res.status(409).json({ error: "This key has already been used." });
    return;
  }

  usedKeys.add(key);
  saveUsedKeys(usedKeys);

  res.json({ type: valid.type, days: valid.days });
});

export default router;
