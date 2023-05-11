import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RouteService {
    constructor(private prisma: PrismaService) {}

    // async createRoute(dto: any){
    //     const {busStations} = dto
    //     const querys = []
    //     busStations.forEach((busStation: any) => {
    //         querys.push({
    //             where: {
    //                 code: busStation.code
    //             },
    //             create: {
    //                 ...busStation
    //             }
    //         })
    //     });
    //     const route = await this.prisma.route.create({
    //         data: {
    //             routeName: dto.routeName,
    //             busNo: dto.busNo,
    //             startTime: dto.startTime,
    //             endTime: dto.endTime,
    //             minutes: dto.minutes,
    //             busStations: {
    //                 connectOrCreate: querys
    //             }
    //         },
    //         include: {
    //             busStations: true
    //         }
    //     })
    //     return route
    // }
}