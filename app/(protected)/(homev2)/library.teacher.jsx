import MyCollection from '@/components/customs/MyCollection';
import MyLibrary from '@/components/customs/MyLibrary';
import MainLayout from '@/components/layouts/MainLayout';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

const Library = () => {
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'black' }}
      style={{ backgroundColor: 'white' }}
      activeColor="#000"
      inactiveColor="#000"
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: '#000', fontWeight: focused ? 'bold' : 'normal', fontSize: 14 }}>
          {route.title}
        </Text>
      )}
    />
  );
  return (
    <TabView
      navigationState={{
        index: 0,
        routes: [
          { key: 'library', title: 'Thư viện của tôi' },
          { key: 'collection', title: 'Collection' },
        ],
      }}
      renderScene={({ route }) => {
        switch (route.key) {
          case 'library':
            return <MyLibrary />;
          case 'collection':
            return <MyCollection />;
          default:
            return null;
        }
      }}
      renderTabBar={renderTabBar}
      onIndexChange={(index) => console.log('Index changed to:', index)}
      style={{ flex: 1, paddingTop: 20 }}
    />
  );
};

export default Library;
