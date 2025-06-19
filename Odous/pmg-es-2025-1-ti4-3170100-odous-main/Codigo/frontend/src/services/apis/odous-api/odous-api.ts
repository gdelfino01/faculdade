import AxiosApiInstance from '../../axios-api-instance';

import UsersService from './users/users-api';
import MaterialsService from './materials/materials-api';
import MaterialLots from './material-lots/material-lots-api';
import RawMaterials from './raw-materials/raw-materials-api';
import SemiFinishedsFamilies from './semifinished-families/semifinished-families-api';
import SemiFinisheds from './semifinisheds/semifinisheds-api';
import SemifinishedProductionOrdersService from './semifinished-production-orders/semifinished-production-orders-api';
import SemifinishedLotsService from './semifinished-lots/semifinished-lots-api';
import FinishedsService from './finisheds/finisheds-api';
import AnvisaRegistersService from './anvisa-registers/anvisa-registers-api';
import FinishedProductionOrdersService from './finished-production-orders/finished-production-orders-api';
import FinishedLotsService from './finished-lots/finished-lots-api';

export default class OdousApi {
    private readonly client: AxiosApiInstance;
    public users: UsersService;
    public materials: MaterialsService;
    public materialLots: MaterialLots;
    public rawMaterials: RawMaterials
    public semiFinishedFamilies: SemiFinishedsFamilies;
    public semiFinisheds: SemiFinisheds;
    public semifinishedProductionOrders: SemifinishedProductionOrdersService;
    public semifinishedLots: SemifinishedLotsService;
    public finisheds: FinishedsService;
    public anvisaRegisters: AnvisaRegistersService
    public finishedProductionOrders: FinishedProductionOrdersService;
    public finishedLots: FinishedLotsService;

    constructor(client?: AxiosApiInstance) {
        this.client = client || new AxiosApiInstance("http://localhost:3000");

        this.users = new UsersService(this.client);
        this.materials = new MaterialsService(this.client);
        this.materialLots = new MaterialLots(this.client);
        this.rawMaterials = new RawMaterials(this.client);
        this.semiFinishedFamilies = new SemiFinishedsFamilies(this.client);
        this.semiFinisheds = new SemiFinisheds(this.client);
        this.semifinishedProductionOrders = new SemifinishedProductionOrdersService(this.client);
        this.semifinishedLots = new SemifinishedLotsService(this.client);
        this.finisheds = new FinishedsService(this.client);
        this.anvisaRegisters = new AnvisaRegistersService(this.client);
        this.finishedProductionOrders = new FinishedProductionOrdersService(this.client);
        this.finishedLots = new FinishedLotsService(this.client);
    }
}