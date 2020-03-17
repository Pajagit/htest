import axios from "axios";

import { GET_PROJECT_STATISTICS, STATISTICS_LOADING, GET_GLOBAL_STATISTICS } from "./types";

// Get Project Statistics
export const getProjectStatistics = projectId => dispatch => {
  dispatch(statisticsLoading());

  // delete axios.defaults.headers.common["Authorization"]; // Comment out when not testing statistics or all EPs will stop working
  axios
    // .get(`/api/projects/project/${projectId}/statistics`)
    // .get("https://api.myjson.com/bins/uhvtm") // annual test
    // .get("https://api.myjson.com/bins/18wknu") // most used TC test
    // .get("https://api.myjson.com/bins/w81h6") // nema ni jedan
    // .get("https://api.myjson.com/bins/m1j16") // ima po neki
    .get(`https://api.myjson.com/bins/1citmm`) // ima sve
    // .get(`https://api.myjson.com/bins/1afdku`)

    // .get("http://www.json-generator.com/api/json/get/bUkFMBhmUO?indent=2") // bez annual
    // .get("http://www.json-generator.com/api/json/get/cfsCAIaPyq?indent=2") // sa annual
    // .get("http://www.json-generator.com/api/json/get/cpnNVaEBTS?indent=2") // most active testcases empty array
    // .get("http://www.json-generator.com/api/json/get/cdZZPbfOYy?indent=2") // most active testcases null
    // .get("http://www.json-generator.com/api/json/get/cecylYPPVK?indent=2") // sve null
    // .get("http://www.json-generator.com/api/json/get/cfTVtJKNNK?indent=2") // most_user_reports only
    // .get("http://www.json-generator.com/api/json/get/bUMPhoHLjC?indent=2") // most_user_reports + most_user_testcases
    // .get("http://www.json-generator.com/api/json/get/cfXGuBeRWq?indent=2") // most_user_reports + most_user_testcases + most_version_failed
    // .get("http://www.json-generator.com/api/json/get/bVFGkconpK?indent=2") // most_user_reports + most_user_testcases + most_version_failed + most_testcases_failed
    // .get("http://www.json-generator.com/api/json/get/bTAUhMeiwi?indent=2") // most_user_reports + most_user_testcases + most_version_failed + most_testcases_failed + annual_data
    // .get("http://www.json-generator.com/api/json/get/cqIOsBLCoO?indent=2") // most_user_reports + most_user_testcases + most_version_failed + most_testcases_failed + annual_data + total_data
    // .get("http://www.json-generator.com/api/json/get/bVsrpwZgoi?indent=2") // most_user_reports + most_user_testcases + most_version_failed + most_testcases_failed + annual_data + total_data + most_active_testcases

    .then(res =>
      dispatch({
        type: GET_PROJECT_STATISTICS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECT_STATISTICS,
        payload: {}
      })
    );
};

// Get Project Statistics
export const getGlobalStatistics = () => dispatch => {
  dispatch(statisticsLoading());

  // delete axios.defaults.headers.common["Authorization"]; // Comment out when not testing statistics or all EPs will stop working
  axios
    // .get(`/api/projects/project/${projectId}/statistics`)
    // .get("https://api.myjson.com/bins/uhvtm") // annual test
    // .get("https://api.myjson.com/bins/18wknu") // most used TC test
    // .get("https://api.myjson.com/bins/w81h6") // nema ni jedan
    // .get("https://api.myjson.com/bins/m1j16") // ima po neki
    .get(`https://api.myjson.com/bins/1citmm`) // ima sve
    // .get(`https://api.myjson.com/bins/1afdku`)

    // .get("http://www.json-generator.com/api/json/get/bUkFMBhmUO?indent=2") // bez annual
    // .get("http://www.json-generator.com/api/json/get/cfsCAIaPyq?indent=2") // sa annual
    // .get("http://www.json-generator.com/api/json/get/cpnNVaEBTS?indent=2") // most active testcases empty array
    // .get("http://www.json-generator.com/api/json/get/cdZZPbfOYy?indent=2") // most active testcases null
    // .get("http://www.json-generator.com/api/json/get/cecylYPPVK?indent=2") // sve null
    // .get("http://www.json-generator.com/api/json/get/cfTVtJKNNK?indent=2") // most_user_reports only
    // .get("http://www.json-generator.com/api/json/get/bUMPhoHLjC?indent=2") // most_user_reports + most_user_testcases
    // .get("http://www.json-generator.com/api/json/get/cfXGuBeRWq?indent=2") // most_user_reports + most_user_testcases + most_version_failed
    // .get("http://www.json-generator.com/api/json/get/bVFGkconpK?indent=2") // most_user_reports + most_user_testcases + most_version_failed + most_testcases_failed
    // .get("http://www.json-generator.com/api/json/get/bTAUhMeiwi?indent=2") // most_user_reports + most_user_testcases + most_version_failed + most_testcases_failed + annual_data
    // .get("http://www.json-generator.com/api/json/get/cqIOsBLCoO?indent=2") // most_user_reports + most_user_testcases + most_version_failed + most_testcases_failed + annual_data + total_data
    // .get("http://www.json-generator.com/api/json/get/bVsrpwZgoi?indent=2") // most_user_reports + most_user_testcases + most_version_failed + most_testcases_failed + annual_data + total_data + most_active_testcases

    .then(res =>
      dispatch({
        type: GET_GLOBAL_STATISTICS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_GLOBAL_STATISTICS,
        payload: {}
      })
    );
};

// Statistics loading
export const statisticsLoading = () => {
  return {
    type: STATISTICS_LOADING
  };
};
