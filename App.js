import React, {Component} from 'react';
import {AppRegistery, Text, View, Navigator,I18nManager} from 'react-native';
import Home from 'BusyApp/app/components/screens/Home.js'


import { YellowBox } from 'react-native';

export default class BusyApp extends Component{
	render(){
		YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
		I18nManager.allowRTL(false)
		return(
			<View>
				<Home/>
			
				</View>
		);
	}
}