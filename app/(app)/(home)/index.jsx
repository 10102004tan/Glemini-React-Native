import { useAuthContext } from "@/contexts/AuthContext";
import StudentHomeScreen from "../student_home_screen";
import CreateQuizzScreen from "../teacher_home_screen";

export default function HomeScreen() {
  const {userData} = useAuthContext()
 
  return (
    userData.user_type === 'student' ? <StudentHomeScreen/> : <CreateQuizzScreen/>
  );
}
