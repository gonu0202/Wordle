import React, { useState, useEffect, useRef } from "react";
import './App.css';
import {Row, Col, Input, Modal, Switch} from 'antd'
import fiveLetterWords from './wordsList';

function App() {

  let [disabledRow, setDisabledRow] = useState(2);
  let [attemptRow, setAttemptRow] = useState([{id:1, color:"white"}, {id:2, color:"white"}, {id:3, color:"white"}, {id:4, color:"white"}, {id:5, color:"white"}, {id:6, color:"white"}]);
  let [attemptColumn,setAttemptColumn] = useState([{id:1, color:"white"}, {id:2, color:"white"}, {id:3, color:"white"}, {id:4, color:"white"}, {id:5, color:"white"}]);
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [won, setWon] = useState(false);
  let [secretWord, setSecretWord] = useState("beast");
  let [isValidWord, setIsValidWord] = useState(true);
  let [timer, setTimer] = useState(360);
  let [wrongAttemptCount, setWrongAttemptCount] = useState(5);
  let [isHard, setIsHard] = useState(false);

  let [filledValue,setFilledValue] = useState([
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0]
]);

let [usedLettersMap, setUsedLetterMap] = useState({
  "a": "black","b": "black","c": "black","d": "black",
  "e": "black","f": "black","g": "black","h": "black","i": "black",
  "j": "black","k": "black","l": "black","m": "black","n": "black",
  "o": "black","p": "black",
  "q": "black","r": "black","s": "black","t": "black","u": "black",
  "v": "black","w": "black","x": "black","y": "black","z": "black"
});

let [gridColor, setGridColor] = useState([
    ["white","white","white","white","white"],
    ["WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke"],
    ["WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke"],
    ["WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke"],
    ["WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke"],
    ["WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke","WhiteSmoke"]
])

  let inputRefs = useRef(Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => null)
  ));

  const handleChange = (event, currentRow, currentColumn) => {
    filledValue[currentRow-1][currentColumn-1] = event.target.value;
    setFilledValue(filledValue);

    if (currentColumn < 5 && event.target.value.length > 0) {
      if (inputRefs.current[currentRow - 1][currentColumn]) {
        inputRefs.current[currentRow - 1][currentColumn].focus();
      }
    }
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setIsModalOpen(false);
    window.location.reload();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const checkWordValidity = async (word) => {
    const apiKey = "ab82e310-8a48-4501-82fe-1d88840d5645";
    try {
      const response = await fetch(
        `https://dictionaryapi.com/api/v3/references/sd3/json/${word}?key=${apiKey}`
      );
  
      if (response.ok) {
        const data = await response.json();
        return data.length > 0 && typeof(data[0])==="object";
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleEnterKeyPress = async(event, currentRow, currentColumn) => {
    //focus change on backspace
    if (event.key === 'Backspace') {
      if (currentColumn <= 5 && currentRow <= 6) {
        if (event.target.value.length > 0 && inputRefs.current[currentRow-1][currentColumn-1]) {
          inputRefs.current[currentRow-1][currentColumn-1].focus();
        }
        else if(event.target.value.length === 0 && inputRefs.current[currentRow-1][currentColumn-2]) {
          inputRefs.current[currentRow-1][currentColumn-2].focus();
        }
      }
    }
    //handle events on enter
    else if (event.key === 'Enter') {
      var count=0;
      for(var i=0;i<5;i++){
        if(filledValue[currentRow-1][i] != 0)
          count++;
      }
      if(count===5){
        var enteredWord = filledValue[currentRow-1][0]+filledValue[currentRow-1][1]+filledValue[currentRow-1][2]+filledValue[currentRow-1][3]+filledValue[currentRow-1][4];
        var isValidWord = await checkWordValidity(enteredWord);
        if(!isValidWord){
          setIsValidWord(false);
          setWrongAttemptCount(wrongAttemptCount-1);
          if(wrongAttemptCount<=0 && isHard)
            showModal();
        }
        else{
          setIsValidWord(true);
          let countOfMatch = 0;
          for(var i=0;i<5;i++){
            if(secretWord[i].toLowerCase() === filledValue[currentRow-1][i].toLowerCase()){
              let gridColorNew = gridColor;
              gridColorNew[currentRow-1][i] = "green";
              setGridColor(gridColorNew);
              usedLettersMap[secretWord[i].toLowerCase()] = "green";
              setUsedLetterMap(usedLettersMap);
              countOfMatch++;
            }

            else if(secretWord.includes(filledValue[currentRow-1][i].toLowerCase()) || secretWord.includes(filledValue[currentRow-1][i].toUpperCase())){
              let gridColorNew = gridColor;
              gridColorNew[currentRow-1][i] = "yellow";
              setGridColor(gridColorNew);
              usedLettersMap[filledValue[currentRow-1][i].toLowerCase()] = "yellow";
              setUsedLetterMap(usedLettersMap);
            }
            else{
              usedLettersMap[filledValue[currentRow-1][i].toLowerCase()] = "LightGray";
              setUsedLetterMap(usedLettersMap);
            }
          }
          
          //Won
          if(countOfMatch == 5){
            setWon(true);
            setDisabledRow(disabledRow+1);
            showModal();
          }
          else{
            setDisabledRow(disabledRow+1);
            let gridColorNew = gridColor;
            for(var i=0;i<5;i++){
              if(currentRow<6)
                gridColorNew[currentRow][i] = "white";
              setGridColor(gridColorNew);
            }
          }

          //lost
          if(currentRow===6)
            showModal();

          //change focus to next column first row
          if (currentColumn <=5 && currentRow < 6) {
            if (inputRefs.current[currentRow][0]) {
              inputRefs.current[currentRow][0].focus();
            }
          }
        }
      }
    }
  };


  useEffect(() => {
    const randomInt = Math.floor(Math.random() * 199);
    setSecretWord(fiveLetterWords[randomInt]);

    if (inputRefs.current[0][0]) {
      inputRefs.current[0][0].focus();
    }

    // Timer logic
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    // Check if the timer should stop when it reaches 0
    setTimeout(() => {
      clearInterval(interval);
      showModal();
    }, 3600000); // 3600000 milliseconds = 3600 seconds = 60 minutes (1 hour)
  }, []);

  return (
    <div>
      <h1><b>Wordle Clone</b></h1>
      <h2>Welcome, Guess the secret word in 6 tries!</h2>

      <h3> Hard version <Switch onChange={()=>{setIsHard(!isHard);setTimer(360)}} /></h3>

      {isHard && <div className="timer-container">
        <h3 style={{ color: timer <= 10 ? "red" : "inherit" }}>
          Time Remaining: {timer} seconds
        </h3>
      </div>}

      {attemptRow.map((e) => (
        <div key={e.id}>
        <Row gutter={[16, 16]}>
          {attemptColumn.map((c) => (
            <Col span={1} >
              <Input 
                size="large" 
                style={{width:"70px", 
                  backgroundColor: gridColor[e.id-1][c.id-1], 
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
                disabled={e.id>=disabledRow || e.id<disabledRow-1}
                onChange={(event)=>handleChange(event, e.id, c.id)}
                onKeyDown={event=>{handleEnterKeyPress(event, e.id, c.id)}}
                maxLength={1}
                ref={(inputRef) => inputRefs.current[e.id-1][c.id-1] = inputRef}
              />
            </Col>
          ))}
        </Row>
        </div>
      ))}

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
          {won?<p>Click 'ok' to play new game!</p>:<p>The Correct word was {secretWord}, click 'ok' to play new game!</p>}
        </Modal>
      }

      {!isValidWord && <p style={{color:"red"}}>not a valid word!</p>}

      {isHard && <div className="attempt-container">
        <h3 style={{ color: "red"}}>
          Wrong Attempt Remaining: {wrongAttemptCount}
        </h3>
      </div>}

      <h3> Used Letters Info</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {Object.keys(usedLettersMap).map((key, index) => (
        <React.Fragment key={key}>
          <h3
            style={{
              color: usedLettersMap[key],
              margin: '0 10px',
              textAlign: 'center',
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold"
            }}
          >
            {key.toUpperCase()}
          </h3>
        </React.Fragment>
      ))}
    </div>
    </div>
  );
}

export default App;