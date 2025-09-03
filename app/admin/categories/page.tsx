import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getAllCategories } from "@/actions/category.actions";
import { dateFormatted } from "@/lib/utils";
import { CategoryClient, CategoryColumn } from "./components";

export const revalidate = 0;

const CategoriesPage = async () => {
  const categories = await getAllCategories();

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    createdAt: dateFormatted(category.createdAt),
  }));

  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <CategoryClient data={formattedCategories} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export const dynamic = "force-dynamic";

export default CategoriesPage;
