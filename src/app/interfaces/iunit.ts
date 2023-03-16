
export interface IUnit {
  unit?: number;
  name: string;
  street: string;
  csz: string;
  cell: string;
  email: string;
};

export interface IUnitTable {
  name: string;
  street: string;
  csz: string;
  cell: string;
  email: string;
};

export interface IUnitsState {
  isEditMode:boolean;
  isMenuActive:boolean;
}

export interface ISelect{
value:string;
viewValue:string;
}