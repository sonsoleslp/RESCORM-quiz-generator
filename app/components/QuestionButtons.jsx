import React from 'react';

export default class QuestionButtons extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    let disable_answer = (this.props.answered || this.props.quizCompleted);
    let disable_resetQuestion = (!this.props.answered || this.props.quizCompleted);
    let disable_next = (!this.props.answered || this.props.quizCompleted);
    let resetQuiz = "";
    return (
      <div className="questionButtonsWrapper">
        <button className="answerQuestion primary-color" onClick={this.props.onAnswerQuestion} disabled={disable_answer}>
          <i class="material-icons">done</i>
          <span>{this.props.I18n.getTrans("i.answer")}</span>
        </button>
        {/*<button className="resetQuestion primary-color" onClick={this.props.onResetQuestion} disabled={disable_resetQuestion}>
          {this.props.I18n.getTrans("i.reset_question")}
        </button>*/}
        <button className="nextQuestion primary-color" onClick={this.props.onNextQuestion} disabled={disable_next}>
          <i class="material-icons">skip_next</i>
          <span>{this.props.allow_finish ? this.props.I18n.getTrans("i.finish_quiz") : this.props.I18n.getTrans("i.next")}</span>
        </button>
        {(this.props.allow_finish) && (disable_next === false) ? (
          <button className="resetQuiz primary-color" onClick={this.props.onResetQuiz}>
            <i class="material-icons">replay</i>
            <span>{this.props.I18n.getTrans("i.reset_quiz")}</span>
          </button>) : null}
      </div>
    );
  }
}