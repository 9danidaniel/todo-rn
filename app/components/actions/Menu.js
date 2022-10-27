import React, {
  Component
} from 'react';
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
  Image,
  Keyboard,
  Button,
  Platform,
  AsyncStorage,
  TouchableWithoutFeedback,
  LayoutAnimation,
} from 'react-native';
import renderIf from 'BusyApp/app/helpers/renderif.js'
import Recents from 'BusyApp/app/components/lists/Recents.js'
import recentsData from 'BusyApp/app/data/recentsData.js'
import Swiper from 'react-native-swiper';
import ListsMF from 'BusyApp/app/components/menuFragments/ListsMF.js'
import OptionsMF from 'BusyApp/app/components/menuFragments/OptionsMF.js'
import SwipeALot from 'react-native-swipe-a-lot';
import listsData from 'BusyApp/app/data/listsData.js'
var themeNameVariable = "Light"

var { width, height } = Dimensions.get('window');

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


export default class Menu extends Component{

    constructor(props) {
        super(props);

        this.state = {
          isPressed: false,
          isPaged: false,
          isKS: false,
          realClickedOnKey: null,
          showPopup: false,
          isDissedNow: false,
        }

      }

      async savePoppupState(value){
        try {
            await AsyncStorage.setItem('@poppup',JSON.stringify(value));
          } catch (error) {

          }
      }


      async getPoppupState(){
        this.setState({
          showPopup: JSON.parse(await AsyncStorage.getItem('@poppup'))
        })


      }

      getChosenListKey(realKey){
        this.setState({
          clickedOnKey: realKey
        })
     this.props.getMainContainer.getPurestKeyOfChosenList(realKey)
      }

      onPress = () => {
        this.setState({
          isPressed: !this.state.isPressed
        })
        this.props.getMainContainer.hideShowMenuPoppup()
        LayoutAnimation.configureNext(CustomLayoutSpring);
        this.savePoppupState(!this.state.showPopup)

      }
      onPageView = () => {
        this.setState({
          isPaged: !this.state.isPaged
        })
        LayoutAnimation.configureNext(CustomLayoutSpring);
      }
      keyboardSupporter = () => {
        this.setState({
          isKS: !this.state.isKS
        })
        this.props.changeAddBtn()
      }
      getWidth() {
        return Dimensions.get('window').width;
      }

    refreshView = () => {
      this.forceUpdate();
    }


    getThemeName = (realThemeName) => {
      this.setState({
        themeNameREAL: realThemeName
      })
    }

    onDismissPoppup = () => {
      this.setState({
        showPopup: false,
        isDissedNow: true,
      })
      LayoutAnimation.configureNext(CustomLayoutSpring);
      this.savePoppupState(!this.state.showPopup)
    }

    componentDidMount(){
      this.getPoppupState()
      // if(this.state.isDissedNow){

      //   this.savePoppupState(this.state.showPopup)

      // }
      //this.savePoppupState(this.state.showPopup)
    }


    render(){

      const width = this.getWidth();
        return(
          <View
          style={[styles.menuContainer, this.state.isPressed && !this.props.adderStatus ? this.state.isKS ? styles.menuContainerAlt3 : styles.menuContainerAlt : styles.menuContainer
          && this.props.adderStatus ? styles.menuContainerAlt2 : styles.menuContainer
          ]}>


                {/* DrawerToggler */}
                    <TouchableOpacity style={styles.menuBtn}  onPress={this.onPress} disabled={this.state.isKS}>

                        <Image
                                resizeMode="contain"
                                style = {[styles.menuImg, this.state.isPressed && styles.menuImgAlt]}
                                source={this.state.isPressed ? require('BusyApp/app/images/pm-down-vector.png') : require('BusyApp/app/images/pm-up-vector.png')}
                                >
                                </Image>
                    </TouchableOpacity>


                      {/* Menu Tab Bar */}
                      <View>
                        <View style={styles.tbContainer}>
                          <View style={[styles.tbCircle, !this.state.isPaged && styles.tbCircleAlt]}/>
                          <View style={[styles.tbCircle2, this.state.isPaged && styles.tbCircleAlt]}/>
                          </View>

                        </View>




                  {/* View Pager */}
                  <Swiper
                  
                    scrollEnabled={!this.state.isKS}
                    containerStyle={{width}}
                    loop={false}
                    showsPagination={false}
                        index={0.0000000000001}
                        onIndexChanged={this.onPageView}>
                  <ListsMF style={styles.slide1} ref={'listsmf'} supportKeys={this.keyboardSupporter} optionsRef={this.refs.optionsmf} tnr={this.state.themeNameREAL} setCurrList={this.props.setCurrList} onReAddReal={this.props.onReAdd} getTitleList={this.props.getListTitle} onPressOC={this.onPress}
                    loadedFirst={this.props.firstLoaded}/>
                  <OptionsMF style={styles.slide2} ref={'optionsmf'} refresh={this.props.refresh} switchReverse={this.props.switchReverse} refreshView={this.refreshView} getMenu={this} isCLEmpty={this.props.isListEmpty} openHelp={this.props.helpOpener}/>
                    </Swiper>



            </View>
        );
	}
}


const styles = StyleSheet.create({
  menuContainer: {
    marginTop: Platform.OS === 'ios' ? height-60 : height-55,
    backgroundColor: Platform.OS === 'ios' ?'#FBFBFB' : '#FBFBFB',
    height: height,
    width: width,
    borderWidth: 1,
    borderColor: '#E7E7E7',

    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
  },
    menuContainerAlt: {
      marginTop: Platform.OS === 'ios' ? 350 : 330,
      position: 'absolute',
      backgroundColor: '#27278E',
      borderColor: '#27278E',
    },
    menuContainerAlt2: {
      marginTop:  height,
      position: 'absolute',
    },
    menuContainerAlt3: {
      marginTop: Platform.OS === 'ios' ? 240 : 200,
      position: 'absolute',
      backgroundColor: '#27278E',
      borderColor: '#27278E',
    },
    menuImg: {
      width: 22,
      height: 22,
      marginTop: 15,
      marginBottom: 15,
      tintColor: '#27278E',
    },
    menuImgAlt: {
      width: 22,
      height: 22,
      marginTop: 20,
      tintColor: '#fff',
    },
    tbCircle: {
      width: 7,
      height: 7,
      borderRadius: 7 / 2,
      backgroundColor: '#D4C2FC',
      marginTop: 10,
      opacity: 0.8
    },
    tbCircleAlt: {
      width: 9,
      height: 9,
      borderRadius: 10 / 2,
      backgroundColor: '#fff',
      opacity: 1
    },

    tbCircle2: {
      width: 7,
      height: 7,
      borderRadius: 7 / 2,
      backgroundColor: '#D4C2FC',
      marginLeft: 6,
      marginTop: 10,
      opacity: 0.8
    },
  menuBtn: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',


  },
  tbContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  swiperStyle: {
    marginTop: 10,


  },
  pContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#D4C2FC',
    width: width
  },
  ptext: {
    color: '#2C2C54',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
  },
  pdtext: {
    color: '#2C2C54',
    marginLeft: 50,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
  }

}
);
