"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FavouriteService = class FavouriteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        return user;
    }
    async findAllStation(userId) {
        const user = await this.getUser(userId);
        return user.favouriteStation;
    }
    async findAllBus(userId) {
        const user = await this.getUser(userId);
        return user.favouriteBus;
    }
    async updateStation(userId, id) {
        const user = await this.getUser(userId);
        if (user.favouriteStation.includes(id)) {
            user.favouriteStation = user.favouriteStation.filter(station => station !== id);
        }
        else {
            user.favouriteStation.push(id);
        }
        const newUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                favouriteStation: user.favouriteStation
            }
        });
        return newUser.favouriteStation;
    }
    async updateBus(userId, id) {
        const user = await this.getUser(userId);
        if (user.favouriteBus.includes(id)) {
            user.favouriteBus = user.favouriteBus.filter(station => station !== id);
        }
        else {
            user.favouriteBus.push(id);
        }
        const newUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                favouriteBus: user.favouriteBus
            }
        });
        return newUser.favouriteBus;
    }
};
FavouriteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavouriteService);
exports.FavouriteService = FavouriteService;
//# sourceMappingURL=favourite.service.js.map