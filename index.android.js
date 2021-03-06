import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AsyncStorage
} from 'react-native';
import  Router  from 'react-native-simple-router';
import LoginContainer from './js/containers/LoginContainer';
import LogoutButton from './js/components/LogoutButton';
import BackButton from './js/components/BackButton';
import PushNotification from 'react-native-push-notification';

export default class heatinUp extends React.Component {

    componentDidMount() {
        PushNotification.configure({
            onNotification: function(notification) {
                console.log( 'NOTIFICATION:', notification );
            }
        });
    }

    render() {
        return (
            <Router
                firstRoute={login}
                headerStyle={styles.header}
                titleStyle={styles.title}
                backButtonComponent={BackButton}
                rightCorner={LogoutButton}
            />
        );
    }
}

const login = {
    name: 'HeatinUp',
    component: LoginContainer
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#5cafec'
  },
  title: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 3
  }
});


AppRegistry.registerComponent('heatinUp', () => heatinUp);
