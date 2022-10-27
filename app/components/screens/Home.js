import React, {Component} from 'react';
import {AppRegistery, Text, View, StyleSheet,TextInput,TouchableOpacity,ScrollView,Dimensions,FlatList, WebView, Linking, StatusBar } from 'react-native';
import MainContainer from 'BusyApp/app/components/MainContainer.js'
import PHContainer from 'BusyApp/app/components/PHContainer.js'
import Checklist from 'BusyApp/app/components/lists/Checklist.js'
import Menu from 'BusyApp/app/components/actions/Menu.js'
import Adder from 'BusyApp/app/components/actions/Adder.js'
import renderIf from 'BusyApp/app/helpers/renderif.js'
import checklistData from 'BusyApp/app/data/checklistData.js'
import HelpComponent from '../HelpComponent';

export default class Home extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            <View>
                <StatusBar
                    backgroundColor="#FBFBFB"
                    barStyle="dark-content"
                />
                
                <MainContainer ref={'mainc'}></MainContainer>
                {/* <HelpComponent/> */}
               

            </View>
        );
	}
}
