import React, { useRef } from 'react';
import "./form.css";

import Question from "./components/Question/Question";
import questions from "./data/questions";
import FullScreen from "./components/FullScreen/FullScreen";
import { useEffect,useState } from 'react';
import { useStore } from './store';

import {CSSTransition,SwitchTransition} from "react-transition-group";
import {FaAngleUp,FaAngleDown, FaInfoCircle} from "react-icons/fa";
import { isvalidDate, isValidInput } from './components/Question/validators';
import {createPortal} from "react-dom";

import axios from "axios";
import SnackBar from './components/Utils/SnackBar';
const form_nav_logo=require("./icons/IC.png");


function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function Form ({onSubmitSuccess}){
    
    const [question,setQuestion]=useState(0);
    const [responses, dispatch] = useStore();
    const [direction,setDirection]=useState("up");
    const [prevResponse,setPrevResponse]=useState("");
    const [uploadProgress,setUploadProgess]=useState(0);
    const [loader,setLoader]=useState(false);

    const [showSnake,setShowSnake]=useState(false);

    const gestureView=useRef();

    function writeToStore(payload) {
          dispatch({
              type: "SET_RESPONSE",
              payload
          });
      }
      useEffect(()=>{
        const delayed = debounce(handleScroll, 200)
        window.addEventListener('mousewheel',delayed);
        return ()=>{
            window.removeEventListener("mousewheel",delayed);
        }
      }) 
    function handleScroll(e) {
        if (e.deltaY > 0) {
            nextQuestion();
        } else {
            prevQuestion();
        }
    }

      useEffect(()=>{
        let touchstartY = 0;
        let touchendY = 0;
        const gestureZone = document.querySelector(".app-form");
        gestureZone.addEventListener('touchstart',touchStart,false);

        gestureZone.addEventListener('touchend',touchEnd, false);
        function touchStart(event){
           touchstartY = event.changedTouches[0].screenY;
        }
        function touchEnd(event) {
           touchendY = event.changedTouches[0].screenY;
           handleGesture();
        }
        function handleGesture() {
            if(Math.abs(touchstartY-touchendY)<100) return;
            if (touchendY <= touchstartY) {
                console.log('Swiped up');
                nextQuestion();
            }

            if (touchendY >= touchstartY) {
                console.log('Swiped down');
                prevQuestion();
            }

        }
        return ()=>{
            gestureZone.removeEventListener("touchstart",touchStart);
            gestureZone.removeEventListener("touchend",touchEnd);
        }
      })



      useEffect(()=>{
          setPrevResponse(responses[questions[question].id]);
      }, [question, responses]);

      function nextQuestion(){
        setDirection("up");
        if(question<questions.length-1){
             setQuestion(question + 1);
        }
      }

      function prevQuestion(){
          setDirection("down");
          if(question>0){
              setQuestion(question - 1);
          }
      }
      function onSubmit(){
          //validate and pull the question
          for(let i=0;i<questions.length;i++){
              var _question=questions[i];
              var _value = responses[_question.id];

              if(_question.required){
                  
                  if(_question.type==="dob" && !isvalidDate(_value)){
                     return setQuestion(i);
                  }else if(_question.type==="file"){
                      if (_value == null){
                          return setQuestion(i);
                      }
                  }else if(!isValidInput(_value)){
                      return setQuestion(i);
                  }
                  
              }
              if (_question.should_equals_to) {
                  var _targetValue = responses[_question.should_equals_to] || "";
                  if ((_value || "") !== _targetValue) {
                      return setQuestion(i);
                  }
              }
          }
          //push the data to server
          const formData=new FormData();
          for(const key in responses){
              const value = responses[key];
              const _question=questions.find(q=>q.id==key);
              console.log(_question,"bubububu");
              if(_question.type==="file"){
                  formData.append("images",value);
              }else{
                  formData.append(key,value);
              }
          }

          
          const config = {
              onUploadProgress: function (progressEvent) {
                  var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                  console.log(percentCompleted);
                  setUploadProgess(percentCompleted);
              }
          }
          setLoader(true);
          axios.post("/form",formData,config).then(({data})=>{
              console.log(data);
              setUploadProgess(0);
              onSubmitSuccess();
              setLoader(false);
          }).catch(err=>{
              setUploadProgess(0);
              setLoader(false);
              setShowSnake(true);
          })
      }

        return (
            <div className="app-form">
               {
                 showSnake && (createPortal(
                    <SnackBar message="something went wrong,try again!" dismiss={()=>setShowSnake(false)}/>,
                    document.getElementById("portal")
                ))}   
              <Loader show={loader} progress={uploadProgress}/>
                <div className="form-nav">
                    <div className="nav-logo">
                       <img src={form_nav_logo} alt="imperial capital"/>
                    </div>
                </div>
                <FullScreen ref={gestureView}>
                  <SwitchTransition>
                    <CSSTransition appear in={true}
                         key={questions[question].id+""} 
                         timeout={400} classNames={`slide-${direction}`}
                         unmountOnExit
                         >
                        <Question 
                            data={questions[question]} 
                            key={questions[question].id+""} 
                            WriteToStore={writeToStore}
                            onNext={nextQuestion}
                            sn={question+1}
                            isFinal={question===questions.length-1}
                            onSubmit={onSubmit}
                            prevResponse={prevResponse}
                        />
                    </CSSTransition>
                    </SwitchTransition>
                </FullScreen>
                <div className="app-controls">
                    <button className="app-action submit" onClick={onSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        )
}

function Loader({show=false,progress=0}){
  if(!show) return null;
  
  return (
      <div className="loader-container">
          <div className="loader-card">
              <div className="loading-indicators">                 
                          <FaInfoCircle/>
              </div>
              <div className="loading-progress">
                  <div className="text">
                    <span>{progress}</span>%
                  </div>
              </div>
              <div className="loading-text">
                    {(progress===100)?(
                        <b>please wait,processing the documents</b>
                        ):
                        (<b>please wait,while we recording your response!</b>)
                    }
              </div>
          </div>
      </div>
  )
}

export default Form;


