import MainLayout from '@/components/layouts/MainLayout';
import { Text, View } from 'react-native';
import TeacherView from '../(classroom)/teacher_view';
const Classroom = () => {
  return (
    <MainLayout>
      <TeacherView />
    </MainLayout>
  );
};
export default Classroom;
