import { IProfile } from '../interfaces/iprofile';
import { IVehicle } from '../interfaces/ivehicle';
import { IUnit } from '../interfaces/iunit';
import { IProfileLongUpdate } from './iprofile-long-update';


export interface IData {
	event:string|null;
	from:string|null;
	to:string|null;

	email?:string|null;
	password?:string|null;
	unit?:string|null;
	other?:string|null;
	bool?: boolean;
	profiles?:IProfile[];
	vehicles?:IVehicle[];
	iUnit?:IUnit;
	iUnits?:IUnit[];
	iProfileUpdate?:IProfileLongUpdate;
}
