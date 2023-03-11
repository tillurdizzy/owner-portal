export interface IProfile {
  unit: number;
  type: string;
  email: string;
  firstname: string;
  lastname: string;
  cell: string;
  lease: string;
  id:number;
};


// Remove id
export interface IProfileInsert {
  unit: number;
  type: string;
  email: string;
  firstname: string;
  lastname: string;
  cell: string;
  lease: string;
};