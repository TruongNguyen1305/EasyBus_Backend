import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
  
export class FavouriteService {
  constructor(private prisma: PrismaService) {}
 
  async getUser(userId: string) { 
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    return user 
  }

  async findAllStation(userId: string) {
    const user = await this.getUser(userId)
    return user.favouriteStation
  }

  async findAllBus(userId: string) {
    const user = await this.getUser(userId)
    return user.favouriteBus
  }

  async updateStation(userId: string, id: string) {
    const user = await this.getUser(userId)
    if (user.favouriteStation.includes(id)) {
      user.favouriteStation = user.favouriteStation.filter(station => station !== id)
    }
    else {
      user.favouriteStation.push(id)
    }
    const newUser = await this.prisma.user.update({
      where: {
        id: userId
      },  
      data: {
        favouriteStation: user.favouriteStation
      }
    })

    return newUser.favouriteStation
  }

  async updateBus(userId: string, id: string) {
    const user = await this.getUser(userId)
    if (user.favouriteBus.includes(id)) {
      user.favouriteBus = user.favouriteBus.filter(station => station !== id)
    }
    else {
      user.favouriteBus.push(id)
    }
    const newUser = await this.prisma.user.update({
      where: {
        id: userId
      },  
      data: {
        favouriteBus: user.favouriteBus
      }
    })

    return newUser.favouriteBus
  }
}
