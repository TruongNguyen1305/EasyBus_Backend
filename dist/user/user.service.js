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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateProfile(id, profile) {
        try {
            const userUpdated = await this.prisma.user.update({
                where: {
                    id
                },
                data: Object.assign({}, profile)
            });
            delete userUpdated.password;
            return userUpdated;
        }
        catch (error) {
            console.log(error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.BadRequestException('Credentials taken');
                }
            }
            throw new common_1.InternalServerErrorException("server error");
        }
    }
    async getAllTicket(userId) {
        try {
            const { remainTickets } = await this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    remainTickets: true
                }
            });
            const res = {
                normalTickets: 0,
                monthTickets: 0
            };
            remainTickets.forEach((ticket) => {
                if (ticket.type === client_1.TicketType.DAY) {
                    res.normalTickets += 1;
                }
                else {
                    res.monthTickets += 1;
                }
            });
            return res;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("server error");
        }
    }
    async getCurrentActiveTicket(userId) {
        try {
            const { currentActiveTicket } = await this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    currentActiveTicket: true
                }
            });
            return { currentActiveTicket };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("server error");
        }
    }
    async activateTicket(userId, dto) {
        try {
            let { remainTickets, currentActiveTicket } = await this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    remainTickets: true,
                    currentActiveTicket: true
                }
            });
            if (currentActiveTicket && currentActiveTicket.remainTurn > 0) {
                return {
                    statusCode: 400,
                    error: 'Bạn đang kích hoạt một vé khác!'
                };
            }
            else {
                let type = dto.type === 'day' ? client_1.TicketType.DAY : client_1.TicketType.MONTH;
                currentActiveTicket = remainTickets.find((ticket) => ticket.type === type);
                remainTickets = remainTickets.filter((ticket) => ticket !== currentActiveTicket);
                await this.prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        remainTickets,
                        currentActiveTicket
                    }
                });
                console.log('Successfully updated');
                return {
                    currentActiveTicket
                };
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("server error");
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map