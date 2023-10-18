import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Database} from '../DataBase/DataBase';

function AddContact() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const favorite = false;

  useEffect(() => {
    Database.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='contactsdetails'",
        [],
        (tx, res) => {
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS contacts', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS contactsdetails(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), number INT(10), landmark VARCHAR(30), favorite BOOLEAN, image VARCHAR(200))',
              [],
            );
          }
        },
      );
    });
  }, []);

  const saveData = () => {
    if (name !== '' && phoneNumber !== '') {
      Database.transaction(txn => {
        txn.executeSql(
          'INSERT INTO contactsdetails(name, number, landmark, favorite, image) VALUES (?, ?, ?, ?, ?)',
          [name, phoneNumber, landmark, favorite, image],
          (tex, res) => {
            setName('');
            setPhoneNumber('');

            if (res.rowsAffected === 1) {
              Alert.alert('Data added to the database');
            }
          },
          error => {
            console.log(error);
          },
        );
      });
    } else if (name === '' || phoneNumber === '') {
      if (name === '' && phoneNumber === '') {
        Alert.alert('Name and Phone Number are mandatory');
      } else if (name === '') {
        Alert.alert('Name needs to be entered');
      } else {
        Alert.alert('Phone number needs to be entered');
      }
    }
  };

  const imageAdd = () => {
    const options = {
      storageOptions: {
        path: 'image',
      },
    };
    launchImageLibrary(options, response => {
      setImage(response.assets[0].uri);
    });
  };

  return (
    <ImageBackground
      source={require('../Images/bg.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity onPress={imageAdd}>
          {image ? (
            <Image source={{uri: image}} style={styles.image} />
          ) : (
            <Image
              source={require('../Images/photo-camera.png')}
              style={styles.image}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setName(text)}
          placeholder="Contact name"
        />

        <Text style={styles.label}>Phone No.:</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setPhoneNumber(text)}
          placeholder="Phone number"
        />

        <Text style={styles.label}>Landmark:</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setLandmark(text)}
          placeholder="Landmark"
        />

        <TouchableOpacity style={styles.button} onPress={saveData}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 22,
    color: 'black',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    fontSize: 18,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'white', 
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
});

export default AddContact;
