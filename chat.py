import random
import json

import torch

from model import NeuralNet
from nltk_util import bag_of_words, tokenize

import survey

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "EDO"

def get_response(msg):
    sentence = tokenize(msg)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        if tag == "survey":
            survey.get_survey_questions()
            return "Sure! Let's start the survey. Please wait a moment while I fetch the survey for you."

        for intent in intents['intents']:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])

    return "I do not understand..."

# Function to initiate the conversation
def chat():
    print("Bot: Hello, I am EDO, your chatbot. How can I assist you today?")
    print("Bot: You can type 'quit' to exit the conversation.")

    # Flag to track if survey has been initiated
    survey_initiated = False

    while True:
        # Get user input
        user_input = input("You: ")

        # Check if user wants to quit
        if user_input.lower() == "quit":
            print("Bot: Goodbye! Take care.")
            break

        # Check if survey has been initiated
        if not survey_initiated:
            if "survey" in user_input.lower():
                survey_initiated = True
                survey_questions = get_survey_questions()
                for question in survey_questions:
                    print("Bot:", question)
                continue

        # Get the chatbot's response
        response = get_response(user_input)
        print("Bot:", response)



if __name__ == "__main__":
   
    print("Let's chat! (type 'quit' to exit)")
    while True:
        # sentence = "do you use credit cards?"
        sentence = input("You: ")
        if sentence == "quit":
            break

        resp = get_response(sentence)
        print(resp)
