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
    fetch("assets/test2.xml").then(res => res.text()).then(res => {
      console.log(xmlToJson(res, (r,e)=>{console.log(r,e)}))
      // this.setState({ quiz: });
    })
  }
}

function mapStateToProps(state){
  return state;
}

export default connect(mapStateToProps)(App);