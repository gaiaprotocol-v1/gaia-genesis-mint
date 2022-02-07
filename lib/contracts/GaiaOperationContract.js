"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const Config_1 = __importDefault(require("../Config"));
const Klaytn_1 = __importDefault(require("../klaytn/Klaytn"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
const GaiaOperation_json_1 = __importDefault(require("./abi/artifacts/contracts/GaiaOperation.sol/GaiaOperation.json"));
const Contract_1 = __importDefault(require("./Contract"));
const GaiaNFTContract_1 = __importDefault(require("./GaiaNFTContract"));
class GaiaOperationContract extends Contract_1.default {
    constructor() {
        super(Config_1.default.contracts.GaiaOperation, GaiaOperation_json_1.default.abi);
    }
    async whitelistSale() {
        return await this.runMethod("whitelistSale");
    }
    async publicSale() {
        return await this.runMethod("publicSale");
    }
    async whitelistTickets(user) {
        return ethers_1.BigNumber.from(await this.runMethod("whitelistTickets", user));
    }
    async gaiaPrice() {
        return ethers_1.BigNumber.from(await this.runMethod("gaiaPrice"));
    }
    async mintGaiaNFTWithWhitelist(count) {
        const address = await Wallet_1.default.loadAddress();
        if (address !== undefined) {
            const totalSupply = (await GaiaNFTContract_1.default.totalSupply()).toNumber();
            const whitelist = (await this.whitelistTickets(address)).toNumber();
            if (count > 4001 - totalSupply) {
                alert(`남은 개수는 ${4001 - totalSupply}개입니다.`);
            }
            else if (count > whitelist) {
                alert(`남은 화이트리스팅 티켓 개수는 ${whitelist}개입니다.`);
            }
            else {
                const price = (await this.gaiaPrice()).mul(count);
                const balance = await Klaytn_1.default.balanceOf(address);
                if (balance.lt(price)) {
                    alert("Klay가 부족합니다.");
                }
                else {
                    await this.runWalletMethodWithValue(price, "mintGaiaNFTWithWhitelist", count);
                }
            }
        }
    }
    async mintGaiaNFT(count) {
        const address = await Wallet_1.default.loadAddress();
        if (address !== undefined) {
            const totalSupply = (await GaiaNFTContract_1.default.totalSupply()).toNumber();
            if (count > 10000 - totalSupply) {
                alert(`남은 개수는 ${10000 - totalSupply}개입니다.`);
            }
            else {
                const price = (await this.gaiaPrice()).mul(count);
                const balance = await Klaytn_1.default.balanceOf(address);
                if (balance.lt(price)) {
                    alert("Klay가 부족합니다.");
                }
                else {
                    await this.runWalletMethodWithValue(price, "mintGaiaNFT", count);
                }
            }
        }
    }
}
exports.default = new GaiaOperationContract();
//# sourceMappingURL=GaiaOperationContract.js.map