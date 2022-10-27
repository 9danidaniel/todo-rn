import React, {Component} from 'react';
import {AppRegistery, Text, View, StyleSheet,TextInput,TouchableOpacity,ScrollView,Dimensions,FlatList, WebView, Linking, StatusBar,Platform, Image, LayoutAnimation, Keyboard, AsyncStorage, } from 'react-native';
import listsData from 'BusyApp/app/data/listsData.js'
import checklistData from 'BusyApp/app/data/checklistData.js'
import renderIf from 'BusyApp/app/helpers/renderif.js'
import Swipeable from 'react-native-swipeable';

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
  const newItem = {
    key: '',
    name: '',
    checked: false
}




  export default class ListsMF extends Component{

    constructor(props){
        super(props);

    		this.state = {
    			isAddClicked: false,
    			nlListText: '',
    			themeNameForreal: 'Light',
					lists: listsData,
					clickedOnKey: null,
					deletedRowKey: null,
					isEditPressed: false,
					editedIndex: null,
					pressedListText: '',
					isListDisabled: false,
    		}
	  }
		async saveData() {
			try {
				await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(listsData));
			} catch (error) {}
		}

		async saveLoadedState(){
			try {
				await AsyncStorage.setItem('@loaded', JSON.stringify(false));
			  } catch (error) {

			  }
		  }

		getRealKey(realKey){
			this.setState({
				clickedOnKey: realKey
			})

		}

	  onAddPress = () => {
		this.props.supportKeys()
		this.setState({
			isAddClicked: !this.state.isAddClicked,
			nlListText: "",
			isListDisabled: true,
			isEditPressed: false

		})
		LayoutAnimation.configureNext(CustomLayoutSpring);
		if(this.state.isEditPressed && this.state.isAddClicked){
			this.state.lists.splice(this.state.editedIndex, 1)
			this.props.setCurrList('0')
			this.saveData()

			// this.setState({
			// 	isListDisabled: false
			// })
		}
		if(this.state.isAddClicked){
			this.setState({
				isListDisabled: false
			})
		}

	  }


	  onEditPress = (value,index) => {
		this.props.supportKeys()
		this.setState({
			isAddClicked: !this.state.isAddClicked,
			  nlListText: value ,
			  isEditPressed: true,
			  editedIndex: index,
			  isListDisabled: true
		})
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
	  }


	  onTextChnge = (text) =>{
        this.setState({
           nlListText: text,

        })
	  }

    generateKey = () => {
        return require('random-string')({length: 8});
	}

	getFreshListTitle = (value) => {
		this.setState({
			pressedListText: value
		})
	}

    createNewList = () => {
			this.props.supportKeys()
			this.setState({
				nlListText: '',
				isAddClicked: !this.state.isAddClicked,
				isEditPressed: false,
				isListDisabled: false,
        isAllowNotif: false,
		 })
		 LayoutAnimation.configureNext(CustomLayoutSpring);

		 if (this.state.nlListText== '') {
			alert('write something')
		 }else{

	  // Check if the name exists.

	  if(this.state.isEditPressed){
		list = this.state.lists[this.state.editedIndex]
		_items = list.items
		this.state.lists.splice(this.state.editedIndex, 1, {
			key: this.generateKey(),
			name: this.state.nlListText,
			items: _items
		  })

	}else{
      if (listsData.find(x => x.name === this.state.nlListText)) {
        alert("Name already exists.");
        this.setState({
					 nlListText: '',

        })
        Keyboard.dismiss;
        return;
      }

      listsData.push(
        {
          key: this.generateKey(),
          name: this.state.nlListText,
          items: []
        }
	  )


	  this.saveLoadedState()


		}


	  this.setState({ lists: listsData })
	  Keyboard.dismiss;
	  this.saveData()

	}
	}





		refreshFlatList = (deletedKey) => {
			this.setState((prevState) => {
				return {
					deletedRowKey: deletedKey
				}
			})

		}



    render(){
        return(
          <View style={styles.mainContainer} ref={'listsmf'}>
				{/* List adder */}
				<View style={styles.mainAddContainer}>


				<TouchableOpacity
				style={styles.addContainer}
				onPress={this.onAddPress}
				>
					<Image
							resizeMode="contain"
							style = {[styles.addImg, this.state.isAddClicked && styles.addImgAlt]}
							source={this.state.isAddClicked ? this.state.isEditPressed ? require('BusyApp/app/images/Ic_delete_48px.svg.png') : require('BusyApp/app/images/pm-clear-vector.png') : require('BusyApp/app/images/pm-add-vector.png')
									}
							>
							</Image>

					</TouchableOpacity>


					{renderIf(this.state.isAddClicked)(
					<View style={styles.atContainer}>
					<TextInput
                            style={styles.adderText}
                            placeholder="Add new list"
                            autoFocus = {true}
                            value={this.state.nlListText}
                            underlineColorAndroid={'rgba(0,0,0,0)'}
                            onChangeText={(text) => this.onTextChnge(text)}
                            onSubmitEditing={ this.createNewList }
                        />
						</View>
						)}
						{renderIf(this.state.isAddClicked)(
						<TouchableOpacity
							style={styles.addContainer}
							onPress={this.createNewList}
							>
						<Image
							resizeMode="contain"
							style = {styles.checkImg}
							source={require('BusyApp/app/images/pm-check-vector.png')}
							>
							</Image>
							</TouchableOpacity>
							 )}
					</View>
					{/* List adder */}


				{/* Flatlist */}
				<FlatList
					style={styles.itemList}
					data={this.state.lists}
					extraData={this.state}
					disabled

					renderItem={
						({item,index}) => {
								return(
									<FlatListItem
									// ref={'listitem'}
									item={item}
									index={index}
									parentFlatList={this}
                  					setCurrList={this.props.setCurrList}
									>
									</FlatListItem>
								);
							}
							}
						>
						</FlatList>


            </View>
        );
	}
}





class FlatListItem extends Component {

	constructor(props) {
		super(props)
		this.state = ({
			isListEdited: false,
			activeRowKey: null,
		})
	}
	async savePureKey(){
		try {
				await AsyncStorage.setItem('@purekey', this.props.item.key);
			} catch (error) {

			}
	}

  onListItemPressed = ()=> {
		this.props.setCurrList(this.props.item.key)
		LayoutAnimation.configureNext(CustomLayoutSpring);
		this.savePureKey()
		//this.props.parentFlatList.getFreshListTitle(this.props.item.name)
		this.props.parentFlatList.props.getTitleList(this.props.item.name)
		this.props.parentFlatList.props.onPressOC()
	}
	onEditListReal = ()=> {
		if(this.props.item.name=='todo' || this.props.item.name=='busy'){

		}else{
			this.props.parentFlatList.onEditPress(this.props.item.name,this.props.index )
		//  this.props.parentFlatList.state.lists.splice(this.props.index, 1)
		}

	}


	render() {
		const leftContent = <Text></Text>;
		return(
			<Swipeable
				leftContent={leftContent}
				onLeftActionRelease ={() => {
					const deletingRow = this.state.activeRowKey;
					if(this.props.index==0){

					}else{
						this.props.parentFlatList.state.lists.splice(this.props.index, 1)
					}

								this.props.parentFlatList.refreshFlatList(deletingRow)
								LayoutAnimation.configureNext(CustomLayoutSpring);
								// this.props.parentFlatList.props.onReAdd()
								this.props.setCurrList('0')
								this.props.parentFlatList.saveData()

				}
				}
				disabled={this.props.parentFlatList.state.isListDisabled}
				>
		<TouchableOpacity
			style={styles.itemBtn}
	  onPress={this.onListItemPressed}
	  onLongPress={this.onEditListReal}
	  disabled={this.props.parentFlatList.state.isListDisabled}
			 >
				<Text
					style={styles.itemText}
					>
					{this.props.item.name}
				</Text>

			</TouchableOpacity>
			</Swipeable>
		)
	}
}



const styles = StyleSheet.create({
	itemText: {
		fontSize: 24,
		color: '#fff',
		fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
		textAlign: 'center',

	},
	addImg: {
		width: 22,
		height: 22,
		tintColor: '#fff',
		marginTop: 20,
		




	},
	addImgAlt: {
		width: 24,
		height: 24,
		//marginLeft: 20,
		marginTop: 10,

	},
	addImgAlt2:{
		width: 24,
		height: 24,
		marginLeft: 20,
		marginTop: 10,
	},
	adderText: {
		marginLeft: 0,
		height: 40,
		width: 240,
		color: '#2C2C54',
		fontSize: 24,
		fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
		textAlign: 'center',
		paddingVertical: 0,
	},
	checkImg: {
		width: 26,
		height: 26,
		marginTop: 10,
		tintColor: '#fff',
		marginLeft: 15,



	},
	atContainer: {
		 marginLeft: 15,
		padding: 2,
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderWidth: 2,
		borderColor: 'transparent',
		borderRadius: 100 ,

	},

    itemList: {
		marginTop: Platform.OS === 'ios' ? 10 : 5,
			marginBottom: 400

    },
    itemBtn: {
		margin: 8,

        justifyContent: 'center',
		alignItems: 'center',
	},


	addContainer: {
		justifyContent: 'center',
		alignItems: 'center',



	},
	mainAddContainer: {

		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',

	  },



});
