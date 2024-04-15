import time

from celery import shared_task
from django.conf import settings
from logging import getLogger
import json

logger = getLogger(__name__)


@shared_task
def extract_mood(thought_id):
    from .models import Thought  # Import here to avoid circular imports

    thought = Thought.objects.get(id=thought_id)
    response = settings.OPENAI_CLIENT.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": """
Task:
To analyse the text and return a single number from 1 to 5 indicating the mood of the user where 1 is very unhappy and 5 is very happy.

# Example 1
Text: I have had such an awful day, I got fired from my job for absolutely no reason at all.
Response: 1

# Example 2
Text: My cat just had kittens and they are the cutest things I have ever seen.
Response: 5

# Example 3
Text: I am feeling okay, I've not had much motivation today, I think I need to get more sleep.
Response: 3

# Example 4
Text: I've just learned to cook a risotto, finally. Took me long enough, it turned out okay but could definitely do with a bit more salt next time.
Response: 4

####################

Text: {content}
Response:
""",
            },
            {
                "role": "user",
                "content": thought.content,
            },
        ],
    )
    try:
        response = response.choices[0].message.content
        mood = int(response.strip())
        if mood < 1 or mood > 5:
            raise ValueError("Mood must be between 1 and 5.")
    except ValueError:
        mood = None
    thought.mood = mood
    thought.save()
    logger.info(f"Extracted mood {mood} for thought {thought_id}")


@shared_task
def extract_actions(thought_id):
    from .models import Thought

    thought = Thought.objects.get(id=thought_id)
    response = settings.OPENAI_CLIENT.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": """
Task:
To analyse the text and return a list of maximum three todo list items implied by the text, in JSON format.

# Example 1 - No actions implied.
Text: I have had such an awful day, I got fired from my job for absolutely no reason at all.
Response: []

# Example 2 - One action implied.
Text: My cat just had kittens and they are the cutest things I have ever seen. I must remember to get them chipped.
Response: ["Remember to get kittens chipped"]

# Example 3 - No action implied because it's a broad sweeping statement.
Text: I am feeling okay, I've not had much motivation today, I think I need to get more sleep.
Response: []

# Example 4 - One action implied, processed into concrete action.
Text: I am feeling okay, I've not had much motivation today, I think I need to get more sleep. I read that going to bed at the same time every day can help.
Response: ["Decided on a time to go to bed every day."]

# Example 5 - Two actions implied.
Text: Quick note to self, need to grab more butter. Also need to remember to call mum.
Response: ["Grab more butter", "Remember to call mum"]

####################

Text: {content}
Response:
""",
            },
            {
                "role": "user",
                "content": thought.content,
            },
        ],
    )
    try:
        response = response.choices[0].message.content
        json_data = json.loads(response.strip())

        # Validate that the response is a list of strings
        if not all(isinstance(action, str) for action in json_data):
            raise ValueError("Response must be a list of strings.")

        # Remove all ';' characters from the actions, they are special.
        actions = [action.replace(";", "") for action in json_data]
        actions = ";".join(actions)
    except ValueError:
        actions = ""
    thought.actions = actions
    thought.save()
    logger.info(f"Extracted actions for thought {thought_id}")
