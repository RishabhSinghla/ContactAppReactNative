import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {Database} from '../DataBase/DataBase';

function ViewContact({navigation}) {
  const route = useRoute();
  const onfocus = useIsFocused();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [phonenumber, setPhoneNumber] = useState(null);
  const [landmark, setLandmark] = useState('');
  const [image, setImage] = useState('');
  const [favoriteContact, setfavorite] = useState('');

  function favorite() {
    const favoriteCon = true;
    console.log(favoriteContact);
    if (favoriteContact != favoriteCon) {
      Database.transaction(txn => {
        txn.executeSql(
          'UPDATE contactsdetails SET favorite=? WHERE id=?',
          [favoriteCon, id],
          (res, tx) => {
            Alert.alert('favorite');
          },
        );
      });
    } else {
      const contactFavorite = false;

      Database.transaction(txn => {
        txn.executeSql(
          'UPDATE contactsdetails SET favorite=? WHERE id=?',
          [contactFavorite, id],
          (res, tx) => {
            Alert.alert('Unfavorite');
          },
        );
      });
    }
  }

  useEffect(() => {
    setId(route.params.contact.id);
    setName(route.params.contact.name);
    setPhoneNumber(route.params.contact.phoneNumber);
    setLandmark(route.params.contact.landmark);
    setImage(route.params.contact.image);
    setfavorite(route.params.contact.favorites);
  }, [onfocus]);
  return (
    <ImageBackground
      source={require('../Images/bg.jpg')}
      style={styles.container}>
      <TouchableOpacity onPress={() => favorite()}>
        <Image
          source={require('../Images/favourite.png')}
          style={styles.favoriteContact}
        />
      </TouchableOpacity>

      <View style={styles.contactBackGround}>
        <Image source={{uri: image}} style={styles.pic}></Image>
        <Text style={styles.textname}>Name: {name}</Text>
        <Text style={styles.textnum}>Number: {phonenumber}</Text>
        <Text style={styles.textlandmark}>Landmark: {landmark}</Text>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: null,
    width: null,
  },
  textname: {
    marginLeft: 60,
    marginTop: 35,
    fontSize: 20,
    fontWeight: '800',
  },
  textnum: {
    marginLeft: 60,
    marginTop: 15,
    fontSize: 20,
    fontWeight: '800',
  },
  textlandmark: {
    marginLeft: 60,
    marginTop: 15,
    fontSize: 20,
    fontWeight: '800',
  },
  contactBackGround: {
    backgroundColor: 'white',
    height: 300,
    width: 300,
    margin: 25,
    borderRadius: 35,
  },
  favoriteContact: {
    resizeMode: 'contain',
    bottom: 130,
    left: 150,
    width: 50,
    height: 50,
  },
  pic: {
    resizeMode: 'contain',
    top: 20,
    left: 110,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default ViewContact;
