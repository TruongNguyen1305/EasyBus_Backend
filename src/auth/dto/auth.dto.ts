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
    fullName: string
}

export {SignInDto, SignUpDto}