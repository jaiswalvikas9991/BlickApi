export default class PhoneNumberModel {
    public phoneNumber: number;
    public createdOn: Date;
    constructor(phoneNumber: number, createdOn: Date) {
        this.phoneNumber = phoneNumber;
        this.createdOn = createdOn;
    }
    public toMap = () : {} => {
        return({
            phoneNumber : this.phoneNumber,
            createdOn : this.createdOn
        });
    };
}