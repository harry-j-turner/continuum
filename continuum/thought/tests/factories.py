# factories.py
import factory
from thought.models import Thought, Tag


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag

    name = factory.Faker("word")
    description = factory.Faker("sentence")
    colour = factory.Faker("hex_color")



class ThoughtFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Thought
        skip_postgeneration_save = True

    content = factory.Faker("sentence")
    mood = None

    @factory.post_generation
    def set_mood(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            self.mood = extracted
        self.save()
