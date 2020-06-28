import CarModel from '../Models/CarModel';
import GuestModel from '../Models/GuestModel';
import PhoneNumberModel from '../Models/PhoneNumberModel';

/*
    @Author(Vikas Jaiswal)
*/
export default class UserModel {
    public flatNo: string;
    public email: string;
    public cars?: CarModel[];
    public guests?: GuestModel[];
    public phoneNumbers?: PhoneNumberModel[];

    constructor(flatNo: string, email: string, cars?: CarModel[], guests?: GuestModel[], phoneNumbers?: PhoneNumberModel[]) {
        this.flatNo = flatNo;
        this.email = email;
        this.cars = cars;
        this.guests = guests;
        this.phoneNumbers = phoneNumbers;
    }

    // static public fromMap = () : UserModel => {};


    public get toMap(): {} {
        return (JSON.parse(JSON.stringify({
            flatNo: this.flatNo,
            email: this.email,
            cars: this.cars === undefined ? undefined : this.cars.map((car: CarModel) => car.toMap()),
            guests: this.guests === undefined ? undefined : this.guests.map((guest: GuestModel) => guest.toMap()),
            phoneNumbers: this.phoneNumbers === undefined ? undefined : this.phoneNumbers.map((phoneNumber: PhoneNumberModel) => phoneNumber.toMap())
        }
        )));
    }
}