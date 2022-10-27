import React, {Component} from 'react';
import {AppRegistery, Text, View, StyleSheet,TextInput,TouchableOpacity,ScrollView,Dimensions,FlatList,Image,Keyboard,Button, Platform, AsyncStorage} from 'react-native';
import renderIf from 'BusyApp/app/helpers/renderif.js'
import Recents from 'BusyApp/app/components/lists/Recents.js'
import recentsData from 'BusyApp/app/data/recentsData.js'
import TimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';

var { width, height } = Dimensions.get('window');



export default class Adder extends Component{

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isCheckedTV: false,
            isTimePickerVisible: false,
            dueTime:  null,
        }
      }

        async saveRecentData(){
            try {
                await AsyncStorage.setItem('@checksttt', JSON.stringify(this.state.isCheckedTV));
                await AsyncStorage.setItem('@recents', JSON.stringify(recentsData));
            } catch (error) {

            }
            }
        generateKey = (numberOfCharacters) => {
            return require('random-string')({length: numberOfCharacters});
            }

        refreshFlatList = (activeKey) => {
            this.setState((prevState) => {
                return {
                    deletedRowKey: activeKey
                }
            })
        }
        async getRecentsData(){
            const value = await AsyncStorage.getItem('@recents');
                this.setState({
                    isCheckedTV: await AsyncStorage.getItem('@checksttt')
                })
                const restoredArray = JSON.parse(value)
                if (value !== null && restoredArray.length>0){
                    for (var i=0; i<restoredArray.length; i++) {
                        if(restoredArray[i].name!=''){
                        const newKey = this.generateKey(24)
                        recentsData.push(restoredArray[i])
                        this.refreshFlatList(newKey)
                        }
                    }
                }
            }


        submitFunc(){
            Keyboard.dismiss
            this.props.onToggle()
        }

        onRecentToChange = () => {
                this.setState({
                    text: this.refs['rcnts'].state.itemRealName,
                    isCheckedTV: true
                })
                this.saveRecentData()

        }
        
        onTextChnge = (text) =>{
            this.setState({
                text: text,
            })
            if(recentsData.length==4){
            this.setState({
                isCheckedTV: false
            })
            this.saveRecentData()
            }
        }


        componentDidMount(){
            this.getRecentsData()

        }
        componentWillMount(){
            this.setState({
                dueTime: null
            })
        }

        clearRecents = () => {
            recentsData.length = 0
            this.saveRecentData()
            const newKey = this.generateKey(24)
            this.refreshFlatList(newKey)
        }

        _showDateTimePicker = () => this.setState({ isTimePickerVisible: true });

        _hideDateTimePicker = () => this.setState({ isTimePickerVisible: false });

        _handleTimePicked = (time) => {
        //   if (time < new Date())
        //    alert("Please enter a valid time");
        //   else
            this.setState({ dueTime: time });

          this._hideDateTimePicker();

        };

    //MAIN RENDER//
    render(){
        return(
            <View ref={'adder'} style={styles.overlayInvisible}>
                {renderIf(this.props.addview)(
                    <View>
                        {/* Overlay */}
                        <View style={styles.overlay}>
                            </View>
                        {/* Input */}
                        <View style={styles.adderContainer}>
                        <TextInput
                            style={styles.adderText}
                            placeholder="Add something todo"
                            autoFocus = {true}
                            value={this.state.text}
                            underlineColorAndroid={'rgba(0,0,0,0)'}
                            onChangeText={(text) =>
                                this.onTextChnge(text)
                            }
                            onSubmitEditing={
                              this.props.onToggle
                            }
                            maxLength={70}
                        />
                        </View>

                        <View style={styles.addToolsContainer}>

                            {renderIf(recentsData.length>3)(
                                <TouchableOpacity style={styles.clearBtn} onPress={this.clearRecents}>
                                    <Image
                                resizeMode="contain"
                               style = {styles.clearImage}
                               source={require('BusyApp/app/images/pm-clear-vector.png')}
                               >
                               </Image>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={[styles.hourBtn, recentsData.length<4 && styles.hourBtnAlt]} onPress={this._showDateTimePicker}>
                            {renderIf(this.state.dueTime == null)(
                                <Image
                                resizeMode="contain"
                               style = {styles.hourImage}
                               source={require('BusyApp/app/images/pm-watch-vector.png')}
                               >
                               </Image>
                            )}
                            {renderIf(this.state.dueTime != null)(
                                <Text style={styles.hourText}>{Moment(this.state.dueTime).format('H:mm')}</Text>
                            )}
                                </TouchableOpacity>

                                <TimePicker
                                    isVisible={this.state.isTimePickerVisible}
                                    onConfirm={this._handleTimePicked}
                                    onCancel={this._hideDateTimePicker}
                                    //is24Hour={true}
                                    mode='time'/>

                        </View>



                        {/* Recents */}

                        <View style={styles.recentsContainer}>
                        <Recents ref={'rcnts'} addstatus={this.props.addview} changeInput={this.onRecentToChange} > </Recents>

                        </View>

                    </View>
                )}

            </View>

        );
	}
}

const styles = StyleSheet.create({

    adderText: {
        marginLeft: 0,
        height: 40,
        width: 252,
        color: '#27278E',
        fontSize: 22,
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
        textAlign: 'center',
        paddingVertical: 0,
    },
    adderContainer: {
        marginTop: Platform.OS === 'ios' ? 10 : 0,
        marginLeft: Platform.OS === 'ios' ? 40 : 0,
        marginRight:  Platform.OS === 'ios' ? 40 : 0,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECECEF',
        borderWidth: Platform.OS === 'ios' ? 2 : 0,
        borderColor: 'transparent',
        borderRadius: Platform.OS === 'ios' ? 100 : 0 ,

    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,

        backgroundColor: Platform.OS === 'ios' ? '#FBFBFB' : '#FBFBFB',
        width: width,
        height: height,
        marginTop: 50,
        // borderWidth: Platform.OS === 'ios' ? 2 : 0,
        // borderColor: Platform.OS === 'ios' ? '#2C2C54' : '#E9E9ED',
        // borderRadius: Platform.OS === 'ios' ? 70 : 0
      },
      overlayInvisible: {


        left: 0,
        top: 0,

      },
      recentsContainer: {
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      clearBtn: {
        marginLeft: 50,
        backgroundColor: '#27278E',
        padding: 12,
        borderWidth: 0,
        borderColor: '#27278E',
        borderRadius: 100,
        opacity: 0.8
      },
      clearImage: {
        width: 18,
        height: 18,
        tintColor: '#fff',
      },
      hourImage:{
        width: 18,
        height: 18,
        tintColor: '#fff',
      },
      hourText: {
        color: '#fff'
      },
      hourBtn: {
        backgroundColor: '#27278E',
        borderColor: '#27278E',
        marginLeft: 10,
        padding: 12,
        borderWidth: 0,
        borderRadius: 100,
        opacity: 0.8

      },
      hourBtnAlt: {
        marginLeft: width/2-20,

      },
      addToolsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 5
      }

});
