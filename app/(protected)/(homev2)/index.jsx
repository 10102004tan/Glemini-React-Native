
import MainLayout from "@/components/layouts/MainLayout";
import { useAuthStore } from "@/store/useAuthStore";
import HomeStudent from "@/components/customs/HomeStudent";
import HomeTeacher from "@/components/customs/HomeTeacher";


export default function Home() {
  const {user} = useAuthStore();
  console.log("[Home Activity] user: ", user);
  return (
    <MainLayout>
      {
        user.user_role === "user" ? (
          <HomeStudent />
        ) : (<HomeTeacher />)
      }
    </MainLayout>
  )
}

