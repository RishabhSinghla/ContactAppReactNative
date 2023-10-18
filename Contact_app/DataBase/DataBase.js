import {openDatabase} from 'react-native-sqlite-storage';

export let Database = openDatabase({
  name: 'contactdetails.db',
});
