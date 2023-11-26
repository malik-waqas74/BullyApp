import axios from 'axios';

const fetchAbusivePrediction = (inputText) => {
    return axios.post('http://192.168.154.175:8000/api/predictAbuse/', {
        input_text: inputText
    });
};

const fetchThreatPrediction = (inputText) => {
    return axios.post('http://192.168.154.175:8000/api/predictThreat/', {
        input_text: inputText
    });
};

const useAbusiveAndThreatPrediction = () => {
    return {
        getPredictions: (inputText) => {
            return Promise.all([
                fetchAbusivePrediction(inputText),
                fetchThreatPrediction(inputText)
            ]);
        }
    };
};

export default useAbusiveAndThreatPrediction;
