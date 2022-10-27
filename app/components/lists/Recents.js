import React, {Component} from 'react';
import {AppRegistery, Text, View, StyleSheet,TextInput,TouchableOpacity,ScrollView,Dimensions,FlatList,Image,TouchableWithoutFeedback,LayoutAnimation,Platform} from 'react-native';
import renderIf from 'BusyApp/app/helpers/renderif.js'
import recentsData from 'BusyApp/app/data/recentsData.js'

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

var {height, width} = Dimensions.get('window');

class FlatListItem extends Component {

	constructor(props) {
		super(props)
		this.state = ({
			activeRowKey: null,
			checkStatus: false,
			isEdited: false,
			transItemName: this.props.item.name
		})

    }

    onRecentPress = () => {


        this.props.parentFlatList.getRecentName(this.props.item.name)


        this.setState({
            checkStatus: true
        })

    }

    componentDidUpdate(){
        if(this.state.checkStatus){
            this.props.parentFlatList.props.changeInput()
            this.props.parentFlatList.getCheckStatus(this.state.checkStatus)
        }

    }
	render() {

	    return(

		<TouchableOpacity
            ref={'ritem'}
			style={styles.itemBtn}
			onPress={this.onRecentPress}
			 >
				<Text
                    style={styles.itemText}
                    numberOfLines={1}
					>
					{this.props.item.name}
				</Text>

			</TouchableOpacity>

            )
        }
    }




export default class Recents extends Component{

    constructor(props) {
		super(props)
		this.state = ({
			deletedRowKey: null,
            itemRealName: '',
            checkStatusReal: null,
		})
    }

    async saveRecentData(){
        try {
            await AsyncStorage.setItem('@recents', JSON.stringify(recentsData));
            await AsyncStorage.setItem('@checkstt', this.state.checkStatusReal);
          } catch (error) {

          }
      }

    async getRecentsData(){

        try {
            const value = await AsyncStorage.getItem('@recents');
            this.setState({
                checkStatusReal: await AsyncStorage.getItem('@checkstt')
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
          } catch (error) {

          }
    }
    
	componentWillMount(){
         if(recentsData.length > 30){
            recentsData.length = 0
         }
            this.saveRecentData()
        //  }
      }

    componentDidMount(){
          this.getRecentsData()
    }

	refreshFlatList = (deletedKey) => {
		this.setState((prevState) => {
			return {
				deletedRowKey: deletedKey
			}
		})
	}
	getRecentName(realName){
		this.setState({
			itemRealName: realName
		})
    }
    getCheckStatus(checkStatus){
        this.setState({
			checkStatusReal: checkStatus
		})
    }


    render(){
        const revItems = recentsData.reverse();
        return(
			<View style={styles.recentStyle}>
                {renderIf(recentsData.length >= 4)(
				<FlatList
						ref={'rcnts'}
						numColumns = {2}
                        scrollEnabled = {false}
						data={revItems}
						renderItem={
							({item,index}) => {
							return(
								<FlatListItem
								ref={'ritem'}
								item={item}
								index={index}
								parentFlatList={this}

								>
								</FlatListItem>
							);
						}
						}
					>
					</FlatList>
                )}
				</View>
        );
	}
}




const styles = StyleSheet.create({

    itemText: {
        fontSize: 20,
        color: '#27278E',
        fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
		textAlign: 'center',

	},
    itemBtn: {
        margin: 10,
        padding: 10,
        backgroundColor: '#ECECEF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 100 ,
        width: 130,
        height: 50
    },
    recentStyle: {
       height: 150
    }



});
