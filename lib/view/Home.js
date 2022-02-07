"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("@hanul/skynode");
class Landing {
    constructor() {
        document.title = "Gaia Protocol";
        skynode_1.BodyNode.append(this.container = (0, skynode_1.el)(".home-view", (0, skynode_1.el)("h1", "Gaia Protocol"), (0, skynode_1.el)("img.earth", { src: "images/earth.png", alt: "earth" }), (0, skynode_1.el)("button", "Mint Your God")));
    }
    changeParams(params, uri) { }
    close() {
        this.container.delete();
    }
}
exports.default = Landing;
//# sourceMappingURL=Home.js.map