import React from 'react';
import {  View, Image, Text} from 'react-native';
import { material } from 'react-native-typography'

// import NavBar from './components/NavBar.js';

const AppLogo = () => {

    const {appLogoStyle, logoTextStyle, headerStyle} = styles

    return (
    <View style={headerStyle}>
        <Image
          source={require('../../assets/onyx.png')}
        />
    </View>
    );
};




const styles = {
    headerStyle: {
        justifyContent: 'center',
        // justifyContent: 'flex-start', 
        flexDirection: 'row', 
        
        marginTop: 20, 
        marginLeft: 0,
        marginBottom: 30
    },
    appLogoStyle: {
        // justifyContent: 'center',
        // alignItems: 'center',
        marginLeft: 0,
        // alignSelf: 'flex-left',
        width: 100, 
        height: 27
    },
    logoTextStyle: {
        //figure out how to center the logo properly
        // justifyContent: 'flex-start',
        justifyContent:'center',
        flex: 1,
        paddingBottom: 10,
        color: "#ffffff",
        // color: '#4fffff',
        // color:  "#5fdcff",
        // color: "#00dcff",
        marginLeft: 40,
        backgroundColor: "#131313",
        // fontFamily: "vincHand",
        borderColor: 'black',
        alignSelf: 'center',
        alignItems:'center',
        fontSize: 36,
        fontFamily: 'Copperplate',
        textShadowColor: 'rgba(35,35, 35, 0.25)',
        textShadowOffset: {width: 3, height: 1},
        textShadowRadius: .4,
        elevation: 200
    }

}

export default AppLogo