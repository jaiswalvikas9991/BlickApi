import CarModel from '../Models/CarModel';
import GuestModel from '../Models/GuestModel';
import PhoneNumberModel from '../Models/PhoneNumberModel';

/*
    @Author(Vikas Jaiswal)
*/
export default class UserModel {
    public flatNo: number;
    public email: string;
    public password?: string;
    public cars?: CarModel[];
    public guests?: GuestModel[];
    public phoneNumbers?: PhoneNumberModel[];

    constructor(flatNo: number, email: string, password?: string, cars?: CarModel[], guests?: GuestModel[], phoneNumbers?: PhoneNumberModel[]) {
        this.flatNo = flatNo;
        this.email = email;
        this.password = password;
        this.cars = cars;
        this.guests = guests;
        this.phoneNumbers = phoneNumbers;
    }

    // static public fromMap = () : UserModel => {};

    public toMap(): {} {
        return (JSON.parse(JSON.stringify({
            flatNo: this.flatNo,
            email: this.email,
            password: this.password,
            cars: this.cars === undefined ? undefined : this.cars.map((car: CarModel) => car.toMap()),
            guests: this.guests === undefined ? undefined : this.guests.map((guest: GuestModel) => guest.toMap()),
            phoneNumbers: this.phoneNumbers === undefined ? undefined : this.phoneNumbers.map((phoneNumber: PhoneNumberModel) => phoneNumber.toMap())
        }
        )));
    }
}