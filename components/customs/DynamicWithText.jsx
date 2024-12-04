import React, { useState } from 'react';
import { View, Text } from 'react-native';

const DynamicWidthText = ({ content,props }) => {
    const [textWidth, setTextWidth] = useState(0);

    return (
        <Text
            {...props}
            className={"bg-gray"}
            onLayout={(e) => {
                setTextWidth(e.nativeEvent.layout.width);
            }}
            style={{ width: textWidth }}
        >
            {content}
        </Text>
    );
};

export default DynamicWidthText;