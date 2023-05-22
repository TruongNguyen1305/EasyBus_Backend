declare class ProfileDto {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    gender: boolean;
    birthdate?: string;
}
declare class ActivateTicketDto {
    type: string;
}
export { ProfileDto, ActivateTicketDto };
