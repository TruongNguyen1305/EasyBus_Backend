import { Controller, Get, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get('station')
  findAllStation(@GetUser('id') userId: string) {
    return this.favouriteService.findAllStation(userId);
  }

  @Get('bus')
  findAllBus(@GetUser('id') userId: string) {
    return this.favouriteService.findAllBus(userId);
  }

  @Patch('station/:id')
  addStation(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.favouriteService.addStation(userId, id);
  }

  @Patch('bus/:id')
  addBus(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.favouriteService.addBus(userId, id);
  }


  @Delete('station/:id')
  removeStation(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.favouriteService.removeStation(userId, id);
  }

  @Delete('bus/:id')
  removeBus(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.favouriteService.removeBus(userId, id);
  }
}
