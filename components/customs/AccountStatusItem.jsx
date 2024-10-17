import { useState } from 'react';
import { Text, View } from 'react-native';
import {useAppProvider} from "@/contexts/AppProvider";

export default function AccoutntStatusItem({ status = '' }) {
	const {i18n} = useAppProvider();
	let text;
	let color;
	if (status === 'active') {
		text = i18n.t("status.active");
		color = 'bg-green-500';
	} else if (status === 'pedding') {
		text = i18n.t("status.pedding");
		color = 'bg-yellow-500';
	} else {
		text = i18n.t("status.reject");
		color = 'bg-red-500';
	}
	return (
		<View className="flex flex-row gap-2 items-center">
			<View className={'w-[10px] h-[10px] rounded-full ' + color}></View>
			<Text className="text-[12px]">{text}</Text>
		</View>
	);
}
