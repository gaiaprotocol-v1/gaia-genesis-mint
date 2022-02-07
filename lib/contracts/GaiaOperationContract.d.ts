import { BigNumber } from "ethers";
import Contract from "./Contract";
declare class GaiaOperationContract extends Contract {
    constructor();
    whitelistSale(): Promise<boolean>;
    publicSale(): Promise<boolean>;
    whitelistTickets(user: string): Promise<BigNumber>;
    gaiaPrice(): Promise<BigNumber>;
    mintGaiaNFTWithWhitelist(count: number): Promise<void>;
    mintGaiaNFT(count: number): Promise<void>;
}
declare const _default: GaiaOperationContract;
export default _default;
//# sourceMappingURL=GaiaOperationContract.d.ts.map