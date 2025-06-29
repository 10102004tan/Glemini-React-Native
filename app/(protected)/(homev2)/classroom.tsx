import MainLayout from '@/components/layouts/MainLayout';
import StudentView from '../(classroom)/student_view';
import TeacherView from '../(classroom)/teacher_view';
import LockFeature from '@/components/customs/LockFeature';
import { useAuthStore } from '@/store/useAuthStore';

const Classroom = () => {

  const { user } = useAuthStore()
  
  let content = null;

  if (user?.user_role === 'user') {
    content = <StudentView />;
  } else if (user?.user_role === 'teacher') {
    if (user?.status_teacher_verified === 'pending' || user?.status_teacher_verified === 'inactive') {
      content = <LockFeature />;
    } else {
      content = <TeacherView />;
    }
  }

  return (
    <MainLayout>
      {content}
    </MainLayout>
  );
};

export default Classroom;
