export interface IUserAccount {
  id:number,
  created_at?:string
  username: string;
  role: string;
  email: string;
  cell: string;
  userid:string;
  units:number[];
};

export interface IOwner{
  email: string;
  cell: string;
  firstname: string;
  lastname: string;
  street:string;
  csz:string;
}


