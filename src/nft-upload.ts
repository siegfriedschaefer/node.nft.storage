
import { NFTStorage, File } from "nft.storage";
import mime from 'mime';
import fs from 'fs';
import path from 'path';

const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY

async function storeNFT(modelPath: string, imagePath: string, name: string, description: string)
{
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
                        creators: [{name : "mtvs4u"}],
                        type: "Item",
                        model,
                    }
                }

                const nftstorage = new NFTStorage({token: NFT_STORAGE_API_KEY});
                return nftstorage.store(nft);
            }
        }
    }
    return undefined;
}

async function fileFromPath(filePath: string) {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath);
    if (type !== null)
        return new File([content], path.basename(filePath), {type });
    else
        return undefined;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 4) {
        console.error(`usage: ${process.argv[0]} ${process.argv[1]} <name> <description> <model> <image-path>`);
        process.exit(1);
    }
    const [name, description, model, imagePath] = args;

    const result = await storeNFT(model, imagePath, name, description);
    console.log(result);
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

