import { FavouriteService } from './favourite.service';
export declare class FavouriteController {
    private readonly favouriteService;
    constructor(favouriteService: FavouriteService);
    findAllStation(userId: string): Promise<string[]>;
    findAllBus(userId: string): Promise<string[]>;
    updateStation(userId: string, id: string): Promise<string[]>;
    updateBus(userId: string, id: string): Promise<string[]>;
}
