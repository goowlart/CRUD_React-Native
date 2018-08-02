import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  Button,
  AsyncStorage,
  Alert,
} from 'react-native';

import api from './services/api';

export default class App extends Component {

  state = {
    loggedInUser: null,
    errorMessage: null,
  };

  signIn = async () => {
    try {
      const response = await api.post('/auth/authenticate', {
        email: 'goowlart@test4.com',
        password: '12345',
      });

     const { token, user } = response.data;

     await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:user', JSON.stringify(user)],
      ]);

     this.setState({ loggedInUser: user });

     Alert.alert('Successfully Logged In!');
    } catch (response){
     this.setState({ errorMessage: response.data.error });
    }
  };

  render() {
    return (
      <View style={styles.container}>
      { !!this.state.loggedInUser && <Text> { this.state.loggedInUser.email }</Text>}
      { !!this.state.errorMessage && <Text> { this.state.errorMessage }</Text>}
      <Button onPress={this.signIn} title="logIn" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
