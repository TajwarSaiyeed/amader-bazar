import { getUserById } from "@/actions/user.actions";
import { notFound } from "next/navigation";
import { UserDetailsContent } from "./components/user-details-content";

interface UserPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const UserPage = async ({ params }: UserPageProps) => {
  const { userId } = await params;
  const { success, user } = await getUserById(userId);

  if (!success || !user) {
    notFound();
  }

  return <UserDetailsContent user={user} />;
};

export default UserPage;
