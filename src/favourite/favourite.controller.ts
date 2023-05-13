import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
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

  @Post('station/:id')
  updateStation(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.favouriteService.updateStation(userId, id);
  }

  @Post('bus/:id')
  updateBus(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.favouriteService.updateBus(userId, id);
  }
}
