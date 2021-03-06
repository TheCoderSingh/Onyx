import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Clipboard, List, FlatList, Keyboard } from 'react-native';
import { Card, CardSection, Button } from './common';
import { WeiToEther } from '../Util.js'
import { walletViewChanged, selectWalletChart, scanQRcode, getWalletTxs, sendTx } from '../actions';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import Dialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import { Hoshi } from 'react-native-textinput-effects';
import { Actions } from 'react-native-router-flux'
import { relative } from 'path';
import TxDetail from './TxDetail.js';

class WalletDetailExtended extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            sendVisible: false,
            receiveVisible: false,
            copytext: "",
            toAddress: "",
            txAmount: "",
            popupHeight: 800,
        }
        
        this.renderItem = this.renderItem.bind(this)
        this.onSendPress = this.onSendPress.bind(this)
    }

    componentWillMount() {
        Keyboard.addListener('keyboardWillShow', this._keyboardDidShow)
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
        if (this.props.sendVisible != null) {
            this.setState({ sendVisible: this.props.sendVisible}) 
        }
        if(this.props.qrcodeValue != null) {
            this.setState({ toAddress: this.props.qrcodeValue})
        }
        this.props.getWalletTxs(this.props.wallet.publicKey);
    }
    _keyboardDidShow = (e) => {
        this.setState({
            popupHeight: 800 + e.endCoordinates.height/3.5
        })
    }
  
    _keyboardDidHide = () => {
        this.setState({
            popupHeight: 800
        })
    }

    renderItem(tx) {
        return (
            <View style={styles.tabStyle}>
                <TxDetail key={tx.index} tx={tx.item} publicKey={this.props.wallet.publicKey}/> 
            </View>
        );   
    }

    emptyTxList () {
        return (
            <View style={styles.tabStyle}>
                <Text>No Txs</Text>
            </View>
        );   
    }

    onWalletPress () {
        const {wallet} = this.props
        this.props.walletViewChanged(wallet.currency)
        this.props.selectWalletChart(wallet.currency)
    }

    onReceivePress() {
        this.setState({receiveVisible: true})
    }

    onSendPress() {
        this.setState({sendVisible: true})
    }

    onTxSend() {
        this.props.sendTx(this.props.wallet.publicKey, this.props.wallet.privateKey, this.state.toAddress, this.state.txAmount, .00015 )
    }
    
    onScanPress() {
        this.setState({sendVisible: false})
        Actions.qrcodeScanner(this.props)
    }

    writeToClipboard = async () => {
        await Clipboard.setString(this.props.wallet.publicKey);
        alert("Copied!");
    };

    render () {
        const { priceView } = this.props
        const { name, currency, publicKey } = this.props.wallet;
        const { headerContentStyle, headerTextStyle, 
            thumbnail_style, thumbnailContainerStyle,
            amountContentStyle, screenStyle, txStyle, footerStyle, listStyle } = styles;
        return ( 
            <View style={screenStyle}>
                <View >
                <Card>
                    <View style={{marginBottom: -3}}>
                        <CardSection > 
                            <View style={thumbnailContainerStyle}>
                                <Image style={thumbnail_style} source={require('../assets/btc.png')}/>
                            </View>
                            <View style={headerContentStyle}>
                                <Text style={headerTextStyle}> {name} </Text>
                            </View>
                            <TouchableOpacity onPress={() => this.onWalletPress()}>
                                <View style={amountContentStyle}>
                                {shownCardValue(priceView[currency], this.props)}
                                </View>
                            </TouchableOpacity>
                        </CardSection>
                    </View>
                </Card>
                </View>
                <View style={listStyle}>
                <FlatList 
                    style={txStyle}
                    data={this.props.txs}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={this.emptyTxList}
                />
                </View>
                <View>
                <CardSection style={footerStyle}>
                    <Button onPress={() => {
                        this.onSendPress();
                        }}>
                        Send 
                    </Button>        
                    <Button onPress={() => {
                        this.onReceivePress()
                        }}>
                        Recieve 
                    </Button>
                </CardSection>
                <KeyboardAvoidingView
                    behavior="padding"
                    keyboardVerticalOffset={20}
                >
                <View style={styles.sendPopup}>
                <Dialog
                    width={1}
                    height={this.state.popupHeight}
                    rounded
                    visible={this.state.sendVisible}
                    dialogStyle={styles.sendPopup}
                    onDismiss={() => {
                        this.setState({ sendVisible: false });
                    }}
                    onTouchOutside={() => {
                        this.setState({ sendVisible: false });
                    }}
                    dialogTitle={
                        <DialogTitle
                          title="Send"
                          hasTitleBar={false}
                          textStyle={{ color: '#11f' }}
                        />
                    }
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >
                    <View>
                        <Hoshi
                            label={'address'}
                            value={this.state.toAddress}
                            borderColor={'#00dcff'}
                            backgroundColor={'#FFFFFF'}
                            onChangeText={(text) => { this.setState({toAddress: text}) }}
                            />
                        <TouchableOpacity style={{position: relative, alignSelf: 'flex-end'}}onPress={() => this.onScanPress()}>
                            <Image style={styles.imageStyle}source={require('../assets/photo-camera.png')} />
                        </TouchableOpacity>
                        <Hoshi
                            label={'amount'}
                            value={this.state.txAmount}
                            borderColor={'#00dcff'}
                            backgroundColor={'#FFFFFF'}
                            onChangeText={text => this.setState({ txAmount: text })}
                        />
                        <CardSection style={footerStyle}>
                            <Button onPress={() => {
                                this.onTxSend();
                                }}>
                                Send 
                            </Button>        
                        </CardSection>
                    </View>
                </Dialog>
                </View>
                </KeyboardAvoidingView>
                <Dialog
                    width={1}
                    rounded
                    visible={this.state.receiveVisible}
                    onDismiss={() => {
                        this.setState({ receiveVisible: false });
                    }}
                    onTouchOutside={() => {
                        this.setState({ receiveVisible: false });
                    }}
                    dialogTitle={
                        <DialogTitle
                          title="Receive"
                          hasTitleBar={false}
                          textStyle={{ color: '#11f' }}
                        />
                      }
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                >
                <View style={styles.bigqrcodeStyle}>
                    <QRCode
                        value={publicKey}
                        size={300}
                        logoSize={30}
                        logoBackgroundColor='transparent'
                    />
                </View>
                <View>
                    <Text onPress={this.writeToClipboard}>{publicKey}</Text>
                </View>
                </Dialog>
            </View>
        </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const expanded = state.wallet.selectedWalletId === ownProps.wallet.currency;
    const {priceView, qrcodeValue, txs, coinPrices} = state.wallet
    return  {priceView, qrcodeValue, txs, coinPrices, expanded}
};

export default connect(mapStateToProps, {walletViewChanged, selectWalletChart, scanQRcode, getWalletTxs, sendTx})(WalletDetailExtended);

const styles = {
    screenStyle: {
        marginTop: 20
    },
    qrcodeStyle: {
        marginTop: 20,
        marginLeft:20,
        marginRight:20,
        marginBottom: 20,
        alignItems: 'center',
    },
    bigqrcodeStyle: {
        marginTop: 30,
        marginLeft:20,
        marginRight:20,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerContentStyle: {
        flex: 1, 
        justifyContent: 'center',
    },
    headerTextStyle: {
        fontSize: 18,
        color:  "#121212"
    },
    thumbnail_style: {
        height: 50,
        width: 50,
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    imageStyle: {
        flex: 1,
        marginTop:20,
        marginRight: 10,
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    amountContentStyle: {
        flex: 1,
        justifyContent: 'center',
    },
    footerStyle: {
        position:"absolute",
        bottom:0,
        height:60,  
        background:"#6cf",
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        colorText: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
    sendPopup: {
        marginTop: 550,
    },
    txStyle: {
        marginTop: 20,
        marginBottom:20,
    },
    listStyle: {
        height: "40%",
    }
}

shownCardValue  = (valueView, ownProps) => {
    const { coinPrices } = ownProps
    const { amount, currency } = ownProps.wallet;
    switch( valueView ) {
        case 0:
            return  (<Text> {WeiToEther(amount) + " " + currency} </Text>);
        case 1:
            return (<Text> {"$" + (WeiToEther(amount)*coinPrices["BTC"]).toFixed(2)} </Text>)
        case 2:
            return (<Text> {"$" + coinPrices[currency]} </Text>);
        default:
            return  (<Text> {(WeiToEther(amount)) + " " + currency} </Text>);
    }
}