import { FlatList, Text, View } from "react-native"
import { useDemoStore } from "@/store/useDemoStore";
import { useEffect } from "react";

const Demo = () => {
    const { banners,fetchBanners } = useDemoStore();

    useEffect(() => {
        fetchBanners();
    }, []);
    return (
        <View>
            <FlatList
                data={banners}
                renderItem={({ item }) => (
                    <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <Text>{item.quiz_name}</Text>
                    </View>
                )}
                keyExtractor={(item) => item._id.toString()}
            />
        </View>
    )
}
export default Demo