import MaxWidthWrapper from "@/components/max-width-wrapper";
import { CategoryForm } from "./components/category-form";
import prisma from "@/lib/prisma";

type CategoryPageProps = {
  params: Promise<{
    categoryId: string;
  }>;
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { categoryId } = await params;

  let category;
  if (categoryId === "new") {
    category = null;
  } else {
    category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  }

  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <CategoryForm initialData={category} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export const dynamic = "force-dynamic";

export default CategoryPage;
