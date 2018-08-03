import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  Button,
  AsyncStorage, //AsyncStorage is a simple, unencrypted, asynchronous, persistent, key-value storage system that is global to the app. It should be used instead of LocalStorage.
  Alert,
} from 'react-native';

import api from './services/api'; //Settings with the server API

export default class App extends Component {

  state = { // Initialization of variables
    loggedInUser: null,
    errorMessage: null,
    projects: [],
  };

  signIn = async () => { 
    try { 
      const response = await api.post('/auth/authenticate', {  //Authentication route that is passed by the API
        email: 'goowlart@test4.com',
        password: '12345',
      });

     const { token, user } = response.data; //Response received from the database passed to two constants

     await AsyncStorage.multiSet([
        ['@CodeApi:token', token], 
        ['@CodeApi:user', JSON.stringify(user)], //Object coming from the database is converted into JSON
      ]);

     this.setState({ loggedInUser: user });

     Alert.alert('Successfully Logged In!');

    } catch (response){

     this.setState({ errorMessage: response.data.error }); 
    }
  };

  getProjectList = async () => {
    try {
      const response = await api.get('/projects');
      const { projects } = response.data;

      this.setState({ projects });
    } catch (response) {
      this.setState({ errorMessage: response.data.error });
    }
  };

  async componentDidMount(){ //save in history the token of the logged-in user if he closes the application
    const token = await AsyncStorage.getItem('@CodeApi:token');
    const user = JSON.stringify(await AsyncStorage.getItem('@CodeApi:user'));
    
    if (token && user)
      this.setState({ loggedInUser: user });
  }

  render() {
    return (
      <View style={styles.container}>
      { !!this.state.loggedInUser && <Text> { this.state.loggedInUser.nom }</Text>}
      { !!this.state.errorMessage && <Text> { this.state.errorMessage }</Text>}
      
      { this.state.loggedInUser
        ? <Button onPress={this.getProjectList} title="Load feed" 
        /> 
        : <Button onPress={this.signIn} title="signIn" 
        />
      }
      {this.state.projects.map(project => (
        <View key={project._id} style={{ marginTop: 15 }}>
        <Text style={{ fontWeight: 'bold' }}> { project.title } </Text>
        <Text> { project.description } </Text>
        </View>
        ))}
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
