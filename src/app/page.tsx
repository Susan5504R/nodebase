import { requireAuth } from "@/lib/auth-utils";

const Page = async() => {
  await requireAuth();
  return (
    <div>
      Hello World
    </div>
  )
};
export default Page;