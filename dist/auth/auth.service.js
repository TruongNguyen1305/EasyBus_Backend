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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signup(dto) {
        dto.password = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: Object.assign({}, dto)
            });
            const { access_token } = await this.signToken(user.id);
            delete user.password;
            return {
                user,
                access_token
            };
        }
        catch (error) {
            console.log(error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Credentials taken');
                }
            }
            throw new common_1.InternalServerErrorException("server error");
        }
    }
    async signin(dto) {
        try {
            console.log(dto);
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email
                }
            });
            if (user && await argon.verify(user.password, dto.password)) {
                const { access_token } = await this.signToken(user.id);
                delete user.password;
                return {
                    user,
                    access_token
                };
            }
            else {
                throw new common_1.ForbiddenException('Credentials incorrect');
            }
        }
        catch (error) {
            if (error.getStatus() === 403) {
                throw new common_1.ForbiddenException('Credentials incorrect');
            }
            throw new common_1.InternalServerErrorException("server error");
        }
    }
    async signToken(userId) {
        const payload = {
            userId
        };
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '30d',
            secret: this.config.get('JWT_SECRET')
        });
        return {
            access_token: token
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService, config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map