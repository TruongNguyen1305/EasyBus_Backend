import { Controller, Post, Body, HttpCode, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto, SignUpDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @HttpCode(201)
    @Post()
    signup(@Body() dto: SignUpDto){
        return this.authService.signup(dto)
    }

    @HttpCode(200)
    @Post("login")
    signin(@Body() dto: SignInDto) {
        return this.authService.signin(dto)
    }
}