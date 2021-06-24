export interface IRoomAdd {
    id: string;
    emailAddress: string;
    displayName: string;
    phone?: string;
    capacity: number;
    building?: string;
}