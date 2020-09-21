import React from 'react'

import "./styles/dashboard.css";
import { FaEye, FaDownload } from 'react-icons/fa';
import {useEffect,useState} from "react";
import Axios from 'axios';
import questions from '../data/questions';
import ReactMarkdown from 'react-markdown/with-html';

import {FaFolder} from "react-icons/fa";

const nav_logo=require("../icons/IC.png");

function DashBoard() {
     const [showDetails,setShowDetails]=useState(false);
     const [responses,setResponses]=useState([]);
     const [formId,setFormid]=useState(0);
     const [loading,setLoading]=useState(false);
     const [skip,setskip]=useState(0);
     const [completed,setCompleted]=useState(false);
     useEffect(()=>{
        loadApplications();
     },[]);

     function loadApplications(){
         if(completed || loading) return;
         setLoading(true);
         Axios.get("/applications",{params:{skip:skip}}).then(({data})=>{
           console.log(data);
           setResponses(prev=>[...prev,...data.applications]);
           setCompleted(data.completed);
           setskip(skip+data.applications.length);
        }).catch(err=>{
            console.log(err);
        }).finally(()=>{
            setLoading(false);
        })
     }
     function openForm(index){
         setFormid(index);
         setShowDetails(true);
     }
    return (<>
       <ApplicationDetails show={showDetails} data={responses[formId]} onClose={()=>setShowDetails(false)}/>
       <div className="dahsboard">
         <nav className="dashboard-nav">
             <div className="nav-item label">
                 <div className="nav-logo">
                     <img src={nav_logo} alt="NAV LOGO"/>
                 </div>
             </div>
         </nav>
         <main className="dashboard-main">
             <div className="title">Applications</div>
             <div className="grid applications">
                {
                    responses.map((response,i)=>{
                        return(<Application key={i+""} index={i} onOpen={openForm} data={response}/>)
                    })
                }
                {
                    !loading && responses.length===0 &&( 
                        <div className="applcations fallback">
                           <div className="content"> No applications received yet!</div>
                        </div>
                    )
                }
                <div className="loader">
                    {loading?"loading...":(!completed?(
                        <div className="v-action" onClick={loadApplications}>Load More</div>
                    ):"")}
                </div>
             </div>
         </main>
       </div>
       </>
    )
}
function Application({data,onOpen,index}){
    return(
        <div className="card application">
           <div className="app-card-group">
                <div className="meta id">
                    <div className="label">Application id</div>
                    <div className="content">{data._id}</div>
                </div>
                <div className="meta timestamp">
                    <div className="label">Time</div>
                    <div className="content">{data.timestamp}</div>
                </div>
            </div>
            <div className="actions">
                <div className="action" onClick={()=>onOpen(index)}>
                    <div className="action-icon">
                        <FaEye/>
                    </div>
                </div>
            </div>
        </div>
    )
}
function ApplicationDetails({show=false,data,onClose}){
    if(!show){
        return null;
    }
  return (
      <div className="details-wrapper">
          <div className="details-container">
           <div className="v-actions">
              <div className="v-action" onClick={onClose}>
                  <div className="v-action-text">Close</div>
              </div>
           </div>
            <div className="meta">
                <div className="app-id">
                    <div className="label">Application ID:</div>
                    <div className="content">{data._id}</div>
                </div>
            </div>
            <div className="Received Fields">
                {
                    questions.map(q=>{
                        return <Response key={q.id+""} question={q} application_data={data}/>
                    })
                }
            </div>
            <div className="detail-attachments">
                {
                    data.files.map((file,i)=>{
                        return (<Attachment info={file} key={i+""}/>)
                    })
                }
            </div>
          </div>
      </div>
  )
}

function Response({question,application_data}){
    if(question.type==="file") return null;
    const key=question.id;
    const response = application_data[key];
    if(!response){return null;}
    return (
        <div className="response-container">
            <div className="question">
               <ReactMarkdown source={question.question.markdown} escapeHtml={false}/>
            </div>
            <div className="response">
                <div className="label">Response</div>
                <div className="content">
                    {response}
                </div>
            </div>
        </div>
    )
}
function Attachment({info}){
    console.log(info);
    function download(){
        const a=document.createElement("a");
        const parts= info.url.split("/upload/");
        parts.splice(1, 0, "/upload/fl_attachment/")
        a.href=parts.join("");
        a.download=info.url.split("/").pop();
        a.target="_blank";
        console.log(a);
        a.click();
    }
    return (
        <div className="attachment-wrapper">
            <div className="attachment preview">
               {/(image|svg|png|jpg|jpeg)/i.test(info.format)?(
                 <img src={info.url} alt="preview" className="preview-img"/>
               ):
               (
                   <div className="preview-img fallback">
                          <FaFolder size={48}/>
                   </div>
               )}
            </div>
            <div className="a-actions">
                <div className="a-action" onClick={download}>
                    <div className="a-icon"><FaDownload/></div>
                    <div className="a-text">download</div>
                </div>
            </div>
        </div>
    )
}

export default DashBoard;
