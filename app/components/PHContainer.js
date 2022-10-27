import React, {Component} from 'react';
import {AppRegistery, Text, View, StyleSheet,TextInput,TouchableOpacity,ScrollView,Dimensions,FlatList, WebView, Linking, StatusBar,Image,Platform,LayoutAnimation,
    Animated,Easing,AsyncStorage } from 'react-native';
import MainContainer from 'BusyApp/app/components/MainContainer.js'
import Checklist from 'BusyApp/app/components/lists/Checklist.js'
import Menu from 'BusyApp/app/components/actions/Menu.js'
import Adder from 'BusyApp/app/components/actions/Adder.js'
import renderIf from 'BusyApp/app/helpers/renderif.js'
import checklistData from 'BusyApp/app/data/checklistData.js'
import recentsData from 'BusyApp/app/data/recentsData.js'


var {height, width} = Dimensions.get('window');

var CustomLayoutSpring = {
    duration: 300,
    create: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: 0.7,
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.7,
    },
  };

export default class PHContainer extends Component {

    constructor(props){
        super(props);
        this.state ={
            isAddPressed: false,
            isCheckedPressed: false
        }
    }
    generateKey = (numberOfCharacters) => {
		return require('random-string')({length: numberOfCharacters});
    }


    async saveData(){
        try {
            await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(checklistData));
          } catch (error) {

          }
      }

    async saveRecentData(){
        try {
            await AsyncStorage.setItem('@recents', JSON.stringify(recentsData));
          } catch (error) {

          }
      }

    onAddPressed = () => {
        // this.setState({
        //     isAddPressed: !this.state.isAddPressed
        // })		
        // LayoutAnimation.configureNext(CustomLayoutSpring);
        this.props.toggller
    }

    onBackPressed = () => {
       this.onAddPressed()
    }

    refreshFlatList = (activeKey) => {
		this.setState((prevState) => {
			return {
				deletedRowKey: activeKey
			}
        })
        LayoutAnimation.configureNext(CustomLayoutSpring);
        
    }

    onCheckPressed = () => {
      
        
    }
    
    componentWillUnmount(){
        this.props.refresher
    }


    render(){
        return(
            <View>
                {renderIf(checklistData.length == 0)(
                <View ref={'phc'}>
                    <View style={styles.phtContainer}>
                        <Text style={styles.phText}>Looks like your list is empty add some stuff to your to do list.</Text>
                        <Image 
                            resizeMode="contain"
                            style = {styles.phImage}    
                            source={require('BusyApp/app/images/img_570192.png')} 
                            >
                        </Image>
                        </View>

                    {renderIf(this.state.isAddPressed)(
                    <View style={styles.addContainer}>
                        <TouchableOpacity style={styles.backBtn} onPress={this.onBackPressed}>
                            <Image
                                resizeMode="contain"
                                style = {styles.backImage}
                                source={require('BusyApp/app/images/pm-back-vector.png')}
                                >
                                </Image>
                            </TouchableOpacity>
                        <TouchableOpacity style={styles.checkBtn} onPress={this.onCheckPressed}>
                            <Image
                                resizeMode="contain"
                                style = {styles.backImage}
                                source={require('BusyApp/app/images/pm-check-vector.png')}
                                >
                                </Image>
                            </TouchableOpacity>
                    </View>
                    )}

                    {renderIf(!this.state.isAddPressed)(
                    <View style={styles.mainContainer}>
                        <Text style={styles.busyText}>busy</Text>
                        <Text style={styles.dateText}>Monday 25 Apr 2018</Text>

                    
                        <TouchableOpacity 
                        style={styles.addBtn}
                        onPress={this.onAddPressed}
                        >
                            <Image
                                resizeMode="contain"
                                style = {styles.addImg}
                                source={require('BusyApp/app/images/pm-add-vector.png')}
                                >
                            </Image>
                            <Text style={styles.addText}>Add something</Text>
                        </TouchableOpacity>
                    </View>
                    )}


                    {/* <Menu></Menu> */}

                </View>
                 
                )}
        </View>
        );
    }
    

}



const styles = StyleSheet.create({

    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
        
    },
    phtContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 190,
        position: 'absolute',
        backgroundColor: '#FBFBFB',
        height: height,
        width: width,
        
    },
    addContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: 20,
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        paddingBottom: 10
        
    },

    busyText: {
        fontSize: 30,
        color: '#2C2C54',
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',

    },
    dateText: {
        fontSize: 18,
        color: '#000',
        opacity: 0.6,
        marginTop: 15,
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light'
    },
    addBtn: {
        flexDirection: 'row',
        marginTop: 30,
        padding: Platform.OS === 'ios' ? 10 : 10,
        backgroundColor: '#2C2C54',
        borderWidth: Platform.OS === 'ios' ? 2 : 0,
        borderColor: Platform.OS === 'ios' ? '#2C2C54' : '#2C2C54',
        borderRadius: Platform.OS === 'ios' ? 100 : 0,

      
        
    },

    addImg: {
        width: 22,
        height: 22,
        tintColor: '#fff',
        margin: 5
    },
    addText: {
        fontSize: 20,
        color: '#fff',
        marginTop: 3,
        marginRight: 5,
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light'
    },
    phText: {
        fontSize: 18,
        color: '#000',
        opacity: 0.6,
        textAlign: 'center',
        marginTop: 50,
        marginLeft: 50,
        marginRight: 50,
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light'
    },
    phImage: {
        width: 34,
        height: 34,
        tintColor: '#000',
            marginTop: 25,
            opacity: 0.3,
        },
    
    backImage: {
        width: 25,
        height: 25,
        tintColor: '#2C2C54', 
    },

    backBtn: {
        backgroundColor: '#FBFBFB',  
        borderColor: '#FBFBFB', 
        padding: 10,
        borderWidth: 2,
        borderRadius: 100,
       
          
          },

    checkBtn: {
        backgroundColor: '#FBFBFB',  
        borderColor: '#FBFBFB', 
        padding: 10,
        marginLeft: 10,
        borderWidth: 2,
        borderRadius: 100,
       
          
          },

})