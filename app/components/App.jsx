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
      quiz: SAMPLES.quiz_example,
      loading: true
    }

    this.parseMoodleXML = this.parseMoodleXML.bind(this);
  }
  render(){
    let appHeader = "";
    let appContent = "";

    if (((this.props.tracking.finished !== true) || (GLOBAL_CONFIG.finish_screen === false))&& !this.state.loading){
      appHeader = (
        <Header user_profile={this.props.user_profile} tracking={this.props.tracking} config={GLOBAL_CONFIG} I18n={I18n}/>
      );
      if(this.props.wait_for_user_profile !== true && !this.state.loading){
        appContent = (
          <Quiz dispatch={this.props.dispatch} user_profile={this.props.user_profile} tracking={this.props.tracking} quiz={this.state.quiz} config={GLOBAL_CONFIG} I18n={I18n}/>
        );
      }
    } else if (!this.state.loading) {
      appContent = (
        <FinishScreen msg={this.props.tracking.score >= GLOBAL_CONFIG.scorm.score_threshold ? GLOBAL_CONFIG.successMessage : GLOBAL_CONFIG.failMessage} dispatch={this.props.dispatch} user_profile={this.props.user_profile} tracking={this.props.tracking} quiz={this.state.quiz} config={GLOBAL_CONFIG} I18n={I18n}/>
      );
    } else {
      appContent = <div className="wholeScreen">
        Loading...
      </div>;
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

  parseMoodleXML(xml) {
    xmlToJson(xml, (r,e)=>{
      let questions = [];
      for (let q in r.questions) {
        let question = r.questions[q];
        switch(question.type) {
          case 'multichoice':
            questions.push({ type: 'multiple_choice', value: question.questiontext, choices: (question.answers || []).map((a,id)=>{return {id, value: a.text, answer: a.score === 100}}), single: question.single})
            break;
          case 'truefalse':
            questions.push({ type: 'true_false', single: true, value: question.questiontext, answer: (question.answers || []).filter(a=> a.score === 100).map(a=> a.text)[0]})
            break;
          case 'numerical':
            questions.push({ type: 'numerical', value: question.questiontext, answer: (question.correctAnswer || []), tolerance: question.tolerance})
            break;
          case 'shortanswer':
            questions.push({ type: 'shortanswer', value: question.questiontext, answer: (question.answers || []).filter(a=> a.score === 100).map(a=>a.text)})
            break;
          case 'essay':
            questions.push({ type: 'essay', value: question.questiontext })
            break;
          case 'matching':
            break;
          default:
            console.error("Unsupported");
        }
      }
      this.setState({ quiz: {title: "", questions}});
    })
  }
  decode(input) {
    return decodeURIComponent(window.atob(input.slice(21)).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
  componentDidMount(){
    if (GLOBAL_CONFIG.dev) {
      if(GLOBAL_CONFIG.moodleXmlPath) {
        this.parseMoodleXML(this.decode(GLOBAL_CONFIG.moodleXmlPath));
        this.setState({loading: false})
      } else {
        this.setState({loading: false})
      }

    } else {
      fetch(GLOBAL_CONFIG.moodleXmlPath || "assets/quiz.xml")
      .then(res => res.text())
      .then(res => {
        this.parseMoodleXML(res);
        this.setState({loading: false})

      })
      .catch(err=>{
        this.setState({loading: false})
      })
    }
  }

}

function mapStateToProps(state){
  return state;
}

export default connect(mapStateToProps)(App);