# factories.py
import factory
from thought.models import Entry, Thought, Tag


class TagFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Tag

    name = factory.Faker("word")
    description = factory.Faker("sentence")
    colour = factory.Faker("hex_color")


class EntryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Entry

    date = factory.Faker("date_object")


class ThoughtFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Thought
        skip_postgeneration_save = True

    content = factory.Faker("sentence")
    entry = factory.SubFactory(EntryFactory)
    mood = None

    @factory.post_generation
    def set_mood(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            self.mood = extracted
        self.save()
