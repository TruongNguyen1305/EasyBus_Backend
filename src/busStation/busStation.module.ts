import { Module } from "@nestjs/common";
import { BusStationController } from "./busStation.controller";
import { BusStationService } from "./busStation.service";

@Module({
    controllers: [BusStationController],
    providers: [BusStationService]
})
export class BusStationModule {}