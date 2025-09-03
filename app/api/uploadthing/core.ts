import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

const requireAuth = async () => {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return { userId: session.user.id };
};

export const ourFileRouter = {
  imageUrl: f({ image: { maxFileSize: "2MB" } })
    .middleware(() => requireAuth())
    .onUploadComplete(() => {}),
  productImages: f({ image: { maxFileSize: "2MB", maxFileCount: 4 } })
    .middleware(() => requireAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
