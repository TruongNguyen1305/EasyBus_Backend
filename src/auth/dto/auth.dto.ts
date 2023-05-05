import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsDateString } from "class-validator";

class SignInDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsString()
    phone?: string

    @IsBoolean()
    @IsNotEmpty()
    gender: boolean

    @IsDateString()
    @IsNotEmpty()
    birthdate: Date
}

export {SignInDto, SignUpDto}