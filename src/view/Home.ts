import { BodyNode, DomNode, el } from "@hanul/skynode";
import { View, ViewParams } from "skyrouter";

export default class Landing implements View {

  private container: DomNode;

  constructor() {
    document.title = "Gaia Protocol";

    BodyNode.append(
      (this.container = el(".home-view",
        el("h1", "Gaia Protocol"),
        el("img.earth", { src: "images/earth.png", alt: "earth" }),
        el("button", "Mint Your God"),
      ))
    );
  }

  public changeParams(params: ViewParams, uri: string): void { }

  public close(): void {
    this.container.delete();
  }
}
