export default class CarModel {
    public carNumber: string;
    public createdOn: Date;
    constructor(carNumber : string, createdOn : Date) {
        this.carNumber = carNumber;
        this.createdOn = createdOn;
    }
    public toMap = () : {} => {
        return({
            carNumber : this.carNumber,
            createdOn : this.createdOn
        });
    };
}