import { BigNumber } from "ethers";
import Config from "../Config";
import Klaytn from "../klaytn/Klaytn";
import Wallet from "../klaytn/Wallet";
import GaiaOperationArtifact from "./abi/artifacts/contracts/GaiaOperation.sol/GaiaOperation.json";
import Contract from "./Contract";
import GaiaNFTContract from "./GaiaNFTContract";

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

    public async whitelistTickets(user: string): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("whitelistTickets", user));
    }

    public async gaiaPrice(): Promise<BigNumber> {
        return BigNumber.from(await this.runMethod("gaiaPrice"));
    }

    public async mintGaiaNFTWithWhitelist(count: number): Promise<void> {
        const address = await Wallet.loadAddress();
        if (address !== undefined) {
            const totalSupply = (await GaiaNFTContract.totalSupply()).toNumber();
            const whitelist = (await this.whitelistTickets(address)).toNumber();
            if (count > 4001 - totalSupply) {
                alert(`남은 개수는 ${4001 - totalSupply}개입니다.`);
            } else if (count > whitelist) {
                alert(`남은 화이트리스팅 티켓 개수는 ${whitelist}개입니다.`);
            } else {
                const price = (await this.gaiaPrice()).mul(count);
                const balance = await Klaytn.balanceOf(address);
                if (balance.lt(price)) {
                    alert("Klay가 부족합니다.");
                } else {
                    await this.runWalletMethodWithValue(price, "mintGaiaNFTWithWhitelist", count);
                }
            }
        }
    }

    public async mintGaiaNFT(count: number): Promise<void> {
        const address = await Wallet.loadAddress();
        if (address !== undefined) {
            const totalSupply = (await GaiaNFTContract.totalSupply()).toNumber();
            if (count > 10000 - totalSupply) {
                alert(`남은 개수는 ${10000 - totalSupply}개입니다.`);
            } else {
                const price = (await this.gaiaPrice()).mul(count);
                const balance = await Klaytn.balanceOf(address);
                if (balance.lt(price)) {
                    alert("Klay가 부족합니다.");
                } else {
                    await this.runWalletMethodWithValue(price, "mintGaiaNFT", count);
                }
            }
        }
    }
}

export default new GaiaOperationContract();
