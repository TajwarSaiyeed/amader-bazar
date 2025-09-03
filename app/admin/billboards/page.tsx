import MaxWidthWrapper from "@/components/max-width-wrapper";
import prisma from "@/lib/prisma";
import { dateFormatted } from "@/lib/utils";
import {
  BillboardClient,
  BillboardColumn,
} from "@/app/admin/billboards/components";

export const revalidate = 0;

const BillboardsPage = async () => {
  const billboards = await prisma.billboard.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      name: billboard.name,
      createdAt: dateFormatted(billboard.createdAt),
    })
  );

  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <BillboardClient data={formattedBillboards} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export const dynamic = "force-dynamic";

export default BillboardsPage;
