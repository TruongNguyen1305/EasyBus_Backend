import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
  
export class FavouriteService {
  constructor(private prisma: PrismaService) {}
 
  async findAllStation(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })

    return user.favouriteBus
  }

  async findAllBus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })

    return user.favouriteBus
  }

  async addStation(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    user.favouriteStation.push(id)

    return user.favouriteStation
  }

  async addBus(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    user.favouriteBus.push(id)

    return user.favouriteBus
  }
  
  async removeStation(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    const indexToDelete = user.favouriteStation.indexOf(id);
    
    if (indexToDelete !== -1) {
      user.favouriteStation.splice(indexToDelete, 1);
    }

    return user.favouriteStation
  }

  async removeBus(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    const indexToDelete = user.favouriteBus.indexOf(id);
    
    if (indexToDelete !== -1) {
      user.favouriteBus.splice(indexToDelete, 1);
    }

    return user.favouriteBus
  }


  // update(id: number) {
  //   return `This action updates a #${id} favourite`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} favourite`;
  // }
}
