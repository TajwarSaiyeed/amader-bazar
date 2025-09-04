import MaxWidthWrapper from "@/components/max-width-wrapper";
import { getAllUsers } from "@/actions/user.actions";
import { dateFormatted } from "@/lib/utils";
import { UserClient } from "./components";
import type { UserColumn } from "./components";

export const revalidate = 0;

const UsersPage = async () => {
  const users = await getAllUsers();

  const formattedUsers: UserColumn[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email || "",
    role: user.role,
    createdAt: dateFormatted(user.createdAt),
  }));

  return (
    <MaxWidthWrapper>
      <div className={"flex-col"}>
        <div className={"flex-1 space-y-4 p-8 pt-6"}>
          <UserClient data={formattedUsers} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default UsersPage;
