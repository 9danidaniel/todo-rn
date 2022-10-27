import React, {Component} from 'react';
import {AppRegistery, Text, View, StyleSheet,TextInput,TouchableOpacity,ScrollView,Dimensions,FlatList, WebView, Linking, StatusBar,Platform } from 'react-native';

import renderIf from 'BusyApp/app/helpers/renderif.js'

var { width, height } = Dimensions.get('window');

export default class HelpComponent extends Component {

    constructor(props){
        super(props);
    }

    returnHome = () => {
        this.props.hideHelp()
    }

    render(){
        return(
            <View style={styles.helpContainer}>
                <Text style={[styles.ptext, this.props.isTooled && styles.ptextAlt]}>Swipe to delete a task.</Text>
                <Text style={styles.pntext}>Press a task to edit it.</Text>
                <Text style={styles.pntext}>Long press a task to rearrange it.</Text>
                <Text style={styles.pntext}>After rearranged press the rearrange button to return to your list.</Text>
                <Text style={styles.pntext}>Click the X to clear your list.</Text>
                <Text style={styles.pntext}>Long press a list to edit it.</Text>

                <TouchableOpacity onPress={this.returnHome}>
                    <Text style={styles.pdtext}>Close</Text>
                </TouchableOpacity>

            </View>
        );
	}
}

const styles = StyleSheet.create({

    helpContainer: {
       
        backgroundColor: '#D4C2FC',
        position: 'absolute',
        width: width,
        height: height,
        //justifyContent: 'center',
        alignItems: 'center',
        padding: 25
    },
    ptext: {
        marginTop: 60,
        color: '#2C2C54',
        fontSize: 22,
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
        
      },
      ptextAlt: {
        marginTop: 90,
        color: '#2C2C54',
        fontSize: 22,
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
        
      },
    pntext: {
        marginTop: 25,
        color: '#2C2C54',
        fontSize: 22,
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
        textAlign: 'center'
        
      },
    pdtext: {
        marginTop: 50,
        color: '#2C2C54',
        fontSize: 22,
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
      }


})
