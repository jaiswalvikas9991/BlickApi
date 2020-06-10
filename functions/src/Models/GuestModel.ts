import CarModel from '../Models/CarModel';

export default class GuestModel {
    public car: CarModel;
    public createdOn: Date;
    constructor(car: CarModel, createdOn: Date) {
        this.car = car;
        this.createdOn = createdOn;
    }
    toMap = () : {} => {
        return({
            car : this.car.toMap,
            createdOn : this.createdOn
        });
    };
}