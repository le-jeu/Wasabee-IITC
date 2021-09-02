import db from "../db";

export default class WasabeeBlocker {
  opID: string;
  from: string;
  to: string;

  fromPortal?: WasabeePortal;
  toPortal?: WasabeePortal;

  static async addPortal(op: WasabeeOp, portal: WasabeePortal) : void

  // return true if a blocker portal is updated
  static async updatePortal(op: WasabeeOp, portal: WasabeePortal) : boolean

  static async removeBlocker(op: WasabeeOp, portal: string) : void

  static async removeBlockers(opID: string) : void

  static async addBlocker(op: WasabeeOp, fromPortal: WasabeePortal, toPortal: WasabeePortal) : void

  static async getPortals(op: WasabeeOp) : WasabeePortal[]

  static async getAll(op: WasabeeOp) : WasabeeBlocker[]
}

