import { BodyNode, DomNode, el } from "@hanul/skynode";
import { View, ViewParams } from "skyrouter";
import { utils } from "ethers";
import CommonUtil from "../CommonUtil";
import GaiaOperationContract from "../contracts/GaiaOperationContract";
import Wallet from "../klaytn/Wallet";
import ExtWallet from "../klaytn/ExtWallet";

export default class Landing implements View {

  private TODAY_COUNT = 10000;

  private container: DomNode;
  private interval: any;

  private klayBalance: DomNode;
  private whitelistCount: DomNode;
  private mintCount: DomNode;
  private mintStatus: DomNode;
  private walletAddress: DomNode;
  private bar: DomNode;

  constructor() {
    document.title = "Gaia Protocol";

    BodyNode.append(
      (this.container = el(".home-view",
        el("h1", "Gaia Protocol"),
        el(".price", "Mint Price: 1,000 KLAY"),
        el("img.earth", { src: "images/earth.png", alt: "earth" }),
        el(".mint-info",
          this.mintStatus = el(".progress-text"),
          this.mintCount = el(".progress-text"),
        ),
        el(".progress",
          this.bar = el(".progress__bar"),
          el(".bar-step",
            el(".label", "Whitelist"),
            el(".percent", "4,000"),
            el(".line"),
          ),
        ),
        el(".info",
          el(".caption", "ADDRESS"),
          this.walletAddress = el("p"),
          el(".caption", "YOUR KLAY"),
          this.klayBalance = el("p"),
          el(".caption", "YOUR WHITE LIST"),
          this.whitelistCount = el("p"),
          el(".warning", "* 화이트 리스트는 트랜잭션당 5개, 퍼블릭의 경우 10개까지 가능합니다. *"),
        ),
        el("input", { placeholder: "MINT LIMIT", type: "number" }),
        el("button", "Mint Your Gods"),
        el(".sns",
          el("a", "GO TO HOMEPAGE", { href: "https://gaiaprotocol.com", target: "_blank" }),
          el("a", "GO TO OPENSEA", { href: "https://opensea.io", target: "_blank" }),
        ),
      ))
    );

    Wallet.on("connect", () => this.loadBalance());
    this.interval = setInterval(() => this.progress(), 1000);
  }

  private async loadBalance() {
    const address = await Wallet.loadAddress();
    if (address !== undefined) {
      this.walletAddress.empty().appendText(CommonUtil.shortenAddress(address));

      const balance = await ExtWallet.loadBalance();
      this.klayBalance.empty().appendText(utils.formatEther(balance!));

      const whitelist = 0;
      this.whitelistCount.empty().appendText(`${whitelist} 개`)
    }
  }

  private getStatus(): string {
    const STATUS = {
      Waiting: "민팅 대기중",
      WhitelistMinting: "화이트리스팅 민팅 중",
      PublicMinting: "퍼블릭 민팅 중",
      Ending: "민팅 종료",
    }

    let status: string;

    status = STATUS.Waiting;

    return status;
  }

  private async progress() {
    const status = this.getStatus();
    this.mintStatus.empty().appendText(status)

    const d = 0;
    this.bar.style({ width: `${d / this.TODAY_COUNT * 100}%` });
    this.mintCount.empty().appendText(`${d}/${this.TODAY_COUNT}`);
  }

  public changeParams(params: ViewParams, uri: string): void { }

  public close(): void {
    clearInterval(this.interval);
    this.container.delete();
  }
}
