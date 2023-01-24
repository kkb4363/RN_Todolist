import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity ,Alert, TextInput, ScrollView} from 'react-native';
import { theme } from './color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const 로컬스토리지키 = '@TODO'


export default function App() {
  const [todo, setTodo] = useState({}),[working, setWorking] = useState(true),[text, setText] = useState(''),[done,setDone]=useState(false);
  const travel = () => setWorking(false),work = () => setWorking(true);
  const 입력 = (event) => {setText(event)}
  useEffect(() =>{
    투두표시();
  },[])

  const 투두저장 = async(todoSave) =>{
    await AsyncStorage.setItem(로컬스토리지키,JSON.stringify(todoSave))
  }
  const 투두표시 = async () => {
    const a =  await AsyncStorage.getItem(로컬스토리지키)
    a !== null ? setTodo(JSON.parse(a)) : null
  }

  const 투두추가 = async () => {
    if(text === '')return;
    // const newTodo = Object.assign(
    //   {}, todo, {[Date.now()]:{text, work:working}}
    // )
    const newTodo = {...todo, [Date.now()]:{text,working,done}}
    setTodo(newTodo)
    await 투두저장(newTodo)
    setText('');
  }
  
  const 투두삭제 = (key) => {
    Alert.alert('Todo 삭제','정말 삭제하시겠습니까?',[
      { text:'Cancel' },
      { text:"i'm sure",
        style:'destructive', 
        onPress:()=>{
        const newTodo = {...todo}
        delete newTodo[key]
        setTodo(newTodo)
        투두저장(newTodo)
      }}
    ])
    return
  }

  const 투두완료 = (key) => {
    const newTodo = {...todo}
    newTodo[key].done = true
    setTodo(newTodo)
    투두저장(newTodo)
  }

  const 되돌리기 = (key) => {
    const newTodo = {...todo}
    newTodo[key].done = false
    setTodo(newTodo)
    투두저장(newTodo)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.헤더}>
        <TouchableOpacity onPress={work}>
        <Text style={{...styles.버튼텍스트, color:working? 'white' : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
        <Text style={{...styles.버튼텍스트, color:working? theme.grey : 'white'}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        {/* keyboardType = 키보드 타입을 정할 수 있다. */}
        <TextInput 
        onSubmitEditing={투두추가}
        onChangeText={입력}
        returnKeyType='done'
        value={text}
        placeholder={working? '할 일을 추가해보세요' : '어디로 놀러 가실건가요?'} style={styles.인풋}></TextInput>
      </View>
      <ScrollView>
        {/* Object.keys는 object에서 key만 리턴하는 함수 */}
        {Object.keys(todo).map((key) => (
          todo[key].working === working && todo[key].done !== true ?
          (<View style={styles.투두} key={key}>
            <Text style={{...styles.투두텍스트,flex:2.7}}>
              {todo[key].text}
            </Text>
            <TouchableOpacity onPress={()=> 투두완료(key)} style={{marginRight:15}}>
            <FontAwesome name="check-circle" size={20} color="white" />            
            </TouchableOpacity>
            <TouchableOpacity onPress={() => 투두삭제(key)}>
            <Ionicons name="md-trash-bin" size={20} color='red' />
            </TouchableOpacity>
          </View>)
          : null
        ))}
      </ScrollView>
    <View style={styles.Done}>
      <Text style={styles.DoneText}>
        Finish
      </Text>
    </View>
          {Object.keys(todo).map((key)=>
          todo[key].working === working && todo[key].done === true ? 
            <View style={styles.투두} key={key}>
              <Text style={styles.투두텍스트}>
                {todo[key].text}
              </Text>
            <TouchableOpacity onPress={()=> 되돌리기(key)} style={{marginRight:15}}>
            <FontAwesome name="reply" size={20} color="white" />            
            </TouchableOpacity>
            </View> 
            :null
          )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  헤더:{
    justifyContent:'space-between',
    flexDirection:'row',
    marginTop:100
  },
  버튼텍스트:{
    fontSize:38,
    fontWeight:'600'
  },
  인풋:{
    backgroundColor:'white',
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius:30,
    marginVertical:20,
    fontSize:18
  },
  투두:{
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  투두텍스트:{
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  Done:{
    flexDirection:'row',
    justifyContent:'flex-start',
    marginBottom:10
  },
  DoneText:{
    fontSize:35,
    fontWeight:'500',
    color:'white'
  }
});
