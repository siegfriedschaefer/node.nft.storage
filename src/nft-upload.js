"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nft_storage_1 = require("nft.storage");
const mime_1 = __importDefault(require("mime"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;
async function storeNFT(modelPath, imagePath, name, description) {
    if (NFT_STORAGE_API_KEY !== undefined) {
        const image = await fileFromPath(imagePath);
        if (image !== undefined) {
            const model = await fileFromPath(modelPath);
            if (model !== undefined) {
                const nft = {
                    image,
                    name,
                    description,
                    properties: {
                        creators: [{ name: "mtvs4u" }],
                        type: "Item",
                        model,
                    }
                };
                const nftstorage = new nft_storage_1.NFTStorage({ token: NFT_STORAGE_API_KEY });
                return nftstorage.store(nft);
            }
        }
    }
    return undefined;
}
async function fileFromPath(filePath) {
    const content = await fs_1.default.promises.readFile(filePath);
    const type = mime_1.default.getType(filePath);
    if (type !== null)
        return new nft_storage_1.File([content], path_1.default.basename(filePath), { type });
    else
        return undefined;
}
async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 4) {
        console.error(`usage: ${process.argv[0]} ${process.argv[1]} <model> <image-path> <name> <description>`);
        process.exit(1);
    }
    const [model, imagePath, name, description] = args;
    const result = await storeNFT(model, imagePath, name, description);
    console.log(result);
}
main()
    .catch(err => {
    console.error(err);
    process.exit(1);
});
