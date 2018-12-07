 export let GLOBAL_CONFIG = {
  dev:{...{
    title: "Quiz",
    primaryColor: "#e84100",
    secondaryColor: "#333333",
    backgroundColor: "#ffffff",
    logo: undefined,
    moodleXmlPath: undefined,
    finishScreen: true,
    feedback: true,
    randomQuestions: true,
    numberOfQuestions: 5,
    debug:true,
    debug_scorm_api:false,
    debug_scorm_api_window:false,
    available_locales:["en", "es"],
    // locale: "es",
    adaptive:true,
    finish_screen:true,
    scorm:{
      completion_threshold:0.5,
      score_threshold:0.6,
    },
    n:3,
  },...window.config},
  production:{...{
    title: "Quiz",
    primaryColor: "#e84100",
    secondaryColor: "#333333",
    backgroundColor: "#ffffff",
    logo: undefined,
    moodleXmlPath: undefined,
    finishScreen: true,
    feedback: true,
    randomQuestions: true,
    numberOfQuestions: 5,
    debug:false,
    debug_scorm_api:false,
    debug_scorm_api_window:false,
    available_locales:["en", "es"],
    adaptive:true,
    finish_screen:true,
    scorm:{
      completion_threshold:0.5,
      score_threshold:0.6,
    },
    n:undefined,
  },...window.config},
};

let processConfig = (function(){
  let env = process.env.NODE_ENV || 'dev';
  if(typeof GLOBAL_CONFIG[env] === "undefined"){
    env = "dev";
  }
  GLOBAL_CONFIG = GLOBAL_CONFIG[env];

  GLOBAL_CONFIG.debug_scorm_api = ((GLOBAL_CONFIG.debug) && (GLOBAL_CONFIG.debug_scorm_api));
  GLOBAL_CONFIG.debug_scorm_api_window = ((GLOBAL_CONFIG.debug_scorm_api) && (GLOBAL_CONFIG.debug_scorm_api_window));
})();