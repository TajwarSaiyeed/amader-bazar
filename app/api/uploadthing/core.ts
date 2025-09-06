import { createUploadthing, type FileRouter } from "uploadthing/next";
import { requireAuth } from "@/lib/auth-utils";

const f = createUploadthing();

const requireAuthForUpload = async () => {
  const session = await requireAuth();
  return { userId: session.user.id };
};

export const ourFileRouter = {
  imageUrl: f({ image: { maxFileSize: "2MB" } })
    .middleware(() => requireAuthForUpload())
    .onUploadComplete(() => {}),
  productImages: f({ image: { maxFileSize: "2MB", maxFileCount: 4 } })
    .middleware(() => requireAuthForUpload())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
