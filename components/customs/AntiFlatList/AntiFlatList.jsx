import React, { Component } from "react";
import {View, Text, Dimensions, RefreshControl} from "react-native";
import {RecyclerListView, DataProvider, LayoutProvider, GridLayoutProvider} from "recyclerlistview";
import LayoutProviderCustom from "./LayoutProvider";
import LoadMoreFooter from "@/components/customs/LoadMoreFooter";
import { min } from "moment";


export default class AntiFlatList extends React.Component {
    constructor(args) {
        super(args);
        this.state = {
            dataProvider: new DataProvider((r1, r2) => {
                return r1 !== r2;
            }).cloneWithRows(this.props.data),
            loading: this.props.loading,
            refreshing: this.props.isRefreshing,
        };

        this._layoutProvider = new LayoutProviderCustom(this.props.colSpan);

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
        if (!this.props.componentItem){
            return <View style={{height: 1, width: 1}} />;
        }
        const ComponentItem = this.props.componentItem;
        return <ComponentItem data={data} />;
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
        return <RecyclerListView
            style={{
            minHeight:1,minWidth:1
            }}
            scrollViewProps={{
                refreshControl: (
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                )
            }}
            onEndReachedThreshold={0.5} renderFooter={this._renderFooter} onEndReached={this._onEndReached} layoutProvider={this._layoutProvider} dataProvider={this.state.dataProvider} rowRenderer={this._rowRenderer} />;
    }
}

