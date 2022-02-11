import {Tank} from "./tank";

export class User {
  public id: number;
  public userId: string;
  public fullName: string;
  public country: string;
  public username: string;
  public password: string;
  public email: string;
  public joinDate: Date;
  public active: boolean;
  public notLocked: boolean;
  public hasAtomicButton: boolean;
  public role: string;
  public authorities: [];
  public tanks: Tank [];


  constructor() {
    this.userId = '';
    this.fullName = '';
    this.username = '';
    this.email = '';
    this.joinDate = null;
    this.active = false;
    this.notLocked = false;
    this.hasAtomicButton = false;
    this.role = '';
    this.authorities = [];
  }

}
