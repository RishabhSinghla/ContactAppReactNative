import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Database} from '../DataBase/DataBase';

function UpdateContact({navigation}) {
  const route = useRoute();
  const onfocus = useIsFocused();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [phonenumber, setPhoneNumber] = useState(null);
  const [landmark, setLandmark] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    setId(route.params.data.id);
    setName(route.params.data.name);
    setPhoneNumber(route.params.data.phoneNumber);
    setLandmark(route.params.data.landmark);
    setImage(route.params.data.image);
  }, [onfocus]);

  function saveData() {
    Database.transaction(tx => {
      console.log('I am here');
      tx.executeSql(
        'UPDATE contactsdetails set name=?, number=?, landmark=?, image=? where id=?',
        [name, phonenumber, landmark, image, id],

        (txn, res) => {
          Alert.alert('Updated the data');
          navigation.goBack();
        },
      );
    });
  }

  function imageAdd() {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };
    launchImageLibrary(options, responce => {
      console.log(responce);
      console.log(responce.assets[0].uri);
      setImage(responce.assets[0].uri);
    });
  }
  return (
    <ImageBackground
      source={require('../Images/bg.jpg')}
      style={style.backgroundImage}>
      <TouchableOpacity onPress={() => imageAdd()}>
        <Image
          source={require('../Images/photo-camera.png')}
          style={style.imageSize}
        />
      </TouchableOpacity>
      <View style={style.container}>
        <Text style={style.namText}>Name: </Text>

        <TextInput
          style={style.inputText}
          //value={name}
          onChangeText={name => setName(name)}
          placeholder="Contact name"
        />
        <Text style={style.namText}>Phone Number: </Text>
        <TextInput
          style={style.inputText}
          onChangeText={phoneNum => setPhoneNumber(phoneNum)}
          placeholder="Phone number"
        />
        <Text style={style.namText}>Landmark: </Text>
        <TextInput
          style={style.inputText}
          onChangeText={landmark => setLandmark(landmark)}
          placeholder="Landmark"
        />
      </View>

      <View>
        <TouchableOpacity style={style.text} onPress={saveData}>
          <Text style={style.button}>update</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
const style = StyleSheet.create({
  text: {
    top: 400,
    left: 290,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
    marginBottom: 10,
    backgroundColor: 'green',
  },
  button: {
    color: 'black',
    fontSize: 30,
    padding: 10,
  },
  backgroundImage: {
    flex: 1,
    height: null,
    width: null,
  },
  container: {
    position: 'absolute',
    marginTop: 160,
    marginLeft: 140,
  },
  inputText: {
    fontSize: 20,
    borderColor: 'grey',
    borderWidth: 1,
    backgroundColor: 'lightgrey',
    fontStyle: 'italic',
    borderRadius: 10,
    marginBottom: 10,
  },

  namText: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageSize: {
    width: 120,
    height: 120,
    marginTop: 30,
    marginLeft: 150,
  },
});

export default UpdateContact;
