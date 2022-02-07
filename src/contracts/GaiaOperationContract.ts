import Config from "../Config";
import GaiaOperationArtifact from "./abi/artifacts/contracts/GaiaOperation.sol/GaiaOperation.json";
import Contract from "./Contract";

class GaiaOperationContract extends Contract {

    constructor() {
        super(Config.contracts.GaiaOperation, GaiaOperationArtifact.abi);
    }

    public async whitelistSale(): Promise<boolean> {
        return await this.runMethod("whitelistSale");
    }

    public async publicSale(): Promise<boolean> {
        return await this.runMethod("publicSale");
    }
}

export default new GaiaOperationContract();
