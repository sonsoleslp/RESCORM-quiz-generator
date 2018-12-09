import React from 'react';

export default class MCQuestionChoice extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    let questionClassName = "question_choice";
    let showCorrection = (this.props.questionAnswered);
    if(showCorrection && this.props.config.feedback ){
      if(this.props.checked){
        if(this.props.choice.answer === true){
          questionClassName += " question_choice_correct";
        } else {
          questionClassName += " question_choice_incorrect";
        }
      } else if(this.props.choice.answer === true){
        questionClassName += " question_choice_correct";
      }
    }
   /* if (this.props.config.feedback) {
      questionClassName += " no-feedback";
    }*/
    return (
      <div className={questionClassName}>
        <div className="questionC1">
          <input type="checkbox" checked={this.props.checked}  onChange={() => this.props.handleChange(this.props.choice)} disabled={showCorrection}/>
        </div>
        <div className="questionC2" onClick={() => showCorrection ? null : this.props.handleChange(this.props.choice)}>
          <p>{this.props.choice.value}</p>
        </div>
      </div>
    );
  }
}