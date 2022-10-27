import React, {Component} from 'react';
import {AppRegistery, Text, View, StyleSheet,TextInput,TouchableOpacity,ScrollView,Dimensions,FlatList,Image,TouchableWithoutFeedback,LayoutAnimation,Platform, Animated, Easing,AsyncStorage} from 'react-native';
import listsData from 'BusyApp/app/data/listsData.js'
import Swipeout from 'react-native-swipeout'
import Swipeable from 'react-native-swipeable';
import renderIf from 'BusyApp/app/helpers/renderif.js'
import Moment from 'moment';
import SortableList from 'react-native-sortable-list';

const window = Dimensions.get('window');
var PushNotification = require('react-native-push-notification');

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

var newOrderedItems = null;

export default class Checklist extends Component{
    constructor(props) {
		super(props)
		this.state = ({
			deletedRowKey: null,
			isRealEdited: false,
			itemRealName: '',
			realIndex: null,
			realChecked: false,
			time: null,
			itemKey: null,
			//SORTABLE CRAP
			isListConverted: false,
			draggedFromIndex: 'default',
			activatedDraggedItem: 'default',
			isReleased: false,
			sortedIndex: null,
			newSortedOrder: null,
			isDraggedToNewOrder: false,
			pureCLKey: '0',

      // Multi lists
			currList: listsData.find(x => x.key === this.props.getCurrentListKey()).items,
		})
		newOrderedItems = this.state.currList;
	}

	async saveData() {
    try {
      await AsyncStorage.setItem('@MySuperStore:key', JSON.stringify(listsData));
    } catch (error) {}
	}
	async getPureKey(){
    try {
    this.setState({
      pureCLKey: await AsyncStorage.getItem('@purekey')
    })
  }catch (error) {}
  }

	listTypeConverter = () => {
		this.setState({
			isListConverted: !this.state.isListConverted,
			isDraggedToNewOrder: false
		})
		if(this.state.isListConverted && this.state.isDraggedToNewOrder){


					const newKey = this.generateKey(24)
			newItem = {
				key: newKey,
				name: this.state.currList[this.state.activatedDraggedItem].name,
				checked: this.state.currList[this.state.activatedDraggedItem].checked,
				time: this.state.currList[this.state.activatedDraggedItem].time
			}


				this.state.currList.splice(this.state.activatedDraggedItem,1)
				this.state.currList.splice(this.state.sortedIndex,0, newItem);

				LayoutAnimation.configureNext(CustomLayoutSpring);


			this.refreshFlatList(newKey)


		}
		LayoutAnimation.configureNext(CustomLayoutSpring);
		this.saveData()



	}

	generateKey = (numberOfCharacters) => {
		return require('random-string')({length: numberOfCharacters});
    }

	refreshFlatList = (deletedKey) => {
		this.setState((prevState) => {
			return {
				deletedRowKey: deletedKey
			}
		})


	}
	getItemRealName(realName){
		this.setState({
			itemRealName: realName
		})
	}
	getItemRealKey(realKey){
		this.setState({
			itemKey: realKey
		})
	}

	getItemIndex(realIndexPar){
		this.setState({
			realIndex: realIndexPar
		})
	}

	getRealEdited(realEditedPar){

			this.setState({
				isRealEdited: realEditedPar
			})


	}

	getRealChecked(realCheckedPar){
		this.setState({
			realChecked: realCheckedPar
		})
	}

	setTime(time) {
		this.setState({
			time: time
		})
	}

  setIsAllowNotif(val) {
    this.setState({
			isAllowNotif: val
		})
  }

	///SORTABLE CRAP****
	onReleaseDraggedItem(key){
  //   if(this.state.isDraggedToNewOrder){
  //   this.setState({
  //     draggedFromIndex: key,
  //     // isListConverted: true,
  //     isReleased: true,

	// 	})

	// }
	
	this.listTypeConverter()


	}
	



  onActivatedDraggedItem(key){
    this.setState({
      activatedDraggedItem: key
    })
  }


  getNewSortableOrder(newOrder){
    this.setState({
      newSortedOrder: newOrder,
      isDraggedToNewOrder: true
    })

    for (var i=0; i<newOrder.length; i++){
      if(this.state.activatedDraggedItem == newOrder[i]){
        this.setState({
          sortedIndex: i
        })

      }
    }

	}
	//****** */

	componentDidUpdate(){

		if(this.state.isListConverted && this.state.isReleased && this.state.isDraggedToNewOrder){
			this.setState({
				isReleased: false
			})

		}



	}
	componentDidMount(){
		 this.getPureKey()

	}
	componentWillReceiveProps(){
		if(this.state.pureCLKey!= '0' && this.state.pureCLKey!= null ){
			list = listsData.find(x => x.key === this.props.getCurrentListKey())
			if (!list)
				list = listsData['0']
			this.setState({
				currList: list.items,
			})
		}
	}



	render(){
        return(
			<View>

					 {renderIf(this.state.currList.length == 0 && !this.props.checklist && !this.props.isPhed)(
						<View style={styles.phContainer}>
            	<Text style={styles.phText}>Enjoy your day!</Text>
               <Image
                resizeMode="contain"
                style = {styles.phImage}
                source={require('BusyApp/app/images/img_570192.png')}
                >
                  </Image>
                </View>
					 )}


				 {renderIf(this.state.currList.length > 0 && this.state.isListConverted)(

				 <View style={styles.sortableContainer}>
				 <TouchableOpacity
				 style={styles.sortBtn}
				 onPress={this.listTypeConverter}>
						  <Image
                        resizeMode="contain"
                        style = {styles.sortImage}
                        source={require('BusyApp/app/images/pm-sort-vector.png')}
                        >
                        </Image>
					 </TouchableOpacity>



					
					<SortableList
						style={styles.itemListSortable}
						contentContainerStyle={styles.contentContainer}
						data={this.state.currList}
						renderRow={this._renderRow}
						onReleaseRow={(key) => this.onReleaseDraggedItem(key)}
						onChangeOrder={(nextOrder) => this.getNewSortableOrder(nextOrder)}
						onActivateRow={(key) => this.onActivatedDraggedItem(key)}
						scrollEnabled={true}
						
						/>
					

     			 </View>
)}


				{renderIf(this.state.currList.length > 0 && !this.state.isListConverted)(
				<FlatList
						ref={'chklist'}
						scrollEnabled={!this.props.checklist}
						style={[styles.itemList, this.props.checklist && styles.itemListAlt]}
						data={this.state.currList}
						renderItem={
							({item,index}) => {
							return(
								<FlatListItem
								ref={'listitem'}
								item={item}
								index={index}
								currList={this.state.currList}
                getCurrentListKey={this.props.getCurrentListKey}
								parentFlatList={this}/>
							);
						}
						}
					>
					</FlatList>
					 )}

				</View>
			);
		}

		// Sortable item rendering
		_renderRow = ({data, active}) => {
			return <Row data={data} active={active} />
		  }

	}










	//FLAT LIST ITEM
	class FlatListItem extends Component {
    breakEditLoop = true;
		constructor(props) {
			super(props)
			this.state = ({
				activeRowKey: null,
				checkStatus: false,
				isEdited: false,
				transItemName: this.props.item.name,
				currList: this.props.currList
			})

		}
		reAddCheckedItem(){
			const deletingRow = this.state.activeRowKey;
			this.props.parentFlatList.refreshFlatList(deletingRow)
			this.props.parentFlatList.getRealEdited(this.state.isEdited)
			this.props.parentFlatList.getItemRealName(this.props.item.name)
			this.props.parentFlatList.getItemRealKey(this.props.item.key)
			this.props.parentFlatList.getItemIndex(this.props.index)
			this.props.parentFlatList.getRealChecked(this.state.checkStatus)
			this.props.parentFlatList.setTime(this.state.time);

      listsData.find(x => x.key === this.props.getCurrentListKey()).items.splice(this.props.index, 1)
			LayoutAnimation.configureNext(CustomLayoutSpring);
			this.props.parentFlatList.props.onReAdd()
		}

    toggleCheckStatus() {
      this.setState({
        checkStatus: !this.state.checkStatus
      });

      this.reAddCheckedItem()
    }

		RealEditForreal = () => {
      this.setState({
				isEdited: true
			})

			this.props.parentFlatList.getItemRealName(this.props.item.name)
			this.props.parentFlatList.getItemIndex(this.props.index)
			this.props.parentFlatList.setTime(this.props.item.time)
			this.props.parentFlatList.props.getBackedTime(this.props.item.time)
		}

    componentDidUpdate() {
    		if(this.state.isEdited){
					const deletingRow = this.state.activeRowKey;
					
          listsData.find(x => x.key === this.props.getCurrentListKey()).items.splice(this.props.index, 1)

          this.props.parentFlatList.refreshFlatList(deletingRow)
          this.props.parentFlatList.getRealEdited(this.state.isEdited)
          this.props.parentFlatList.props.onToggle()
          this.props.parentFlatList.setTime(this.state.time)
    		}
    }

		render() {
			const leftContent = <Text></Text>;

			return(
				<Swipeable
				leftContent={leftContent}
				onLeftActionRelease ={() => {
					const deletingRow = this.state.activeRowKey;
					this.state.currList.splice(this.props.index, 1)
					this.props.parentFlatList.refreshFlatList(deletingRow)
					LayoutAnimation.configureNext(CustomLayoutSpring);
					this.props.parentFlatList.props.onReAdd()
					this.props.isPhed == false
        }
			}
				ref={'listitem'}>

				<TouchableOpacity
					style={styles.itemBtn}
					disabled={this.props.parentFlatList.props.checklist}
					onPress={this.RealEditForreal}
					onLongPress={this.props.parentFlatList.listTypeConverter}>


						<Text
							adjustsFontSizeToFit={true}
							allowFontScaling={true}
							minimumFontScale={0.01}
							numberOfLines={4}
							style={[styles.itemText, this.props.parentFlatList.props.checklist && styles.itemTextAlt]}
							>
							{this.props.item.name}
						</Text>
						{renderIf(this.props.item.time)(
						<Text style={[styles.timeText, this.props.parentFlatList.props.checklist && styles.timeTextAlt]}>
							{Moment(this.props.item.time).format('H:mm')}
						</Text>
					)}

					</TouchableOpacity>
					
				</Swipeable>
			)
		}
	}





	//SORTABLE LIST ITEM
	class Row extends Component {

		constructor(props) {
		  super(props);

		  this._active = new Animated.Value(0);

		  this._style = {
			...Platform.select({
			  ios: {
				transform: [{
				  scale: this._active.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 1.1],
				  }),
				}],

			  },

			  android: {
				transform: [{
				  scale: this._active.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 1.07],
				  }),
				}],

			  },
			})
		  };

		}

		componentWillReceiveProps(nextProps) {
		  if (this.props.active !== nextProps.active) {
			Animated.timing(this._active, {
			  duration: 300,
			  easing: Easing.bounce,
			  toValue: Number(nextProps.active),
			}).start();
		  }
		}

		render() {
		 const {data, active} = this.props;
		 const leftContent = <Text></Text>;

		  return (
			<Animated.View style={[
			  styles.row,
			  this._style,
			]}>
			<Image
				resizeMode="contain"
        style = {styles.lineBtn}
        source={require('BusyApp/app/images/pm-line-vector.png')}>
				</Image>
			 <Swipeable
			  leftContent={leftContent}
			  onLeftActionRelease ={() => {

			  }
			  }
			  >
			  <TouchableOpacity
				  style={styles.itemBtnSortable}

				   >
					  <Text
						   style={styles.itemText}
						  >
						  {data.name}
					  </Text>

				  </TouchableOpacity>
			  </Swipeable>
			</Animated.View>
		  );
		}
	  }











const styles = StyleSheet.create({

    itemText: {
				width:250,
				flex:1,

        fontSize: 25,
				color: '#27278E',

		fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
		textAlign: 'center',

	},
	itemTextAlt: {
		// textDecorationLine: 'line-through',
		opacity: 0
	},

  itemBtn: {
		margin: Platform.OS === 'ios' ? 15 : 15,
    justifyContent: 'center',
		alignItems: 'center',


	},

	itemList: {
		marginTop: Platform.OS === 'ios' ? 0 : 5,
		// marginBottom: height/2+180,
		height: height-200

	},
	itemListAlt: {
		marginTop: 0
	},
	phContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	phText: {
		color: '#000',
		opacity: 0.6,
		fontSize: 25,
		marginTop: 20,
		marginLeft: 50,
		marginRight: 50,
		textAlign: 'center',
		fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'Raleway-Light',
	},
	phImage: {
    width: 34,
    height: 34,
		tintColor: '#000',
		marginTop: 25,
		opacity: 0.3,
	},
	timeText: {
		fontSize: 20,
		marginTop: 5,
		color:'#27278E',
		fontFamily: Platform.OS === 'ios' ? 'helveticaneue-Light' : 'HelveticaNeue Light',
	},
	timeTextAlt: {
		opacity: 0
	},

	sortableContainer: {

		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#fff',

	
		
	  },
	  contentContainer: {
		width: window.width,


		...Platform.select({
		  ios: {
			paddingHorizontal: 0,
		  },

		  android: {
			paddingHorizontal: 0,
		  }
		})
	  },
	  row: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		



		borderRadius: 4,


		...Platform.select({
		  ios: {
			width: window.width ,

		  },

		  android: {
			width: window.width - 30 * 2,
			elevation: 0,
			marginHorizontal: 30,
		
		  },
		})
	  },
	  itemBtnSortable: {
			margin: Platform.OS === 'ios' ? 15 : 15,
			justifyContent: 'center',
			alignItems: 'center',
			alignSelf:'baseline'
		},
		itemListSortable: {
			width: width,
			height: height-250

			

		},
		sortImage: {
			width: 35,
			height: 35,
			tintColor: '#fff'
	},
	sortBtn: {
		marginTop: 20,
		backgroundColor: '#27278E',
		borderColor: 'transparent',
		padding: 10,
		borderWidth: 2,
		borderRadius: 100,
		//opacity: 0.8
},
lineBtn: {
	width: 25,
	height: 25,
	tintColor: '#27278E',
	marginLeft: 50
},
sortableListStyle: {
	height: 100,
}






});
