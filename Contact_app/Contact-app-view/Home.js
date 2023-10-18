import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
  TextInput,
} from 'react-native';
import {Database} from '../DataBase/DataBase';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useIsFocused} from '@react-navigation/native';

function Home({navigation}) {
  const [contactDetails, setContactDetails] = useState([]);
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();

  const getData = () => {
    Database.transaction(txn => {
      txn.executeSql('SELECT * FROM contactsdetails', [], (tx, res) => {
        var temp = [];
        for (let i = 0; i < res.rows.length; ++i) {
          temp.push(res.rows.item(i));
        }
        setContactDetails(temp);
      });
    });
  };

  function filterContacts() {
    if (search !== '') {
      Database.transaction(txn => {
        txn.executeSql(
          'SELECT * FROM contactsdetails WHERE name LIKE ?',
          [`${search}%`],
          (tx, res) => {
            var temp = [];
            for (let i = 0; i < res.rows.length; ++i) {
              temp.push(res.rows.item(i));
            }
            setContactDetails(temp);
          },
        );
      });
    } else {
      getData();
    }
  }

  useEffect(() => {
    getData();
  }, [isFocused]);

  function deleteContact(id) {
    Database.transaction(txn => {
      txn.executeSql(
        'DELETE FROM contactsdetails WHERE id=?',
        [id],
        (tx, res) => {
          Alert.alert('Contact is deleted');
          getData();
        },
      );
    });
  }

  const renderItem = data => (
    <View style={styles.rowFront}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('view contact', {
            contact: {
              id: data.item.id,
              name: data.item.name,
              phoneNumber: data.item.number,
              landmark: data.item.landmark,
              favorites: data.item.favorite,
              image: data.item.image,
            },
          })
        }>
        <Text style={styles.contacts}>{data.item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('updateContact', {
            data: {
              id: data.item.id,
              name: data.item.name,
              phoneNumber: data.item.number,
              landmark: data.item.landmark,
              image: data.item.image,
            },
          })
        }>
        <Image
          source={require('../Images/changes.png')}
          style={styles.deleteAndFavourite}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteContact(data.item.id)}>
        <Image
          source={require('../Images/delete.png')}
          style={styles.deleteAndFavourite}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../Images/bg.jpg')}
      style={styles.container}>
      <TextInput
        onChangeText={searchName => setSearch(searchName)}
        style={styles.searchStyle}
        placeholder="Search contact"
        clearButtonMode="always"
      />

      <TouchableOpacity
        onPress={filterContacts}
        style={styles.searchStyleButton}>
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>

      <SwipeListView
        data={contactDetails}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={80}
        rightOpenValue={-60}
        style={styles.swipeList}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('addContact')}>
        <Image
          source={require('../Images/plus.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => navigation.navigate('favoriteContact')}>
        <Image
          source={require('../Images/favourite.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contacts: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'black',
  },
  swipeList: {
    marginTop: 10,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  addButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    bottom: 30,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  favoriteButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    bottom: 30,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  buttonImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  rowFront: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 5,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteAndFavourite: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  searchStyle: {
    backgroundColor: 'white',
    width: '80%',
    padding: 12,
    borderRadius: 25,
    fontSize: 20,
    marginBottom: 20,
  },
  searchStyleButton: {
    width: 100,
    height: 45,
    backgroundColor: '#007bff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchText: {
    color: 'white',
    fontSize: 20,
  },
});

export default Home;
