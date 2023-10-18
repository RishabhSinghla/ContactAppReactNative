import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ImageBackground, FlatList} from 'react-native';
import {Database} from '../DataBase/DataBase';

function Favorite() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    Database.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM contactsdetails where favorite= true',
        [],
        (tx, res) => {
          console.log('Your favorite persons');
          var temp = [];
          console.log(res);
          console.log(res.rows.length);
          let i = 0;
          while (i < res.rows.length) {
            temp.push(res.rows.item(i));
            ++i;
          }
          setContacts(temp);
        },
      );
    });
  }, []);

  return (
    <ImageBackground
      source={require('../Images/bg.jpg')}
      style={styles.backgroundImage}>
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.container}>
            <Text style={styles.text}>Person Name: {item.name}</Text>
            <Text style={styles.text}>Phone No.: {item.number}</Text>
          </View>
        )}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 20,
    color: 'grey',
    marginVertical: 5,
    marginLeft: 10,
  },
  backgroundImage: {
    flex: 1,
    height: null,
    width: null,
  },
});

export default Favorite;
