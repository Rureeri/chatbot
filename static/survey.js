// Define the survey questions
var surveyQuestions = [
    "Rate your current mood on a scale of 1-10: ",
    "How often do you experience stress? (Rarely/Sometimes/Often)",
    "How often do you experience anxiety? (Rarely/Sometimes/Often)",
    "Rate your sleep quality on a scale of 1-10: ",
    "Do you experience any of the following symptoms? (Fatigue/Loss of appetite/Trouble concentrating/Feeling sad or down/Restlessness/Irritability)",
    "What are your primary coping mechanisms for managing stress? (Exercise/Meditation/Spending time with loved ones/Engaging in hobbies/Seeking professional help)",
    "Do you feel adequately supported by your personal network? (Yes/No)"
];

// Get the survey form element
var surveyForm = document.getElementById('surveyForm');

// Dynamically generate the survey questions
surveyQuestions.forEach(function(question) {
    var label = document.createElement('label');
    label.textContent = question;

    var input = document.createElement('input');
    input.type = 'text';
    input.name = question;

    var br = document.createElement('br');

    surveyForm.appendChild(label);
    surveyForm.appendChild(input);
    surveyForm.appendChild(br);
});

// Add submit event listener to the form
surveyForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var surveyResponses = {};

    // Collect the user responses
    surveyQuestions.forEach(function(question) {
        var input = document.querySelector('input[name="' + question + '"]');
        var response = input.value;
        surveyResponses[question] = response;
    });

    // Perform analysis on the survey responses
    var recommendations = analyzeResponses(surveyResponses);

    // Display the recommendations
    var recommendationList = document.createElement('ul');
    recommendations.forEach(function(recommendation) {
        var listItem = document.createElement('li');
        listItem.textContent = recommendation;
        recommendationList.appendChild(listItem);
    });

    var surveyResults = document.createElement('div');
    surveyResults.innerHTML = '<h2>Based on your survey responses, here are some recommendations:</h2>';
    surveyResults.appendChild(recommendationList);

    surveyForm.parentNode.replaceChild(surveyResults, surveyForm);
});

// Function to analyze survey responses
function analyzeResponses(surveyResponses) {
    var moodRating = parseInt(surveyResponses["Rate your current mood on a scale of 1-10: "], 10);
    var stressFrequency = surveyResponses["How often do you experience stress? (Rarely/Sometimes/Often)"];
    var anxietyFrequency = surveyResponses["How often do you experience anxiety? (Rarely/Sometimes/Often)"];
    var sleepQuality = parseInt(surveyResponses["Rate your sleep quality on a scale of 1-10: "], 10);
    var symptoms = surveyResponses["Do you experience any of the following symptoms? (Fatigue/Loss of appetite/Trouble concentrating/Feeling sad or down/Restlessness/Irritability)"];
    var copingMechanisms = surveyResponses["What are your primary coping mechanisms for managing stress? (Exercise/Meditation/Spending time with loved ones/Engaging in hobbies/Seeking professional help)"];
    var supportPerception = surveyResponses["Do you feel adequately supported by your personal network? (Yes/No)"];

    // Perform analysis based on the survey responses
    var recommendations = [];

    // Analyze mood rating
    if (moodRating <= 3) {
        recommendations.push("Consider seeking support from a mental health professional.");
        recommendations.push("Engage in activities that bring you joy and relaxation.");
    } else if (moodRating <= 7) {
        recommendations.push("Practice self-care activities to boost your mood.");
        recommendations.push("Consider talking to a trusted friend or family member about your feelings.");
    } else {
        recommendations.push("Continue engaging in activities that promote positive mood.");
        recommendations.push("Spread positivity and support to others.");
    }

    // Analyze stress and anxiety frequency
    if (stressFrequency === "Often" || anxietyFrequency === "Often") {
        recommendations.push("Explore stress management techniques such as meditation or deep breathing exercises.");
        recommendations.push("Identify and address the root causes of your stress and anxiety.");
    } else if (stressFrequency === "Sometimes" || anxietyFrequency === "Sometimes") {
        recommendations.push("Incorporate stress-relief activities into your daily routine.");
        recommendations.push("Practice mindfulness techniques to manage stress and anxiety.");
    }

    // Analyze sleep quality
    if (sleepQuality <= 5) {
        recommendations.push("Establish a consistent sleep schedule and create a relaxing bedtime routine.");
        recommendations.push("Avoid electronic devices and stimulating activities before bed.");
    } else if (sleepQuality <= 8) {
        recommendations.push("Continue practicing good sleep hygiene habits.");
        recommendations.push("Consider using relaxation techniques to improve sleep quality.");
    }

    // ... (Add more recommendations based on specific survey responses)

    return recommendations;
}
