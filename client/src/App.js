import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import Card from './components/Card'

function App() {
  const [chars, setChars] = useState([]);
  const [add, setAdd] = useState(false);
  const [reload, setReload] = useState(false);
  const [newChar, setNewChar] = useState({
    title: '',
    contents: ''
  })

  useEffect(()=>{
    axios.get('http://localhost:5001/api/posts')
      .then(res=>setChars(res.data))
      .catch(err=>console.log(err))
  },[reload])


  const onChange = e => {
    setNewChar({
      ...newChar,
      [e.target.name]: e.target.value
    })
  }

  const addOnSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5001/api/posts', newChar)
      .then(res=>setAdd(false))
      .catch(err=>console.log(err))
    setNewChar({
      title: '',
      contents: ''
    })
    setReload(!reload)
  }

  const deleteChar = e => {
    e.preventDefault();
    axios.delete(`http://localhost:5001/api/posts/${e.target.id}`)
      .then(res=>console.log(res))
      .catch(err=>console.log(err))
    setReload(!reload)
  }

  
  // console.log(chars);
  return (
    <div className="App">
      <button onClick={()=>setAdd(!add)}>Add</button>
      {add && <form onSubmit={addOnSubmit}>
        <input name='title' placeholder='title' value={newChar.title} onChange={onChange}/>
        <input name='contents' placeholder='contents' value={newChar.contents} onChange={onChange}/>
        <button>Submit</button>
      </form>}
      {chars && chars.map(char=>{
        console.log('char', char);
        return(
          <Card char={char} deleteChar={deleteChar} onSubmit={addOnSubmit} setReload={setReload} reload={reload} onChange={onChange}/>
        )
      })}
    </div>
  );
}


export default App;
