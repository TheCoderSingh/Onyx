import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
} from 'react-native';
import { scanQRcode } from '../actions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class ScanScreen extends Component {
  constructor(props){
    super(props)
  }

  onSuccess(e) {
    this.props.scanQRcode(e.data)
    Actions.walletDetailExtended(this.props)
  }

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        topContent={
          <Text style={styles.centerText}>
          Scan QR Code
          </Text>
        }
      />
    );
  }
}

const mapStateToProps = ({wallet}) => {
  const { qrcodeValue } = wallet
  sendVisible = true
  return  { qrcodeValue, sendVisible }
};

export default connect(mapStateToProps, { scanQRcode })(ScanScreen);


const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
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
});