/**
 * Collection of inspirational dog quotes for use throughout the application
 */
export const dogQuotes = [
  "\"Saving one dog will not change the world, but surely for that one dog, the world will change forever.\"",
  "\"Dogs are not our whole life, but they make our lives whole.\" — Roger Caras",
  "\"The world would be a nicer place if everyone had the ability to love as unconditionally as a dog.\" — M.K. Clinton",
  "\"A dog is the only thing on earth that loves you more than you love yourself.\" — Josh Billings",
  "\"Dogs leave paw prints on our hearts.\" — Unknown",
  "\"Until one has loved an animal, a part of one's soul remains unawakened.\" — Anatole France",
  "\"Happiness is a warm puppy.\" — Charles M. Schulz",
  "\"Dogs do speak, but only to those who know how to listen.\" — Orhan Pamuk",
  "\"If you want a friend in Washington, get a dog.\" — Harry S. Truman",
  "\"The better I get to know men, the more I find myself loving dogs.\" — Charles de Gaulle",
  "\"Dogs' lives are too short. Their only fault, really.\" — Agnes Sligh Turnbull",
  "\"The greatest pleasure of a dog is that you may make a fool of yourself with him and not only will he not scold you, but he will make a fool of himself too.\" — Samuel Butler",
  "\"A dog will teach you unconditional love. If you can have that in your life, things won't be too bad.\" — Robert Wagner",
  "\"The love of a dog is a pure thing. He gives you a trust which is total. You must not betray it.\" — Michel Houellebecq",
  "\"If there are no dogs in Heaven, then when I die I want to go where they went.\" — Will Rogers",
  "\"The dog is a gentleman; I hope to go to his heaven, not man's.\" — Mark Twain",
  "\"Dogs never bite me. Just humans.\" — Marilyn Monroe",
  "\"No matter how you're feeling, a little dog gonna love you.\" — Waka Flocka Flame",
  "\"When an 85-pound mammal licks your tears away, then tries to sit on your lap, it's hard to feel sad.\" — Kristan Higgins",
  "\"What do dogs do on their day off? Can't lie around – that's their job!\" — George Carlin",
  "\"To his dog, every man is Napoleon; hence the constant popularity of dogs.\" — Aldous Huxley",
  "\"You can usually tell that a man is good if he has a dog who loves him.\" — W. Bruce Cameron",
  "\"The bond with a true dog is as lasting as the ties of this earth will ever be.\" — Konrad Lorenz",
  "\"Everyone thinks they have the best dog. And none of them are wrong.\" — W.R. Purche",
  "\"The only creatures that are evolved enough to convey pure love are dogs and infants.\" — Johnny Depp",
  "\"Money can buy you a fine dog, but only love can make him wag his tail.\" — Kinky Friedman",
  "\"Such short little lives our pets have to spend with us, and they spend most of it waiting for us to come home each day.\" — John Grogan",
  "\"A dog is the only thing that can mend a crack in your broken heart.\" — Judy Desmond",
  "\"Dogs come into our lives to teach us about love, they depart to teach us about loss. A new dog never replaces an old dog. It merely expands the heart.\" — Unknown",
  "\"The greatest fear dogs know is the fear that you will not come back when you go out the door without them.\" — Stanley Coren"
];

/**
 * Returns a random dog quote from the collection
 */
export const getRandomDogQuote = (): string => {
  return dogQuotes[Math.floor(Math.random() * dogQuotes.length)]!;
};