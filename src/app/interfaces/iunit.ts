
export interface IUnit {
  unit: number;
  name: string;
  street: string;
  csz: string;
  cell: string;
  email: string;
  sqft:number;
  bdrms:number;

};

export interface IOwnerAccount{
  name: string;
  street: string;
  csz: string;
  cell: string;
  email: string;
}

export interface IUnitInsert {
  name: string;
  street: string;
  csz: string;
  cell: string;
  email: string;
  first:string;
  last:string;
  updated:string;
};

export interface ISelect{
  value:string;
  viewValue:string;
}