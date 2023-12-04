import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';



export default function SearchForm({onSearch}) {

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const [departDate, setDepartDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());

    const onSearchPress = () => {
        onSearch({from, to, departDate, returnDate});
    };

    return (
        <View style={styles.card}>

            <Text style={styles.title}>Find the best prices for your next trip</Text>

            <TextInput value={from} /*/onChangeText={(newVal) => setFrom(newVal)} /*/ onChangeText={setFrom} placeholder="From " style={styles.input}/>

            <TextInput value={to} onChangeText={setTo}placeholder="To " style={styles.input}/>


            <View style={styles.datePicker}>

                <AntDesign name="calendar" size={26} color="black" />

                <DateTimePicker 
                    value={departDate} onChange={(event, date) => setDepartDate(date || new Date())}
                    minimumDate={new Date()} />

                <Text style={{fontSize:20, color: 'gainsboro', marginLeft: 10}}>|</Text>

                <DateTimePicker 
                    value={returnDate} 
                    onChange={(event, date) => setReturnDate(date || new Date())}
                    minimumDate={departDate}
                />

            </View>
            

            <Button title="Search" onPress={onSearchPress}/>

        </View>

    ); 

}

//search for react native shadow generator online, copy

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        margin: 10,
        padding: 15,
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,

        elevation: 15,
    },

    title: {
        alignSelf: 'center',
        fontWeight: '500',
        fontSize: 16,
        marginVertical: 15,
    },

    input: {
        borderWidth: 1,
        borderColor: 'gainsboro',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5, 
    },

    datePicker: {
        borderWidth: 1,
        borderColor: 'gainsboro',
        padding: 5,
        marginVertical: 5,
        borderRadius: 5,

        flexDirection: 'row',
        // all View childs will be on the same row

        alignItems: 'center',
        //horizontally aligns items to the center
    }

    //search for vector expo icons online for icons


})