import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsString, IsPhoneNumber, IsOptional } from "class-validator";

class ProfileDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    fullName: string

    @IsOptional()
    @IsPhoneNumber('VI')
    phone: string

    @IsOptional()
    @IsBoolean()
    gender: boolean

    @IsOptional()
    @IsDateString()
    birthdate?: string
}

export {ProfileDto}