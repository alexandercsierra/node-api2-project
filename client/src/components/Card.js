import React, {useState} from 'react'
import axios from 'axios'
import styled from 'styled-components'

export default function Card(props) {
    const {char, deleteChar, setReload, reload} = props;

    const [chars, setChars] = useState([]);
  const [add, setAdd] = useState(false);
  const [newChar, setNewChar] = useState({
    title: '',
    contents: ''
  })


  const onChange = e => {
    setNewChar({
      ...newChar,
      [e.target.name]: e.target.value
    })
  }

    const editChar = e => {
        e.preventDefault();
        console.log(typeof e.target.id);
        axios.put(`http://localhost:5001/api/posts/${Number(e.target.id)}`, newChar)
          .then(res=>console.log(res))
          .catch(err=>console.log(err))
          setEdit(false);
          setReload(!reload);
      }

    const [edit, setEdit] = useState(false);
    return (
        <CardContainer key={char.id}>
            <h2>{char.title}</h2>
            <p>{char.contents}</p>
            <DeleteBtn onClick={deleteChar} id={char.id}>delete</DeleteBtn>
            <EditBtn onClick={()=>{
                setEdit(!edit)
                setNewChar(char);
            }}>edit</EditBtn>
            {edit && <form id={char.id} onSubmit={editChar}>
              <input name='title' placeholder='title' value={newChar.title} onChange={onChange}/>
              <input name='contents' placeholder='contents' value={newChar.contents} onChange={onChange}/>
              <button id={char.id}>Submit</button>
            </form>}
          </CardContainer>
    )
}


const CardContainer = styled.div`
  // border: 1px solid red;
  width: 50%;
  margin: 4% auto;
  padding: 4%;
  border-radius: 25px;
  background: dodgerblue; 
  color: white;
`;

const EditBtn = styled.button`
  background: green;
  border: none;
  padding: 2% 0%;
  width: 10%;
  border-radius: 5px;
`;
const DeleteBtn = styled.button`
  background: red;
  border: none;
  padding: 2% 0%;
  width: 10%;
`;