"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("@hanul/skynode");
const ethers_1 = require("ethers");
const CommonUtil_1 = __importDefault(require("../CommonUtil"));
const GaiaNFTContract_1 = __importDefault(require("../contracts/GaiaNFTContract"));
const GaiaOperationContract_1 = __importDefault(require("../contracts/GaiaOperationContract"));
const Klaytn_1 = __importDefault(require("../klaytn/Klaytn"));
const Wallet_1 = __importDefault(require("../klaytn/Wallet"));
class Landing {
    constructor() {
        this.TODAY_COUNT = 9999;
        this.STATUS = {
            Waiting: "민팅 대기중",
            WhitelistMinting: "화이트리스팅 민팅 중",
            PublicMinting: "퍼블릭 민팅 중",
            Ending: "민팅 종료",
        };
        this.status = "";
        document.title = "Gaia Protocol";
        skynode_1.BodyNode.append((this.container = (0, skynode_1.el)(".home-view", (0, skynode_1.el)("h1", "Gaia Protocol"), (0, skynode_1.el)(".price", "Mint Price: 1,000 KLAY"), (0, skynode_1.el)("img.earth", { src: "images/earth.png", alt: "earth" }), (0, skynode_1.el)(".mint-info", this.mintStatus = (0, skynode_1.el)(".progress-text", "..."), this.mintCount = (0, skynode_1.el)(".progress-text", "...")), (0, skynode_1.el)(".progress", this.bar = (0, skynode_1.el)(".progress__bar"), (0, skynode_1.el)(".bar-step", (0, skynode_1.el)(".label", "Whitelist"), (0, skynode_1.el)(".percent", "4,000"), (0, skynode_1.el)(".line"))), (0, skynode_1.el)(".info", (0, skynode_1.el)(".caption", "ADDRESS"), this.walletAddress = (0, skynode_1.el)("p", "..."), (0, skynode_1.el)(".caption", "YOUR KLAY"), this.klayBalance = (0, skynode_1.el)("p", "..."), (0, skynode_1.el)(".caption", "YOUR WHITE LIST"), this.whitelistCount = (0, skynode_1.el)("p", "..."), (0, skynode_1.el)(".warning", "* 화이트 리스트는 트랜잭션당 5개, 퍼블릭의 경우 10개까지 가능합니다. *")), this.countInput = (0, skynode_1.el)("input", { placeholder: "MINT LIMIT (기본 1개)", type: "number" }), (0, skynode_1.el)("button", "Mint Your Gods", {
            click: async () => {
                let count = parseInt(this.countInput.domElement.value, 10);
                if (isNaN(count)) {
                    count = 1;
                }
                if (this.status === this.STATUS.WhitelistMinting) {
                    await GaiaOperationContract_1.default.mintGaiaNFTWithWhitelist(count);
                }
                else if (this.status === this.STATUS.PublicMinting) {
                    await GaiaOperationContract_1.default.mintGaiaNFT(count);
                }
            },
        }), (0, skynode_1.el)(".sns", (0, skynode_1.el)("a", "GO TO HOMEPAGE", { href: "https://gaiaprotocol.com", target: "_blank" }), (0, skynode_1.el)("a", "GO TO OPENSEA", { href: "https://opensea.io/collection/gaia-test", target: "_blank" })))));
        Wallet_1.default.on("connect", () => this.loadBalance());
        this.interval = setInterval(() => this.progress(), 1000);
    }
    async loadBalance() {
        const address = await Wallet_1.default.loadAddress();
        if (address !== undefined) {
            this.walletAddress.empty().appendText(CommonUtil_1.default.shortenAddress(address));
            const balance = await Klaytn_1.default.balanceOf(address);
            this.klayBalance.empty().appendText(ethers_1.utils.formatEther(balance));
            const whitelist = await GaiaOperationContract_1.default.whitelistTickets(address);
            this.whitelistCount.empty().appendText(`${whitelist} 개`);
        }
    }
    async loadStatus() {
        if (await GaiaOperationContract_1.default.whitelistSale() === true) {
            this.status = this.STATUS.WhitelistMinting;
        }
        else if (await GaiaOperationContract_1.default.publicSale() === true) {
            this.status = this.STATUS.PublicMinting;
        }
        else if ((await GaiaNFTContract_1.default.totalSupply()).eq(10000)) {
            this.status = this.STATUS.Ending;
        }
        else {
            this.status = this.STATUS.Waiting;
        }
        this.mintStatus.empty().appendText(this.status);
    }
    async progress() {
        this.loadStatus();
        this.loadBalance();
        const d = (await GaiaNFTContract_1.default.totalSupply()).toNumber() - 1;
        this.bar.style({ width: `${d / this.TODAY_COUNT * 100}%` });
        this.mintCount.empty().appendText(`${d}/${this.TODAY_COUNT}`);
    }
    changeParams(params, uri) { }
    close() {
        clearInterval(this.interval);
        this.container.delete();
    }
}
exports.default = Landing;
//# sourceMappingURL=Home.js.map