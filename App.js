import React, { useState, useEffect } from 'react';
import {Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import ENV from './env';
import * as firebase from 'firebase';
import 'firebase/firestore';

if (!firebase.apps.length)
  firebase.initializeApp(ENV);

const db = firebase.firestore();

export default function App() {
  const [lembrete, setLembrete] = useState('');
  const [lembretes, setLembretes] = useState([]);

  useEffect(() => {
    db.collection ('lembretes').onSnapshot ((snapshot) => {
      let aux = [];
      snapshot.forEach(doc => {
        aux.push({
          texto: doc.data().texto,
          data_hora: doc.data().data_hora,
          chave: doc.id
        })
      })
      setLembretes(aux);
    });
  }, []);

  const capturarLembrete = (lembrete) =>{
    setLembrete(lembrete);
  }

  const removerLembrete = (chave) => {
    Alert.alert(
      'Apagar?',
      'Quer mesmo apagar o seu lembrete?',
      [
        {text: 'Cancelar'},
        { text: "SIM", onPress: () => db.collection('lembretes').doc(chave).delete()}
      ]
    );
    
  }

  const adicionarLembrete = () => {
    db.collection('lembretes').add({
        texto: lembrete,
        data_hora: new Date() 
    });
    setLembrete('');
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.entrada} 
        placeholder="Digite seu lembrete"
        onChangeText={capturarLembrete}
        value={lembrete}
      />
      <View style={styles.botao}>
        <Button
          title="OK"
          onPress={adicionarLembrete}
        />
      </View>
      <FlatList 
        style={{marginTop: 4}}
        data={lembretes}
        renderItem={lembrete => (
          <TouchableNativeFeedback onLongPress={() => removerLembrete(lembrete.item.chave)}>
            <View style={styles.itemLista}>
              <Text>{lembrete.item.texto}</Text>
              <Text>{lembrete.item.data_hora.toDate().toLocaleString()}</Text>
            </View>
          </TouchableNativeFeedback>

        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 60,
  },
  entrada: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    fontSize: 16,
    textAlign: 'center',
    width: '80%',
    marginBottom: 12
  },
  botao: {
    width: '80%'
  },
  itemLista:{ 
    marginBottom: 8,
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  }
});
