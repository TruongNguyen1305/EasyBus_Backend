import { Controller, Post, HttpCode, Body } from "@nestjs/common";
import { RouteService } from "./route.service";


@Controller('routes')
export class RouteController {
    constructor(private routeService: RouteService){}

    @HttpCode(201)
    @Post()
    createRoute(@Body() dto: any){
        return this.routeService.createRoute(dto)
    }
}