import React, { useState, useEffect } from "react";
import './App.css';
import {Row, Col, Input, Modal} from 'antd'

function App() {


  const fiveLetterWords = [
    "Cloud", "Tiger", "Dance", "Drink", "Bread", "Horse", "Smile", "Fruit", "Plant", "Queen",
    "Ocean", "Happy", "Magic", "Music", "Train", "Paint", "Water", "Apple", "Tiger", "House",
    "Rabbit", "Beach", "Mouse", "Laugh", "Sword", "Horse", "Angel", "Earth", "Heart", "Clock",
    "Snake", "Fairy", "Storm", "Wings", "Ghost", "Night", "Mouse", "Happy", "Light", "Stars",
    "Chess", "Brain", "Shoes", "Skirt", "World", "Fruit", "Plant", "Cloud", "Tiger", "Dance",
    "Music", "Train", "Paint", "Water", "Apple", "Tiger", "House", "Rabbit", "Beach", "Mouse",
    "Laugh", "Sword", "Horse", "Angel", "Earth", "Heart", "Clock", "Snake", "Fairy", "Storm",
    "Wings", "Ghost", "Night", "Mouse", "Happy", "Light", "Stars", "Chess", "Brain", "Shoes",
    "Skirt", "World", "Fruit", "Plant", "Cloud", "Tiger", "Dance", "Drink", "Bread", "Horse",
    "Smile", "Fruit", "Plant", "Queen", "Ocean", "Happy", "Magic", "Music", "Train", "Paint",
    "Water", "Apple", "Tiger", "House", "Rabbit", "Beach", "Mouse", "Laugh", "Sword", "Horse",
    "Angel", "Earth", "Heart", "Clock", "Snake", "Fairy", "Storm", "Wings", "Ghost", "Night",
    "Mouse", "Happy", "Light", "Stars", "Chess", "Brain", "Shoes", "Skirt", "World", "Fruit",
    "Plant", "Cloud", "Tiger", "Dance"
  ];

  const filledValue = [
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0]
];

  let [gridColor, setGridColor] = useState([
    ["white","white","white","white","white"],
    ["white","white","white","white","white"],
    ["white","white","white","white","white"],
    ["white","white","white","white","white"],
    ["white","white","white","white","white"],
    ["white","white","white","white","white"]
  ])

  const handleChange = (event, currentRow, currentColumn) => {
    filledValue[currentRow-1][currentColumn-1] = event.target.value;
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleEnterKeyPress = (event, currentRow) => {
    if (event.key === 'Enter') {
      var count=0;
      for(var i=0;i<5;i++){
        if(filledValue[currentRow-1][i] != 0)
          count++;
      }
      if(count===5){
        let countOfMatch = 0;
        for(var i=0;i<5;i++){
          if(secretWord[i].toLowerCase() === filledValue[currentRow-1][i].toLowerCase()){
            let gridColorNew = gridColor;
            gridColorNew[currentRow-1][i] = "green";
            setGridColor(gridColorNew);
            countOfMatch++;
          }

          else if(secretWord.includes(filledValue[currentRow-1][i].toLowerCase()) || secretWord.includes(filledValue[currentRow-1][i].toUpperCase())){
            let gridColorNew = gridColor;
            gridColorNew[currentRow-1][i] = "yellow";
            setGridColor(gridColorNew);
          }
        }
        
        if(countOfMatch == 5){
          setWon(true);
          showModal();
        }
        else{
          setDisabledRow(disabledRow+1);
          // let attemptRowNew = attemptRow;
          // attemptRowNew[currentRow].color = "white";
          // setAttemptRow(attemptRowNew);
        }
        if(currentRow===6)
          showModal();
      }
    }
  };

  
  let [disabledRow, setDisabledRow] = useState(2);
  let [attemptRow, setAttemptRow] = useState([{id:1, color:"white"}, {id:2, color:"white"}, {id:3, color:"white"}, {id:4, color:"white"}, {id:5, color:"white"}, {id:6, color:"white"}]);
  let [attemptColumn,setAttemptColumn] = useState([{id:1, color:"white"}, {id:2, color:"white"}, {id:3, color:"white"}, {id:4, color:"white"}, {id:5, color:"white"}]);
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [won, setWon] = useState(false);
  let [secretWord, setSecretWord] = useState("beast");
  let secretWordForYellowMatch = secretWord;

  useEffect(() => {
    const randomInt = Math.floor(Math.random() * 99);
    setSecretWord(fiveLetterWords[randomInt]);
  }, []);

  return (
    <div>
      <h1><b>Wordle Clone</b></h1>
      <h2>Welcome, Guess todays word in 6 tries!</h2>

      {attemptRow.map((e) => (
        <div key={e.id}>
        <Row gutter={[16, 16]}>
        {attemptColumn.map((c) => (
          <Col span={1} >
            {
              <Modal visible={isModalOpen} title={won? "Whoa, You have successfully guesed the word!":"Better luck next time!"}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel} 
              closable={false}
              cancelButtonProps={false}
              centered 
              style={{
                overflow:"auto", textAlignLast:"center",
              }}
              width={446}>
                {won?<p>Please refresh to play another game!</p>:<p>The Correct word was {secretWord}</p>}
              </Modal>
            }
          <Input 
            size="large" 
            style={{width:"70px", backgroundColor: gridColor[e.id-1][c.id-1]}}
            disabled={e.id>=disabledRow || e.id<disabledRow-1}
            onChange={(event)=>handleChange(event, e.id, c.id)}
            onKeyDown={event=>{handleEnterKeyPress(event, e.id)}}
            maxLength={1}
          />
          </Col>
        ))}
        </Row>
        </div>

      ))}
      
    </div>
  );
}

export default App;