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
  Image,
  LayoutAnimation,
  AsyncStorage,
  Platform,
  UIManager,
  Modal,
  AppState
} from 'react-native';
import Adder from 'BusyApp/app/components/actions/Adder.js'
import Menu from 'BusyApp/app/components/actions/Menu.js'
import Checklist from 'BusyApp/app/components/lists/Checklist.js'
import renderIf from 'BusyApp/app/helpers/renderif.js'
import listsData from 'BusyApp/app/data/listsData.js'
import recentsData from 'BusyApp/app/data/recentsData.js'
import PHContainer from 'BusyApp/app/components/PHContainer.js'
import checklistData from 'BusyApp/app/data/checklistData.js'
import HelpComponent from './HelpComponent';
import PopupDialog , { DialogButton, FadeAnimation }from 'react-native-popup-dialog';




var CustomLayoutSpring = {
  duration: 300,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7
  }
};

const fadeAnimation = new FadeAnimation({
  toValue: 0, // optional
  animationDuration: 150, // optional
  useNativeDriver: true, // optional
})



const newItem = {
  key: '',
  name: '',
  checked: false
}

var {
  height,
  width
} = Dimensions.get('window');

var notificationId = 0;
var PushNotification = require('react-native-push-notification');

var motivationalStrings = [
  "Time to get to work. your task: ",
  "You can do it. your task: ",
  "Don’t wait. your task: ",
  "A productive day is always better. your task: ",
  "Get your butt off the couch! your task: ",
  "Get up! and get workin. your task: ",
  "Stay productive! your task: ",
  "Do More. your task: "
];
var randomMotivItem = motivationalStrings[Math.floor(Math.random() * motivationalStrings.length)];

export default class MainContainer extends Component {

  constructor() {
    super();
    this.state = {
      status: false,
      toggle: false,
      deletedRowKey: null,
      storedChecklist: null,
      reverse: true,
      isAddPressed: true,
      showPh: false,
      currListKey: '0',
      stringifiedDate: '',
      listTitle: '',
      popupText: 'Long press a task to rearrange it and press a task to edit it',
      modalVisible: true,
      modalMenuVisible: false,
      isFirstLoaded: true,
      backedTimeForItem: null,
      isItemEdited: false,
      isAddShown: true,
      isHelpOpened: false,
      isClearPPVisible: false,
      showClearPP:false,
      appState: AppState.currentState
    }
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log( 'TOKEN:', token );
      },
  
      // (required) Called when a remote or local notification is opened or received
      onNotification: (notification) => {
        console.log( 'NOTIFICATION:', notification );
        list = this.getCurrentList()
        if (list) {
          itemIndex = list.findIndex(x => x.name === notification.message);
          if (itemIndex != null) {
            listsData.find(x => x.key === this.getCurrentListKey()).items.splice(itemIndex, 1)
            this.refreshFlatList();
          }
        }
      },
  
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },
  
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
  
      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
  });
  
  notificationId = this.getNotificationId()
    
  }

  changeAddButton = () => {
    this.setState({
      isAddShown: !this.state.isAddShown
    })
  }

  openHideHelp = () => {
    this.setState({
      isHelpOpened: !this.state.isHelpOpened,
      isAddShown: !this.state.isAddShown,
    })
    LayoutAnimation.configureNext(CustomLayoutSpring);
  }

  async getNotificationId() {
    id = await AsyncStorage.getItem('@loaded')
    if (id)
      notificationId = id;
    else
      notificationId = 0;
  }

  async saveNotificationId() {
    try {
      await AsyncStorage.setItem('@notificationId', notificationId);
    } catch (error) {}
  }

  async getLoadedState(){
    this.setState({
      isFirstLoaded: JSON.parse(await AsyncStorage.getItem('@loaded'))
  })
  }

  getCurrentList = () => {
    list = listsData.find(x => x.key === this.state.currListKey)
    if (!list)
      list = listsData['0']

    return list.items;
  }

  getIsAllowNotif = () => {
    return listsData.find(x => x.key === this.state.currListKey).isAllowNotif;
  }

  componentDidMount() {
    this.getLoadedState()

    this.dateToStringPro()
    if(this.state.appState == 'active'){
      this.getData()
    }
    


    if(!this.state.isFirstLoaded){
      this.getPureKey()
    }

    this.getListTitle()
    if(this.state.currListKey==null){
      this.setState({
        currListKey: '0'
      })
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    if(this.state.currListKey!=null){
      if (this.getCurrentList().length > 0) {
        this.setState({isAddPressed: true})
      } else {
        this.setState({isAddPressed: false, showPh: true})
      }
    }

  }
 
  loadSecondTime() {
    this.setState({
      firstLoaded: false
    })
  }

  dateToStringPro() {
    var realDate = new Date()
    var fullDate = realDate.toUTCString()
    var currDay = fullDate.substring(0, 3) + 'day'

    if (realDate.getDay() == '2') {
      currDay = fullDate.substring(0, 3) + 'sday'
    }
    if (realDate.getDay() == '3') {
      currDay = fullDate.substring(0, 3) + 'nesday'
    }
    if (realDate.getDay() == '4') {
      currDay = fullDate.substring(0, 3) + 'rsday'
    }
    if (realDate.getDay() == '6') {
      currDay = fullDate.substring(0, 3) + 'urday'
    }

    var currDayInMonth = realDate.getDate()
    var currMonth = fullDate.substring(8, 11)
    var currYear = realDate.getFullYear()

    this.setState({
      stringifiedDate: currDay + ' ' + currDayInMonth + ' ' + currMonth + ' ' + currYear
    })

  }

  async saveData() {
    try {
      await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(listsData));
    } catch (error) {}
  }

  async saveRecentData() {
    try {
      await AsyncStorage.setItem('@recents', JSON.stringify(recentsData));
    } catch (error) {}
  }

  async saveListTitle(){
		try {
				await AsyncStorage.setItem('@listitle', this.state.listTitle);
			} catch (error) {

			}
	}

  //TODO ADD AN IF AND FIX THE DOUBLE LIST CRAP!!!
  async getData() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:key');
      const restoredArray = JSON.parse(value)
      if (value !== null && restoredArray.length > 0) {
        for (var i = 0; i < restoredArray.length; i++) {
          if (restoredArray[i].name != '') {
            if (restoredArray[i].key === '0')
              listsData[0] = restoredArray[i];
            else
              listsData.push(restoredArray[i]);
          }
        }
        this.refreshFlatList(this.generateKey(24))
        this.setCurrList(listsData[0].key)
      }
    } catch (error) {}

  }

  async getPureKey(){
    try {

    this.setState({
      currListKey: await AsyncStorage.getItem('@purekey')
    })

  }catch (error) {}
  }

  async getListTitle(){
    try {
    this.setState({
      listTitle: await AsyncStorage.getItem('@listitle')
    })
  }catch (error) {}
  }

  getTimeBackupForItem = (value) => {
    this.setState({
        backedTimeForItem: value,
        isItemEdited: true
    })
  }

  // getCurrentList = () => {
  //   return listsData.find(x => x.key === this.state.currListKey).items
  // }

  

  switchReverse = () => {
    this.setState({
      reverse: !this.state.reverse
    })

    listsData.find(x => x.key === this.state.currListKey).items = this.getCurrentList().reverse();

    return this.state.reverse
  }

  ReAddForCheckStatus = () => {

    this.saveData()
  }

  toggleStatus = () => {
    this.setState({
      status: !this.state.status
    });
    LayoutAnimation.configureNext(CustomLayoutSpring);

  }

  getCurrentListKey = () => {
    return this.state.currListKey;
  }

  toggleEditLite = () => {
    this.refs['adder'].setState({text: this.refs['chklist'].state.itemRealName, dueTime: this.refs['chklist'].state.time})

    this.toggleStatus()
  }

  toggleEditWithClear = () => {
    this.setState({
      isItemEdited: false
    })
    this.refs['chklist'].state.isRealEdited = false
    if (!this.state.status) {
      this.toggleStatus()
    }

    if (this.state.status) {
      const newKey = this.generateKey(24)
      newItem = {
        key: newKey,
        name: this.refs['adder'].state.text.toString(),
        checked: this.refs['chklist'].state.realChecked,
        time: this.state.backedTimeForItem
      }
      if (newItem.name == '') {
        alert('Write something first')
      } else {
        this.toggleStatus()
        this.getCurrentList().splice(this.refs['chklist'].state.realIndex, 0, newItem)
        this.refreshFlatList(newKey)
        this.refs['adder'].state.text = ''

      }

     
    }

    this.saveData()

  }

  toggleEdit = () => {
    this.refs['chklist'].state.isRealEdited = false
    if (!this.state.status) {
      this.toggleStatus()
    }

    if (this.state.status) {
      const newKey = this.generateKey(24)
      newItem = {
        key: newKey,
        name: this.refs['adder'].state.text.toString(),
        checked: this.refs['chklist'].state.realChecked,
        time: this.refs['adder'].state.dueTime
      }
      if (newItem.name == '') {
        alert('Write something first')
      } else {
        this.toggleStatus()
        this.getCurrentList().splice(this.refs['chklist'].state.realIndex, 0, newItem)
        this.refreshFlatList(newKey)
        this.refs['adder'].state.text = ''

      }

    
      
    }

    this.saveData()

  }

  generateKey = (numberOfCharacters) => {
    return require('random-string')({length: numberOfCharacters});
  }

  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});

  }

  refreshFlatList = (activeKey) => {
    this.setState((prevState) => {
      return {deletedRowKey: activeKey}
    })
    LayoutAnimation.configureNext(CustomLayoutSpring);

  }

  onAddPressed() {
    if (!this.state.status) {
      this.refs['adder'].state.text = ''
      this.refs['adder'].state.dueTime = null
      this.toggleStatus()
      if (this.refs['chklist'].state.isListConverted) {
        this.refs['chklist'].listTypeConverter()
      }
      this.setState({showPh: false})
    }
 
    if (this.state.status && !this.state.isEdited) {
      const newKey = this.generateKey(24)
      newItem = {
        key: newKey,
        name: this.refs['adder'].state.text.toString(),
        checked: this.refs['chklist'].state.realChecked,
        time: this.refs['adder'].state.dueTime,
        notificationId: -1
      }


      if (this.refs['adder'].state.text == '') {
        alert('Write something first')
      } else {
        this.toggleStatus()

        if (newItem.time && this.state.currListKey === '0' && this.refs['menu'].refs['optionsmf'].state.isAllowNotif)
        {
          if(this.refs['menu'].refs['optionsmf'].state.isGetMotiv){
            PushNotification.localNotificationSchedule({
              id: notificationId,
              vibration: 1000,
              message: randomMotivItem+newItem.name,
              date: newItem.time,
              largeIcon: "ic_todoicon", // (optional) default: "ic_launcher"
              smallIcon: "ic_todoicon", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            });
          }else{
            PushNotification.localNotificationSchedule({
              id: notificationId,
              vibration: 1000,
              message: newItem.name,
              date: newItem.time,
              largeIcon: "ic_todoicon", // (optional) default: "ic_launcher"
              smallIcon: "ic_todoicon", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            });
          }
         

          newItem.notificationId = notificationId;
          notificationId++;
          this.saveNotificationId();
        }


        if (this.state.reverse)
          this.refs['chklist'].state.currList.push(newItem)
        else
          this.refs['chklist'].state.currList.unshift(newItem)

        recentsData.push(newItem)

        this.saveRecentData()
        this.refreshFlatList(newKey)
        this.refs['adder'].state.text = ''
        this.refs['adder'].state.dueTime = null
      }

    } else {
      this.refs['adder'].state.text = ''
    }

    this.saveData()
  }



  onOkClearPressed = () => {
    this.setState({
      showClearPP: !this.state.showClearPP
    })
    this.getCurrentList().length = 0
   
  }

  onClearPressed() {
    if (!this.state.status) {
      if (this.refs['chklist'].state.isListConverted) {
        this.refs['chklist'].listTypeConverter()
      }
      
      this.setState({showPh: true, isAddPressed: false})
      this.saveData()

      this.setState({
        showClearPP: !this.state.showClearPP
      })
    } else {
      if (this.refs['chklist'].state.isRealEdited) {
        this.refs['adder'].state.text = this.refs['chklist'].state.itemRealName
        this.toggleEditWithClear()
      } else {
        this.toggleEditLite()
        if (this.getCurrentList().length == 0) {
          this.setState({showPh: true, isAddPressed: false})
        }
      }
      this.saveData()
    }

  }
  onAddEdit = () => {
    this.refs['chklist'].state.isRealEdited
      ? this.toggleEdit()
      : this.onAddPressed()
  }

  onPhAddPressed = () => {
    this.setState({
      showPh: !this.state.showPh,
      isAddPressed: true
    })
     this.refs['adder'].state.text = ''
    this.toggleStatus()

  }

  getPurestKeyOfChosenList(realKey) {
    this.setState({pureKey: realKey})
  }

  setCurrList = (listKey) => {
    this.setState({currListKey: listKey})
    this.refs['chklist'].setState({
      currList: listsData.find(x => x.key === listKey).items,
    })
    this.refs["menu"].refs["optionsmf"].setState({
      isANEnabled: listKey === '0',
    })
  }

  getPurestListTitle = (listTitle) =>{
    this.setState({
      listTitle: listTitle
    })

  }

  hideShowRegPoppup = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
    LayoutAnimation.configureNext(CustomLayoutSpring);
  }
  hideShowMenuPoppup = () => {
    this.setState({
      modalMenuVisible: !this.state.modalMenuVisible
    })
    LayoutAnimation.configureNext(CustomLayoutSpring);
  }

componentWillUpdate(){
  if(this.state.isFirstLoaded){
  if(listsData.length!=1){
    this.getPureKey()
  }else{

  }
}
}


  componentDidUpdate(){

    this.saveData()
    if(this.state.listTitle!=null){
      this.saveListTitle()
    }
    

  }

    render(){

        return(
            <View ref={'mainc'}>
            <View>

               {/* ADVANCED PLACEHOLDER */}
                {renderIf(this.state.showPh &&  this.getCurrentList().length == 0 && !this.state.isItemEdited)(
                <View>
                    <View style={styles.phtContainer}>
                            <Text style={styles.phText}>Looks like your list is empty add some stuff to your to do list.</Text>
                            <Image
                                resizeMode="contain"
                                style = {styles.phImage}
                                source={require('BusyApp/app/images/img_570192.png')}
                                >
                            </Image>
                            </View>

                        {renderIf(!this.state.isAddPressed)(
                        <View style={styles.mainContainer}>

                  {renderIf(this.state.currListKey!='0')(
                      <Text
                      adjustsFontSizeToFit={true}
                       minimumFontScale={0.01}
                      numberOfLines={1}
                      style={styles.itemListText}
                      >
                      {this.state.listTitle}
                    </Text>
                    )}
                  {renderIf(this.state.currListKey=='0')(
                        <Image
                        resizeMode="contain"
                        style = {styles.logoBtn}
                        source={require('BusyApp/app/images/smalltodo.png')}
                        >
                            </Image>

                      )}

                            <Text style={styles.dateText}>{this.state.stringifiedDate}</Text>

                              {renderIf(this.state.isAddShown)(
                            <TouchableOpacity
                            style={styles.addBtnPh}
                            onPress={this.onPhAddPressed}
                            >
                                <Image
                                    resizeMode="contain"
                                    style = {styles.addImg}
                                    source={require('BusyApp/app/images/pm-add-vector.png')}
                                    >
                                </Image>
                                <Text style={styles.addText}>Add something</Text>
                            </TouchableOpacity>
                              )}

                        </View>
                         )}

                     </View>
                    )}



                {/* TOOLBAR */}
                {renderIf(!this.state.isHelpOpened && this.getCurrentList().length > 0 || !this.state.showPh || this.state.isItemEdited)(
                <View style={[styles.tbContainer, this.state.status && styles.tbContainerAlt]}>

                    <TouchableOpacity
                            onPress={()=>{
                                this.setState({
                                    status: false
                                });
                                this.onClearPressed()
                                LayoutAnimation.configureNext(CustomLayoutSpring);
                                }
                            }
                            style={styles.clearBtnContainer}
                            >
                                <Image
                                resizeMode="contain"
                                style = {[styles.clearBtn, this.state.status && styles.clearBtnAlt]}
                                source={this.state.status ? require('BusyApp/app/images/pm-back-vector.png') : require('BusyApp/app/images/pm-clear-vector.png')}
                                >
                                    </Image>
                    </TouchableOpacity>

                    {renderIf(this.state.currListKey!='0')(
                      <Text
                      adjustsFontSizeToFit={true}
                       minimumFontScale={0.01}
                      numberOfLines={1}
                      style={styles.itemListText}
                      >
                      {this.state.listTitle}
                    </Text>
                    )}
                  {renderIf(this.state.currListKey=='0')(
                        <Image
                        resizeMode="contain"
                        style = {[styles.logoBtn, this.state.status && styles.logoBtnAlt]}
                        source={require('BusyApp/app/images/smalltodo.png')}
                        >
                            </Image>

                      )}

                    <TouchableOpacity
                    onPress={()=>{
							// this.onAddPressed()
                            this.refs['chklist'].state.isRealEdited ? this.toggleEdit() : this.onAddPressed()
                        }
                    }
                    style={styles.addBtnContainer}
                   >
                        <Image
                         resizeMode="contain"
                        style = {[styles.addBtn, this.state.status && styles.addBtnAlt]}
                        source={this.state.status ? require('BusyApp/app/images/pm-check-vector.png') : require('BusyApp/app/images/pm-add-vector.png')}
                        >
                        </Image>
                    </TouchableOpacity>

                </View>
                )}

                {/* POPPUP */}
                <PopupDialog
                  ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                 width={200}
                 height={0}
                 overlayBackgroundColor='#27278E'
                show={this.state.showClearPP}
                onDismissed={() => this.setState({
                  showClearPP: false
                })}
                overlayOpacity={0.051}
                dialogAnimation={fadeAnimation}
                 
                >
                  <View  style={styles.clearDialog}>
                    {/* <Text style={styles.cdText}>Clear this list?</Text> */}
                    
                  </View>
                 
                </PopupDialog>
                {renderIf(this.state.showClearPP)(   
                <View>
                <DialogButton 
                      text='Clear this list?' 
                      buttonStyle={styles.okButton} 
                      textStyle={styles.okTextButton}
                      disabled={false}
                      onPress={
                        this.onOkClearPressed
                        }
                     />
                </View>
                )}


                {/* ADDER */}
                <Adder ref={'adder'} addview={this.state.status} onToggle={this.onAddEdit}></Adder>

                {/* CHECKLIST */}
                {renderIf(!this.state.showClearPP)(    
                <Checklist ref={'chklist'} getCurrentListKey={this.getCurrentListKey} checklist={this.state.status} onToggle={this.toggleEditLite} onReAdd={this.ReAddForCheckStatus} isPhed={this.state.showPh} getPureKey={this.state.pureKey} getBackedTime={this.getTimeBackupForItem}> </Checklist>
                )}

                {/* MENU */}
                <Menu ref={'menu'} getIsAllowNotif={this.getIsAllowNotif} setCurrList={this.setCurrList} adderStatus={this.state.status} refresh={this.refreshFlatList} switchReverse={this.switchReverse} switchStatus={this.state.switchStatus} isListEmpty={this.state.showPh} getMainContainer={this} getListTitle={this.getPurestListTitle} firstLoaded={this.loadSecondTime} changeAddBtn={this.changeAddButton} helpOpener={this.openHideHelp} ></Menu>

                 {renderIf(this.state.isHelpOpened)(   
                <HelpComponent hideHelp={this.openHideHelp} isTooled={!this.state.showPh} style={styles.hcStyle}/>
                 )}

  

            </View>






            </View>

        );
	}
}




const styles = StyleSheet.create({

  tbContainer: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios'
      ? 15
      : 0,
    marginLeft: Platform.OS === 'ios'
      ? 20
      : 0,
    marginRight: Platform.OS === 'ios'
      ? 15
      : 0,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: Platform.OS === 'ios'
      ? 'transparent'
      : '#FBFBFB',
    elevation: 1
  },
  tbContainerAlt: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios'
      ? 10
      : 0,
    paddingLeft: Platform.OS === 'ios'
      ? 25
      : 45,
    paddingRight: Platform.OS === 'ios'
      ? 25
      : 45,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    elevation: 0

  },
  clearBtnContainer: {
    backgroundColor: Platform.OS === 'ios'
      ? '#FBFBFB'
      : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderWidth: Platform.OS === 'ios'
      ? 2
      : 0,
    borderColor: Platform.OS === 'ios'
      ? '#FBFBFB'
      : 'transparent',
    borderRadius: Platform.OS === 'ios'
      ? 100
      : 0
  },
  clearBtn: {
    width: Platform.OS === 'ios'
      ? 19
      : 21,
    height: Platform.OS === 'ios'
      ? 19
      : 21,
    tintColor: '#27278E'
  },
  clearBtnAlt: {
    width: Platform.OS === 'ios'
      ? 24
      : 26,
    height: Platform.OS === 'ios'
      ? 24
      : 26
  },
  logoBtn: {
    width: 45,
    height: 45,
    marginLeft: width / 4 - 30,
    marginRight: width / 4 - 30,
    tintColor: '#27278E'
  },
  logoBtnAlt: {
    opacity: 0.2
  },
  addBtnContainer: {
    backgroundColor: Platform.OS === 'ios'
      ? '#FBFBFB'
      : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderWidth: Platform.OS === 'ios'
      ? 2
      : 0,
    borderColor: Platform.OS === 'ios'
      ? '#FBFBFB'
      : 'transparent',
    borderRadius: Platform.OS === 'ios'
      ? 100
      : 0
  },
  addBtn: {
    width: Platform.OS === 'ios'
      ? 20
      : 22,
    height: Platform.OS === 'ios'
      ? 20
      : 22,
    tintColor: '#27278E'
  },
  addBtnAlt: {
    width: Platform.OS === 'ios'
      ? 24
      : 26,
    height: Platform.OS === 'ios'
      ? 24
      : 26,
    // marginLeft: width-290,

  },

  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60
  },
  phtContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 190,
    position: 'absolute',
    backgroundColor: '#FBFBFB',
    height: height,
    width: width
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
    color: '#27278E',
    fontFamily: Platform.OS === 'ios'
      ? 'helveticaneue-Light'
      : 'Raleway-Light'
  },
  dateText: {
    fontSize: 18,
    color: '#000',
    opacity: 0.6,
    marginTop: 15,
    fontFamily: Platform.OS === 'ios'
      ? 'helveticaneue-Light'
      : 'Raleway-Light'
  },
  addBtnPh: {
    flexDirection: 'row',
    marginTop: 30,
    padding: Platform.OS === 'ios'
      ? 5
      : 10,
    backgroundColor: '#27278E',
    borderWidth: Platform.OS === 'ios'
      ? 2
      : 0,
    borderColor: Platform.OS === 'ios'
      ? '#27278E'
      : '#27278E',
    borderRadius: Platform.OS === 'ios'
      ? 100
      : 0,
    elevation: 5
  },

  addImg: {
    width: 15,
    height: 15,
    tintColor: '#fff',
    margin: 5
  },
  addText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 3,
    // marginLeft: 5,
    marginRight: 5,
    fontFamily: Platform.OS === 'ios'
      ? 'helveticaneue-Light'
      : 'Raleway-Light'
  },
  phText: {
    fontSize: 18,
    color: '#000',
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 50,
    marginLeft: 50,
    marginRight: 50,
    fontFamily: Platform.OS === 'ios'
      ? 'helveticaneue-Light'
      : 'Raleway-Light'
  },
  phImage: {
    width: 34,
    height: 34,
    tintColor: '#000',
    marginTop: 25,
    opacity: 0.3
  },

  backImage: {
    width: 25,
    height: 25,
    tintColor: '#27278E'
  },

  backBtn: {
    backgroundColor: '#FBFBFB',
    borderColor: '#FBFBFB',
    padding: 10,
    borderWidth: 2,
    borderRadius: 100
  },

  checkBtn: {
    backgroundColor: '#FBFBFB',
    borderColor: '#FBFBFB',
    padding: 10,
    marginLeft: 10,
    borderWidth: 2,
    borderRadius: 100
  },
  itemListText: {
    width:200,
    fontSize: 30,
    color: '#27278E',
    // marginLeft: width / 4 - 50,
    // marginRight: width / 4 - 50,

    fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
    textAlign: 'center',

},

  popupStyle: {
    backgroundColor: '#2C2C54',
    opacity: 0.8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10


  },
  popupTextStyle: {
    fontSize:16,
    color: '#fff',
    textAlign: 'center',
    margin:5,
    fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',

  },
  gotItStyle: {
    fontSize:20,
    color: '#fff',
    margin:5,
    fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal3: {
    height: 300,
    width: 300
  },
  hcStyle: {
    position:'absolute'
  },
  clearDialog: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 20,
    // backgroundColor: '#2C2C54',
    
    width: 200
  },
  cdText:{
    textAlign: 'center',
    fontSize: 24,
    fontFamily: Platform.OS === 'ios'
      ? 'helveticaneue-Light'
      : 'Raleway-Light',
    color: '#fff' 

  },
  okButton: {
     marginTop: 130,
    backgroundColor: '#27278E',
    width: 200
  },
  okTextButton:{
    color:'#fff',
    fontSize: 24,
    fontFamily: Platform.OS === 'ios'
      ? 'helveticaneue-Light'
      : 'Raleway-Light',
  }
  

});






//MAYBE WILL BE USED IN THE FUTURE(POPPUPS)
  // {renderIf(this.state.modalVisible && !this.state.status)(
  //             <View style={styles.popupStyle}>
  //               <Text style={styles.popupTextStyle}>{this.state.popupText}</Text>
  //               <TouchableOpacity onPress={()=>{
  //                 this.setState({modalVisible:false})
  //                 LayoutAnimation.configureNext(CustomLayoutSpring);
  //                 }}>
  //                 <Text style={styles.gotItStyle}>Got it</Text>
  //                 </TouchableOpacity>
  //               </View>
  //             )}
  //              {renderIf(this.state.modalMenuVisible && !this.state.status)(
  //             <View style={styles.popupStyle}>
  //               <Text style={styles.popupTextStyle}>Long press a list to edit it</Text>
  //               <TouchableOpacity onPress={()=>{
  //                 this.setState({modalMenuVisible:false})
  //                 LayoutAnimation.configureNext(CustomLayoutSpring);
  //             }}>
  //                 <Text style={styles.gotItStyle}>Got it</Text>
  //                 </TouchableOpacity>
  //               </View>
  //             )}}
