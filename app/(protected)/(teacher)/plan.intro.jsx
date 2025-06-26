import MainLayout from '@/components/layouts/MainLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { FlatList, ScrollView } from 'react-native';
import { Pressable } from 'react-native';
import { Image, Text, View } from 'react-native';

const PlanIntro = () => {
  const resourceAndFeatures = [
    {
      id: 1,
      icon: require('@/assets/images/planteacher.webp'),
      name: 'Classroom Management',
    },
    {
      id: 2,
      icon: require('@/assets/images/planteacher.webp'),
      name: 'Student Progress Tracking',
    },
    {
      id: 3,
      icon: require('@/assets/images/planteacher.webp'),
      name: 'Customizable Lesson Plans',
    },
    {
      id: 4,
      icon: require('@/assets/images/planteacher.webp'),
      name: 'Interactive Quizzes and Assignments',
    },
  ];
  return (
    <MainLayout>
      <Stack.Screen
        options={{
          headerTitle: 'Plan',
        }}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* box */}
        <LinearGradient
          colors={['#422074', '#7b4397', '#dc2430']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBox}
        >
          <Image source={require('@/assets/images/planteacher.webp')} style={styles.image} />
          <Text style={styles.title}>Start a teacher plan</Text>
          <Text style={styles.desc}>
            Get classroom management, student progress tracking, and more.
          </Text>
          <Pressable
            onPress={() => router.push('/(protected)/(teacher)/verify')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </LinearGradient>

        {/* resource, features */}
        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: '#868686',
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            What you get with a Teacher Plan ?
          </Text>

          <View
            style={{
              overflow: 'hidden',
              borderRadius: 10,
              backgroundColor: '#fff',
              borderWidth: 2,
              borderColor: '#ddd',
            }}
          >
            {resourceAndFeatures.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  borderBottomWidth: 2,
                  paddingHorizontal: 20,
                  borderColor: '#ddd',
                  gap: 10,
                  paddingVertical: 20,
                }}
              >
                <Image source={item.icon} style={{ width: 60, height: 60, marginRight: 10 }} />
                <Text
                  style={{
                    fontSize: 18,
                    color: '#333',
                    fontWeight: 'bold',
                    flexWrap: 'wrap',
                    flex: 1,
                  }}
                >
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = {
  gradientBox: {
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  desc: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    borderBottomWidth: 4,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#ddd',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#000437',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
};

export default PlanIntro;
