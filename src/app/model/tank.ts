import {User} from "./user";

export class Tank {
  id: number;
  sideNumber: string;
  producer: string;
  model: string;
  currentModification: string;
  yearOfProduction: number;
  countryEntryDate: Date;
  mileage: number;
  ammunition: number;
  frontArmor: number;
  sideArmor: number;
  backArmor: number;
  creationDate: Date;
  updateDate: Date;
  user: User;
}
