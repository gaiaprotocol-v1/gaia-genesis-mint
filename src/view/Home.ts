import { BodyNode, DomNode, el } from "@hanul/skynode";
import { utils } from "ethers";
import msg from "msg.js";
import { View, ViewParams } from "skyrouter";
import BrowserInfo from "../BrowserInfo";
import CommonUtil from "../CommonUtil";
import Alert from "../component/dialogue/Alert";
import GaiaNFTContract from "../contracts/GaiaNFTContract";
import GaiaOperationContract from "../contracts/GaiaOperationContract";
import Klaytn from "../klaytn/Klaytn";
import Wallet from "../klaytn/Wallet";

export default class Landing implements View {

    private TODAY_COUNT = 9999;

    private STATUS = {
        Waiting: msg("MINT_STATUS_TITLE1"),
        WhitelistMinting: msg("MINT_STATUS_TITLE2"),
        PublicMinting: msg("MINT_STATUS_TITLE3"),
        Ending: msg("MINT_STATUS_TITLE4"),
    };

    private status = "";

    private container: DomNode;
    private interval: any;

    private klayBalance: DomNode;
    private whitelistCount: DomNode;
    private mintCount: DomNode;
    private mintStatus: DomNode;
    private walletAddress: DomNode;
    private bar: DomNode;

    private countInput: DomNode<HTMLInputElement>;

    constructor() {
        document.title = "Gaia Protocol";
        let select: DomNode<HTMLSelectElement>;

        BodyNode.append(
            (this.container = el(".home-view",
                el("h1", msg("TITLE")),
                el(".price", msg("MINT_PRICE_TITLE")),
                select = el("select.language-select",
                    el("option", "한국어 🇰🇷 ", { value: "ko" }),
                    el("option", "English 🇺🇸 ", { value: "en" }),
                    {
                        change: () => {
                            BrowserInfo.changeLanguage(select.domElement.value);
                        },
                    },
                ),
                el("img.earth", { src: "images/earth.png", alt: "earth" }),
                el(".mint-info",
                    this.mintStatus = el(".progress-text"),
                    this.mintCount = el(".progress-text"),
                ),
                el(".progress",
                    this.bar = el(".progress__bar"),
                    el(".bar-step",
                        el(".label", msg("WHITELIST_TITLE")),
                        el(".percent", "4,000"),
                        el(".line"),
                    ),
                ),
                el(".info",
                    el(".caption", msg("ADDRESS_TITLE")),
                    this.walletAddress = el("p"),
                    el(".caption", msg("KLAY_AMOUNT_TITLE")),
                    this.klayBalance = el("p"),
                    el(".caption", msg("WHITELIST_TITLE")),
                    this.whitelistCount = el("p"),
                    el(".warning", msg("WHITELIST_DESC")),
                ),
                this.countInput = el("input", { placeholder: msg("MINT LIMIT"), type: "number" }),
                el("button", msg("MINT_BUTTON"), {
                    click: async () => {
                        let count = parseInt(this.countInput.domElement.value, 10);
                        if (isNaN(count)) { count = 1; }
                        if (this.status === this.STATUS.WhitelistMinting) {
                            await GaiaOperationContract.mintGaiaNFTWithWhitelist(count);
                        } else if (this.status === this.STATUS.PublicMinting) {
                            await GaiaOperationContract.mintGaiaNFT(count);
                        } else {
                            new Alert("오류", "현재 민팅중이 아닙니다.");
                        }
                    },
                }),
                el(".sns",
                    el("a", msg("HOMEPAGE_BUTTON"), { href: "https://gaiaprotocol.com", target: "_blank" }),
                    el("a", msg("OPENSEA_BUTTON"), { href: "https://opensea.io", target: "_blank" }),
                ),
            ))
        );

        select.domElement.value = BrowserInfo.language;
        Wallet.on("connect", () => this.loadBalance());
        this.interval = setInterval(() => this.progress(), 1000);
    }

    private async loadBalance() {
        const address = await Wallet.loadAddress();
        if (address !== undefined) {
            this.walletAddress.empty().appendText(CommonUtil.shortenAddress(address));

            const balance = await Klaytn.balanceOf(address);
            this.klayBalance.empty().appendText(utils.formatEther(balance!));

            const whitelist = await GaiaOperationContract.whitelistTickets(address);
            this.whitelistCount.empty().appendText(`${whitelist}`)
        }
    }

    private async loadStatus() {
        if (await GaiaOperationContract.whitelistSale() === true) {
            this.status = this.STATUS.WhitelistMinting;
        } else if (await GaiaOperationContract.publicSale() === true) {
            this.status = this.STATUS.PublicMinting;
        } else if ((await GaiaNFTContract.totalSupply()).eq(10000)) {
            this.status = this.STATUS.Ending;
        } else {
            this.status = this.STATUS.Waiting;
        }
        this.mintStatus.empty().appendText(this.status);
    }

    private async progress() {

        this.loadStatus();
        this.loadBalance();

        const d = (await GaiaNFTContract.totalSupply()).toNumber() - 1;
        this.bar.style({ width: `${d / this.TODAY_COUNT * 100}%` });
        this.mintCount.empty().appendText(`${d}/${this.TODAY_COUNT}`);
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        clearInterval(this.interval);
        this.container.delete();
    }
}
