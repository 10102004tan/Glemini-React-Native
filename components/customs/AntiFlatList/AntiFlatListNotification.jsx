import React, { Component } from "react";
import {View, Text, Dimensions, RefreshControl} from "react-native";
import {RecyclerListView, DataProvider, LayoutProvider, GridLayoutProvider} from "recyclerlistview";
import LayoutProviderCustom from "./LayoutProvider";
import LoadMoreFooter from "@/components/customs/LoadMoreFooter";
import QuizEmpty from "@/components/customs/QuizEmpty";
import NotificationEmpty from "@/components/customs/NotificationEmpty";
import QuizItem from "@/components/customs/QuizItem";




export default class AntiFlatListNotification extends React.Component {
    constructor(args) {
        super(args);
        this.state = {
            dataProvider: new DataProvider((r1, r2) => {
                return r1 !== r2;
            }).cloneWithRows(this.props.data) || [],
            loading: this.props.loading || false,
            refreshing: this.props.isRefreshing || false,
        };

        this._layoutProvider = new LayoutProvider(index => {
            return this.state.dataProvider.getDataForIndex(index).noti_type;
        }, (type, dim) => {
            switch (type) {
                case "ROOM-001":
                    dim.width = Dimensions.get("window").width;
                    dim.height = 200;
                    break;
                case "SYS-001":
                    dim.width = Dimensions.get("window").width;
                    dim.height = 100;
                    break;
                case "SYS-002":
                    dim.width = Dimensions.get("window").width;
                    dim.height = 100;
                    break;
                case "SHARE-001":
                    dim.width = Dimensions.get("window").width;
                    dim.height = 150;
                    break;
                case "SHARE-002":
                    dim.width = Dimensions.get("window").width;
                    dim.height = 100;
                    break;
                case "CLASSROOM-001":
                    dim.width = Dimensions.get("window").width;
                    dim.height = 100;
                    break;
                default:
                    dim.width = 0;
                    dim.height = 0;
            }
        });

        this._rowRenderer = this._rowRenderer.bind(this);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                dataProvider: this.state.dataProvider.cloneWithRows(this.props.data),
            });
        }

        if (prevProps.loading !== this.props.loading) {
            this.setState({
                loading: this.props.loading,
            });
        }

        if (prevProps.isRefreshing !== this.props.isRefreshing) {
            this.setState({
                refreshing: this.props.isRefreshing,
            })
        }
    }

    _rowRenderer(type, data) {
       //
        if (!this.props.componentItem){
            return <View><Text>ComponentItem is required</Text></View>
        }

        const ComponentItem = this.props.componentItem;
        return <ComponentItem data={data}/>
    }

    _renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.loading) return null;
        return <LoadMoreFooter/>;
    }

    _onEndReached = () => {
        if (!this.props.loading) {
            this.props.handleLoadMore();
        }
    }

    _onRefresh = () => {
        if (!this.state.refreshing) {
            this.props.handleRefresh();
        }
    }


    render() {

        // empty data
        if (this.state.dataProvider.getSize() === 0) return <NotificationEmpty/>;

        return (
            <RecyclerListView
                style={{ minWidth: 1,
                    minHeight: 1,
                    height: "100%",
                }}
                scrollViewProps={{
                    refreshControl: (
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                    )
                }}
                onEndReachedThreshold={0.5} renderFooter={this._renderFooter} onEndReached={this._onEndReached} layoutProvider={this._layoutProvider} dataProvider={this.state.dataProvider} rowRenderer={this._rowRenderer} />
        )
    }
}

