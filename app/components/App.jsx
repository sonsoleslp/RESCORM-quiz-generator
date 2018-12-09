import React from 'react';
import {connect} from 'react-redux';
import './../assets/scss/main.scss';

import {GLOBAL_CONFIG} from '../config/config.js';
import * as I18n from '../vendors/I18n.js';
import * as SAMPLES from '../config/samples.js';

import SCORM from './SCORM.jsx';
import Header from './Header.jsx';
import FinishScreen from './FinishScreen.jsx';
import Quiz from './Quiz.jsx';
import xmlToJson from 'moodlexml-to-json';

export class App extends React.Component {
  constructor(props){
    super(props);
    I18n.init();
    this.state = {
      quiz: SAMPLES.quiz_example
    }
  }
  render(){
    console.log(GLOBAL_CONFIG)
    let appHeader = "";
    let appContent = "";

    if((this.props.tracking.finished !== true) || (GLOBAL_CONFIG.finish_screen === false)){
      appHeader = (
        <Header user_profile={this.props.user_profile} tracking={this.props.tracking} config={GLOBAL_CONFIG} I18n={I18n}/>
      );
      if(this.props.wait_for_user_profile !== true){
        appContent = (
          <Quiz dispatch={this.props.dispatch} user_profile={this.props.user_profile} tracking={this.props.tracking} quiz={this.state.quiz} config={GLOBAL_CONFIG} I18n={I18n}/>
        );
      }
    } else {
      appContent = (
        <FinishScreen msg={GLOBAL_CONFIG.finalMessage} dispatch={this.props.dispatch} user_profile={this.props.user_profile} tracking={this.props.tracking} quiz={this.state.quiz} config={GLOBAL_CONFIG} I18n={I18n}/>
      );
    }

    return (
      <div id="container">
        <SCORM dispatch={this.props.dispatch} tracking={this.props.tracking} config={GLOBAL_CONFIG}/>
        {appHeader}
        {appContent}
         <style>{ `
          .primary-color {
            background-color: ${GLOBAL_CONFIG.primaryColor} !important;
            color: ${GLOBAL_CONFIG.primaryColorText} !important;

          }
          .secondary-color {
            background-color: ${GLOBAL_CONFIG.secondaryColor};
            color: ${GLOBAL_CONFIG.secondaryColorText};
          }
          body {
            background-color: ${GLOBAL_CONFIG.backgroundColor};
            color: ${GLOBAL_CONFIG.generalTextColor};
          }

          .CircularProgressbar .CircularProgressbar-path {
            stroke: ${GLOBAL_CONFIG.primaryColor} !important;
          }
          .CircularProgressbar .CircularProgressbar-text {
            fill: ${GLOBAL_CONFIG.primaryColor} !important;
          }
          ` }
          </style>
      </div>
    );
  }

  componentDidMount(){
    fetch(GLOBAL_CONFIG.moodleXmlPath || "assets/test2.xml").then(res => res.text()).then(res => {
      xmlToJson(res, (r,e)=>{
        let questions = [];
        for (let q in r.questions) {
          let question = r.questions[q];
          switch(question.type) {
            case 'multichoice':
            questions.push({ type: 'multiple_choice', value: question.questiontext, choices: question.answers.map((a,id)=>{return {id, value: a.text, answer: a.score === 100}}), single: question.single})
            break;
            case 'truefalse':
            questions.push({ type: 'true_false', single: true, value: question.questiontext, answer: question.answers.filter(a=> a.score === 100).map(a=> a.text)[0]})
            break;
            default:
              console.error("Unsupported");
          }
        }
        this.setState({ quiz: {title: "", questions}});
      })
    })
  }
}

function mapStateToProps(state){
  return state;
}

export default connect(mapStateToProps)(App);