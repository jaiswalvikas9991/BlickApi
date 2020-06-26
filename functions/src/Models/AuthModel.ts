export class UserAuthModel {
    public readonly email: string;
    public readonly password: string;
    public readonly buildingId?: string;
    public readonly flatId?: string;
    constructor(email: string, password: string, buildingId?: string, flatId?: string) {
        this.email = email;
        this.password = password;
        this.buildingId = buildingId;
        this.flatId = flatId;
    }

    public get toMap(): {} {
        return (
            {
                email: this.email,
                password: this.password,
                buildingId: this.buildingId,
                flatId: this.flatId
            }
        );
    }

    public log = () => {
        console.table(this.toMap);
    };
}