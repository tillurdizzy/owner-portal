// Less unit
export interface IProfile {
  id?: number;
  unit?: number;
  firstname: string;
  lastname: string;
  cell: string;
  email: string;
  type?: string;
  lease?: string;
}

// All columns
export interface IProfileFetch {
  id: number;
  unit: number;
  firstname: string;
  lastname: string;
  cell: string;
  email: string;
  type: string;
  lease: string;
};

// Less id
export interface IProfileInsert {
  unit: number;
  type: string;
  email: string;
  firstname: string;
  lastname: string;
  cell: string;
  lease: string;
};

// less id and unit
export interface IProfileUpdate{
  firstname: string;
  lastname: string;
  cell: string;
  email: string;
  type: string;
  lease: string
}