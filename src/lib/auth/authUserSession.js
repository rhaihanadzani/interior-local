import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const AuthUserSession = async () => {
  const user = await getServerSession(authOptions);
  // console.log(user);

  return user;
};
