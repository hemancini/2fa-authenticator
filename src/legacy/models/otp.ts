import { Encryption } from "./crypto";
import { KeyUtilities } from "./keyUtilities";
import { EntryStorage } from "./storage";

export enum OTPType {
  totp = 1,
  hotp,
  battle,
  steam,
  hex,
  hhex,
}

export enum CodeState {
  Invalid = "-1",
  Encrypted = "-2",
}

export enum OTPAlgorithm {
  SHA1 = 1,
  SHA256,
  SHA512,
}

export interface OTPAlgorithmSpec {
  length: number;
}

let LocalStorage: { [key: string]: OTPStorage };

/**
 * @deprecated since version 1.3.0
 */
export class OTPEntry implements OTPEntryInterface {
  type: OTPType;
  index: number;
  issuer: string;
  secret: string | null;
  encSecret: string | null;
  account: string;
  hash: string;
  counter: number;
  period: number;
  digits: number;
  algorithm: OTPAlgorithm;
  pinned: boolean;
  code = "&bull;&bull;&bull;&bull;&bull;&bull;";
  site: string;
  user: string;
  pass: string;

  constructor(
    entry: {
      account?: string;
      encrypted: boolean;
      index: number;
      issuer?: string;
      secret: string;
      type: OTPType;
      counter?: number;
      period?: number;
      hash?: string;
      digits?: number;
      algorithm?: OTPAlgorithm;
      pinned?: boolean;
      site?: string;
      user?: string;
      pass?: string;
    },
    encryption?: Encryption
  ) {
    this.type = entry.type;
    this.index = entry.index;
    if (entry.issuer) {
      this.issuer = entry.issuer;
    } else {
      this.issuer = "";
    }
    if (entry.account) {
      this.account = entry.account;
    } else {
      this.account = "";
    }
    if (entry.encrypted) {
      this.encSecret = entry.secret;
      this.secret = null;
    } else {
      this.secret = entry.secret;
      this.encSecret = null;
      if (encryption && encryption.getEncryptionStatus()) {
        this.encSecret = encryption.getEncryptedString(this.secret);
      }
    }
    if (entry.hash) {
      this.hash = entry.hash;
    } else {
      this.hash = crypto.randomUUID();
    }
    if (entry.counter) {
      this.counter = entry.counter;
    } else {
      this.counter = 0;
    }
    if (entry.digits) {
      this.digits = entry.digits;
    } else {
      this.digits = 6;
    }
    if (entry.algorithm) {
      this.algorithm = entry.algorithm;
    } else {
      this.algorithm = OTPAlgorithm.SHA1;
    }
    if (entry.pinned) {
      this.pinned = entry.pinned;
    } else {
      this.pinned = false;
    }
    if (this.type === OTPType.totp && entry.period) {
      this.period = entry.period;
    } else {
      this.period = 30;
    }
    if (this.type !== OTPType.hotp && this.type !== OTPType.hhex) {
      this.generate();
    }
    if (entry.site) {
      this.site = entry.site;
    } else {
      this.site = "";
    }
    if (entry.user) {
      this.user = entry.user;
    } else {
      this.user = "";
    }
    if (entry.pass) {
      this.pass = entry.pass;
    } else {
      this.pass = "";
    }
  }

  async create() {
    await EntryStorage.add(this);
    return;
  }

  async update() {
    await EntryStorage.update(this);
    return;
  }

  changeEncryption(encryption: Encryption) {
    if (!this.secret) {
      return;
    }

    if (encryption.getEncryptionStatus()) {
      this.encSecret = encryption.getEncryptedString(this.secret);
    } else {
      this.encSecret = null;
    }
    return;
  }

  applyEncryption(encryption: Encryption) {
    const secret = this.encSecret ? this.encSecret : null;
    if (secret) {
      this.secret = encryption.getDecryptedSecret({
        hash: this.hash,
        secret,
      });
      if (this.type !== OTPType.hotp && this.type !== OTPType.hhex) {
        this.generate();
      }
    }
    return;
  }

  async delete() {
    await EntryStorage.delete(this);
    return;
  }

  async next() {
    if (this.type !== OTPType.hotp && this.type !== OTPType.hhex) {
      return;
    }
    this.generate();
    if (this.secret !== null) {
      this.counter++;
      await this.update();
    }
    return;
  }

  genUUID() {
    this.hash = crypto.randomUUID();
  }

  generate() {
    const offset = (LocalStorage ? LocalStorage.offset : 0) as number;
    if (!LocalStorage) {
      // browser storage is async, so we need to wait for it to load
      // and re-generate the code
      // don't change the code to async, it will break the mutation
      // for Accounts store to export data
      chrome.storage.local.get("LocalStorage").then((res) => {
        LocalStorage = res.LocalStorage || {};
        this.generate();
      });
    }

    if (!this.secret && !this.encSecret) {
      this.code = CodeState.Invalid;
    } else if (!this.secret) {
      this.code = CodeState.Encrypted;
    } else {
      try {
        this.code = KeyUtilities.generate(
          this.type,
          this.secret,
          this.counter,
          this.period,
          this.digits,
          this.algorithm,
          offset
        );
      } catch (error) {
        this.code = CodeState.Invalid;
        console.warn("Invalid secret.", error);
      }
    }
  }
}
