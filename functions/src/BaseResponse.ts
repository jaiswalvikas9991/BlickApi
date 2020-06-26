export default class BaseResponse {
    public status: number;
    public data: any[];
    public errors: any[];
    constructor(status: number, data: any[] = [], errors: any[] = []) {
        this.status = status;
        this.data = data;
        this.errors = errors;
    }

    public get toMap(): { status: number, data: any[], errors: any[] } {
        return (
            {
                status: this.status,
                data: this.data,
                errors: this.errors
            }
        );
    }

}