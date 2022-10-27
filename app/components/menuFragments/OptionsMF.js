import React, {Component} from 'react';
import {
  AppRegistery,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  WebView,
  Linking,
  StatusBar,
  Switch,
  Platform,
  Image,
  AsyncStorage,
  Share,
  LayoutAnimation,
} from 'react-native';

import checklistData from 'BusyApp/app/data/checklistData.js'
import recentsData from 'BusyApp/app/data/recentsData.js'
import listsData from 'BusyApp/app/data/listsData.js'

import renderIf from 'BusyApp/app/helpers/renderif.js'
//import Share, {ShareSheet, Button} from 'react-native-share';
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

var {
  width,
  height
} = Dimensions.get('window');




export default class OptionsMF extends Component {

  constructor(props) {
    super(props);
    this.state = {
      countTheme: 0,
      themeName: 'Light',
      isThmeNexted: null,
      reverse: true,
      isSwtchEnabled: true,
      isAllowNotif: false,
      isANEnabled: this.props.getMenu.props.getMainContainer.state.currListKey === '0',
      isGetMotiv: false,
      currListKey: '0'
    }
    this.getSwitchState();
  }

  async saveSwitchState(value){
    try {
      await AsyncStorage.setItem('@switch-Rl', JSON.stringify(value));
     
  } catch (error) {

  }
  }
  

  async saveANSwitchState(value){
    try {
      await AsyncStorage.setItem('@switch:notification', JSON.stringify(value));
     
  } catch (error) {

  }
  }

  async saveGMSwitchState(value){
    try {
      await AsyncStorage.setItem('@switch:getmotive', JSON.stringify(value));
     
  } catch (error) {

  }
  }






  async getSwitchState(){
    this.setState({
      reverse: JSON.parse(await AsyncStorage.getItem('@switch-Rl')),
      isAllowNotif: JSON.parse(await AsyncStorage.getItem('@switch:notification')),
      isGetMotiv: JSON.parse(await AsyncStorage.getItem('@switch:getmotive')),
    })
  }


  async saveCheckListData() {
    try {
      await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(checklistData));
      

    } catch (error) {}
  }


  generateKey = (numberOfCharacters) => {
    return require('random-string')({
      length: numberOfCharacters
    });
  }

  reverseList = (value) => {
    this.saveCheckListData();
    this.saveSwitchState(value);
    this.props.refresh(this.generateKey(24));
    this.props.switchReverse();
    this.state.reverse = value;
  }

  setIsAllowNotify = (value) => {
    this.setState({
      isAllowNotif: value,
      isGetMotiv: false
    })
    //ALLOW NOTIFICATIONS IS NOT WORKING TODO --- FIX THIS SHIT!
    // if (this.state.isAllowNotif){
    //   require('react-native-push-notification').cancelAllLocalNotifications();
    // }

    LayoutAnimation.configureNext(CustomLayoutSpring);
    this.saveANSwitchState(value)
    this.saveGMSwitchState(false)
  }




  setGetMotivated = (value) => {
    this.setState({
      isGetMotiv: value
    })

    
    
    LayoutAnimation.configureNext(CustomLayoutSpring);
    this.saveGMSwitchState(value)
  }




//TODO CHANGE ACCORDING TO PLATFORM
  sharePress = () =>{
    Share.share({
      message: 'Check out the easiest todo list app out there: https://play.google.com/store/apps/details?id=com.busyapp',
      url: 'https://play.google.com/store/apps/details?id=com.busyapp',
      title: 'Get productive!'
    })
  }


  getCurrentList = () => {
    return listsData.find(x => x.key === this.state.currListKey).items;
  }

  componentWillMount(){
     this.getSwitchState()
     if(!this.props.isCLEmpty){
      this.setState({
        isSwtchEnabled: true
      })
    }else{
     this.setState({
       isSwtchEnabled: false
     })
    }
    
  }

  onHelpPressed = () => {
    this.props.openHelp()
  }


  componentDidUpdate(){
    //TODO FIX THIS SHIT
    // if(this.getCurrentList().length > 0){
    //   this.setState({
    //     isANEnabled: false
    //   })
    // }
  }




  render(){
        return(
            <ScrollView style={styles.mainContainer} ref={'optionsmf'}>
                {/* RL Switch */}
                <View style={styles.rlsContainer}>
                        <Text style={styles.sText}>Reverse list</Text>
                        <Switch
                            style={styles.rlSwitch}
                            onValueChange={(value) => this.reverseList(value)}
                            value={this.state.reverse}
                            disabled={!this.state.isSwtchEnabled}
                            />
                </View>
                <View style={styles.ansContainer}>
                        <Text style={styles.anText}>Allow notifications</Text>
                        <Switch
                            style={styles.anSwitch}
                            onValueChange={(value) => this.setIsAllowNotify(value)}
                            value={this.state.isAllowNotif}
                            disabled={!this.state.isANEnabled}
                            />
                </View>
            {renderIf(this.state.isAllowNotif && this.state.isANEnabled)(
                <View style={styles.gmContainer}>
                        <Text style={styles.anText}>Get motivated</Text>
                        <Switch
                            style={styles.gmSwitch}
                            onValueChange={(value) => this.setGetMotivated(value)}
                            value={this.state.isGetMotiv}

                            />
                </View>
            )}


                <View style={styles.moreContainer}>

                  <View
                    style={{
                      margin: 5,
                      borderBottomColor: '#fff',
                      borderBottomWidth: 0.8,
                      width: '100%'
                     }}
                  />

                  <TouchableOpacity onPress={this.sharePress}>
                  <Text style={styles.helpText}>Like this app? Share it!</Text>
                  </TouchableOpacity>

                  <Text style={styles.twmText}></Text>
                  </View>



            </ScrollView>
        );
	}
}



const styles = StyleSheet.create({
  sText: {
    fontSize: 22,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
textAlign: 'left',

},
anText: {
  fontSize: 20,
  color: '#fff',
  fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
textAlign: 'left',

},
themeText: {
  marginTop: 20,
  fontSize: 20,
  color: '#fff',
  fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
textAlign: 'center',

},
themeStyle: {
  marginTop: 5,
  fontSize: 26,
  color: '#fff',
  fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
textAlign: 'center',

},
leftImg: {
  marginRight: 10,
  tintColor: '#fff',
  height: 40,
  width: 40



},
rightImg: {
  marginLeft: 10,
  tintColor: '#fff',
  height: 40,
  width: 40

},
    mainContainer: {
        marginTop: 10,
        paddingLeft: 50,
        paddingRight: 50,
        marginBottom: height-300
    },

    tlsContainer: {
        flexDirection: 'row',

    },
    rlsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ansContainer: {
      flexDirection: 'row',
      marginTop: 15,
      justifyContent: 'center',
      alignItems: 'center',
  },
  gmContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
		alignItems: 'center',
},
    thContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'center',
		alignItems: 'center',
    },

    tlSwitch: {
      marginLeft: width-300,

    },
    rlSwitch: {
        marginLeft: 10,
        transform: [{ scaleX: .9 }, { scaleY: .9 }]
      },
     anSwitch: {
       // marginLeft: width-330,
        transform: [{ scaleX: .9 }, { scaleY: .9 }]

      },
      gmSwitch: {
        marginLeft: 10,
        transform: [{ scaleX: .8 }, { scaleY: .8 }]
      },

     moreContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
     },

     helpText: {
      fontSize: 20,
      marginTop: 15,
      color: '#fff',
      fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
      textAlign: 'center',
    //  textDecorationLine: 'underline',
  },
  twmText: {
    fontSize: 14,
    marginTop: 15,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
    textAlign: 'center',
},



})
