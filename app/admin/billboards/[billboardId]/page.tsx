import MaxWidthWrapper from "@/components/max-width-wrapper";
import { BillBoardForm } from "./components/billboard-form";
import prisma from "@/lib/prisma";

type BillboardPageProps = {
  params: Promise<{
    billboardId: string;
  }>;
};

const BillboardPage = async ({ params }: BillboardPageProps) => {
  const { billboardId } = await params;

  let billboard;
  if (billboardId === "new") {
    billboard = null;
  } else {
    billboard = await prisma.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });
  }
  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <BillBoardForm initialData={billboard} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export const dynamic = "force-dynamic";

export default BillboardPage;
