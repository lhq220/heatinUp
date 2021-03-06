import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image
} from 'react-native';
import Home from '../components/Home';
import PushNotification from 'react-native-push-notification';

export default class HomeContainer extends Component {
    constructor() {
        super();
        this.state = {
            tracking: false,
            buttonText: 'Begin Tracking',
            locationService: 0
        };
        this.track = this.track.bind(this);
    }

    track() {
        if(!this.state.tracking) {
            this.setState({tracking: true, buttonText: 'Stop Tracking'});
            let watchID = setInterval(
                () => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            fetch('https://heatinup.herokuapp.com/api/addNewLocation', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    username: this.props.username,
                                    longitude: position.coords.longitude,
                                    latitude: position.coords.latitude
                                })
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    let msg = JSON.stringify(responseJson.isSameLocationTooLong) + JSON.stringify(responseJson.inSameSpot) + JSON.stringify(responseJson.isOutsideArea);
                                    msg = msg.replace(/['"]+/g, '');
                                    if(msg) {
                                        let date = new Date(Date.now());
                                        PushNotification.localNotificationSchedule({
                                            id: '1',
                                            message: msg,
                                            date
                                        });
                                    }
                                })
                                .catch((error) => {
                                    alert(error);
                                });
                        },
                        (error) => alert(JSON.stringify(error)),
                        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
                    );
                }, 5000);
            this.setState({locationService: watchID});
        } else {
            this.setState({tracking: false, buttonText: 'Start Tracking'});
            clearInterval(this.state.locationService);
        }
    }

    render() {
        return (
            <Home
                styles={styles}
                username={this.props.username}
                tracking={this.state.tracking}
                track={this.track}
                buttonText={this.state.buttonText}
            />
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        height: 60,
        width: 300,
        textAlign: 'center',
        fontSize: 22
    },
    button: {
        backgroundColor: '#5cafec'
    }
});