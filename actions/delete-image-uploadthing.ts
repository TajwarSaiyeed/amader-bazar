import {UTApi} from "uploadthing/server";

export const deleteImageUploadthings = async (image: string | string[]) => {
    const ut = new UTApi();
    if (Array.isArray(image)) {
        if (image.length === 0) {
            return Response.json({message: "No image found"})
        }
        await ut.deleteFiles(image.map((img) => img.split("/").pop() as string));

        return Response.json({message: "ok"})
    }
    const imgName = image?.split("/").pop();
    if (!imgName) {
        return Response.json({message: "No image found"})
    }
    await ut.deleteFiles(imgName);
    return Response.json({message: "ok"})
}