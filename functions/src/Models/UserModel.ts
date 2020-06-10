import CarModel from '../Models/CarModel';
import GuestModel from '../Models/GuestModel';
import PhoneNumberModel from '../Models/PhoneNumberModel';

/*
    @Author(Vikas Jaiswal)
*/
export default class UserModel {
    public flatNo: number;
    public cars: CarModel[];
    public guests: GuestModel[];
    public phoneNumbers: PhoneNumberModel[];

    constructor(flatNo: number, cars?: CarModel[], guests?: GuestModel[], phoneNumbers?: PhoneNumberModel[]) {
        this.flatNo = flatNo;
        this.cars = cars??[];
        this.guests = guests??[];
        this.phoneNumbers = phoneNumbers??[];
    }

    // static public fromMap = () : UserModel => {};

    public toMap(): {} {
        return ({
            cars: this.cars.map((car: CarModel) => car.toMap()),
            guests: this.guests.map((guest: GuestModel) => guest.toMap()),
            phoneNumbers: this.phoneNumbers.map((phoneNumber: PhoneNumberModel) => phoneNumber.toMap())
        });
    }
}