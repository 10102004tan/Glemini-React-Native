import React from 'react'
import { ALERT_TYPE, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

function AlertNoti() {
    return (
        <AlertNotificationRoot>
            <View>
                // toast notification
                <Button
                    title={'toast notification'}
                    onPress={() =>
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Success',
                            textBody: 'Congrats! this is toast notification success',
                        })
                    }
                />
            </View>
        </AlertNotificationRoot>)

}

export default AlertNoti