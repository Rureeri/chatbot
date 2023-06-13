"""from flask import Flask, render_template, request, jsonify
from chat import get_response
from survey import get_survey_questions, analyze_responses

app = Flask(__name__)

survey_responses = []



@app.route('/')
def index():
    return render_template("base.html")


@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get("message")
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)


if __name__ == '__main__':
    app.run(debug=True)
    
"""

from flask import Flask, render_template, request, jsonify
from chat import get_response
from survey import get_survey_questions, get_survey_question, conduct_survey, analyze_responses


app = Flask(__name__)

sessions = {}
@app.route('/')
def index():
    session_id = request.cookies.get('session_id')
    if session_id not in sessions:
        sessions[session_id] = {}
        survey_questions_count = len(get_survey_questions())
        return render_template("survey.html", survey_questions_count=survey_questions_count, get_survey_question=get_survey_question)
    return render_template("base.html")

@app.route('/survey', methods=['POST'])
def survey():
    session_id = request.cookies.get('session_id')
    question = request.form['question']
    response = request.form['response']
    sessions[session_id][question] = response
    next_question = conduct_survey(sessions[session_id])
    if next_question:
        return render_template("survey.html", question=next_question)
    return jsonify({'response': "Survey completed!"})


@app.route('/predict', methods=['POST'])
def predict():
    session_id = request.cookies.get('session_id')
    text = request.get_json().get("message")
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)


if __name__ == '__main__':
    app.run(debug=True)
