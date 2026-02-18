// Bible Challenge Questions Database
const BIBLE_QUESTIONS = {
    easy: [
        {
            id: 1,
            question: "Who built the ark?",
            answers: ["Noah", "Moses", "Abraham", "David"],
            correct: 0,
            category: "Old Testament",
            verse: "Genesis 6:14"
        },
        {
            id: 2,
            question: "How many days did God take to create the world?",
            answers: ["6", "7", "5", "8"],
            correct: 0,
            category: "Creation",
            verse: "Genesis 1:31"
        },
        {
            id: 3,
            question: "Who was swallowed by a great fish?",
            answers: ["Jonah", "Job", "Joshua", "Joel"],
            correct: 0,
            category: "Old Testament",
            verse: "Jonah 1:17"
        },
        {
            id: 4,
            question: "What is the first book of the Bible?",
            answers: ["Genesis", "Exodus", "Matthew", "Psalms"],
            correct: 0,
            category: "Bible Knowledge",
            verse: "Genesis 1:1"
        },
        {
            id: 5,
            question: "Who was the mother of Jesus?",
            answers: ["Mary", "Martha", "Elizabeth", "Sarah"],
            correct: 0,
            category: "New Testament",
            verse: "Luke 1:30-31"
        },
        {
            id: 6,
            question: "How many disciples did Jesus have?",
            answers: ["12", "10", "7", "15"],
            correct: 0,
            category: "Jesus' Life",
            verse: "Matthew 10:1-4"
        },
        {
            id: 7,
            question: "Who betrayed Jesus?",
            answers: ["Judas", "Peter", "John", "Thomas"],
            correct: 0,
            category: "Jesus' Life",
            verse: "Matthew 26:14-16"
        },
        {
            id: 8,
            question: "What did God create on the first day?",
            answers: ["Light", "Animals", "Plants", "Humans"],
            correct: 0,
            category: "Creation",
            verse: "Genesis 1:3"
        },
        {
            id: 9,
            question: "Who led the Israelites out of Egypt?",
            answers: ["Moses", "Aaron", "Joshua", "Abraham"],
            correct: 0,
            category: "Old Testament",
            verse: "Exodus 3:10"
        },
        {
            id: 10,
            question: "What is the last book of the Bible?",
            answers: ["Revelation", "Jude", "Acts", "Romans"],
            correct: 0,
            category: "Bible Knowledge",
            verse: "Revelation 1:1"
        },
        {
            id: 11,
            question: "Who was the first man?",
            answers: ["Adam", "Abel", "Cain", "Seth"],
            correct: 0,
            category: "Creation",
            verse: "Genesis 2:7"
        },
        {
            id: 12,
            question: "Who was the first woman?",
            answers: ["Eve", "Sarah", "Rebecca", "Rachel"],
            correct: 0,
            category: "Creation",
            verse: "Genesis 3:20"
        },
        {
            id: 13,
            question: "How many commandments did God give Moses?",
            answers: ["10", "12", "7", "15"],
            correct: 0,
            category: "Old Testament",
            verse: "Exodus 20:1-17"
        },
        {
            id: 14,
            question: "Who defeated Goliath?",
            answers: ["David", "Saul", "Jonathan", "Samuel"],
            correct: 0,
            category: "Old Testament",
            verse: "1 Samuel 17:50"
        },
        {
            id: 15,
            question: "Where was Jesus born?",
            answers: ["Bethlehem", "Nazareth", "Jerusalem", "Galilee"],
            correct: 0,
            category: "Jesus' Life",
            verse: "Matthew 2:1"
        }
    ],
    
    medium: [
        {
            id: 16,
            question: "Who wrote most of the Psalms?",
            answers: ["David", "Solomon", "Moses", "Asaph"],
            correct: 0,
            category: "Old Testament",
            verse: "Psalm 3:1"
        },
        {
            id: 17,
            question: "How many plagues did God send on Egypt?",
            answers: ["10", "7", "12", "9"],
            correct: 0,
            category: "Old Testament",
            verse: "Exodus 7-12"
        },
        {
            id: 18,
            question: "Who was the wisest man in the Bible?",
            answers: ["Solomon", "David", "Daniel", "Joseph"],
            correct: 0,
            category: "Old Testament",
            verse: "1 Kings 3:12"
        },
        {
            id: 19,
            question: "What did Jesus turn water into?",
            answers: ["Wine", "Bread", "Oil", "Honey"],
            correct: 0,
            category: "Jesus' Life",
            verse: "John 2:9"
        },
        {
            id: 20,
            question: "Who walked on water with Jesus?",
            answers: ["Peter", "John", "James", "Andrew"],
            correct: 0,
            category: "New Testament",
            verse: "Matthew 14:29"
        },
        {
            id: 21,
            question: "How many books are in the New Testament?",
            answers: ["27", "39", "66", "22"],
            correct: 0,
            category: "Bible Knowledge",
            verse: "N/A"
        },
        {
            id: 22,
            question: "Who was thrown into the lion's den?",
            answers: ["Daniel", "David", "Jonah", "Joseph"],
            correct: 0,
            category: "Old Testament",
            verse: "Daniel 6:16"
        },
        {
            id: 23,
            question: "What was Paul's name before his conversion?",
            answers: ["Saul", "Simon", "Samuel", "Seth"],
            correct: 0,
            category: "New Testament",
            verse: "Acts 13:9"
        },
        {
            id: 24,
            question: "Who baptized Jesus?",
            answers: ["John the Baptist", "Peter", "Andrew", "James"],
            correct: 0,
            category: "Jesus' Life",
            verse: "Matthew 3:13"
        },
        {
            id: 25,
            question: "How many days did Jesus fast in the wilderness?",
            answers: ["40", "30", "50", "7"],
            correct: 0,
            category: "Jesus' Life",
            verse: "Matthew 4:2"
        }
    ],
    
    hard: [
        {
            id: 26,
            question: "Who was the oldest man in the Bible?",
            answers: ["Methuselah", "Noah", "Adam", "Abraham"],
            correct: 0,
            category: "Old Testament",
            verse: "Genesis 5:27"
        },
        {
            id: 27,
            question: "What was the name of Abraham's nephew?",
            answers: ["Lot", "Isaac", "Ishmael", "Esau"],
            correct: 0,
            category: "Old Testament",
            verse: "Genesis 12:5"
        },
        {
            id: 28,
            question: "Which prophet was taken to heaven in a whirlwind?",
            answers: ["Elijah", "Elisha", "Enoch", "Isaiah"],
            correct: 0,
            category: "Old Testament",
            verse: "2 Kings 2:11"
        },
        {
            id: 29,
            question: "How many years did the Israelites wander in the desert?",
            answers: ["40", "30", "50", "20"],
            correct: 0,
            category: "Old Testament",
            verse: "Numbers 14:33"
        },
        {
            id: 30,
            question: "Who was the first Christian martyr?",
            answers: ["Stephen", "James", "Peter", "Paul"],
            correct: 0,
            category: "New Testament",
            verse: "Acts 7:59-60"
        },
        {
            id: 31,
            question: "What island was Paul shipwrecked on?",
            answers: ["Malta", "Cyprus", "Crete", "Rhodes"],
            correct: 0,
            category: "New Testament",
            verse: "Acts 28:1"
        },
        {
            id: 32,
            question: "Who replaced Judas as a disciple?",
            answers: ["Matthias", "Barnabas", "Silas", "Timothy"],
            correct: 0,
            category: "New Testament",
            verse: "Acts 1:26"
        },
        {
            id: 33,
            question: "How many books did Paul write?",
            answers: ["13", "14", "12", "10"],
            correct: 0,
            category: "Bible Knowledge",
            verse: "N/A"
        },
        {
            id: 34,
            question: "Who was the Roman governor who sentenced Jesus to death?",
            answers: ["Pontius Pilate", "Herod", "Caesar", "Felix"],
            correct: 0,
            category: "Jesus' Life",
            verse: "Matthew 27:24"
        },
        {
            id: 35,
            question: "What was the name of the garden where Jesus prayed before his arrest?",
            answers: ["Gethsemane", "Eden", "Bethany", "Olivet"],
            correct: 0,
            category: "Jesus' Life",
            verse: "Matthew 26:36"
        }
    ]
};

// Utility function to get random questions
function getRandomQuestions(difficulty, count) {
    const questions = BIBLE_QUESTIONS[difficulty];
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Utility function to get mixed difficulty questions
function getMixedQuestions(count) {
    const easy = getRandomQuestions('easy', Math.ceil(count * 0.4));
    const medium = getRandomQuestions('medium', Math.ceil(count * 0.4));
    const hard = getRandomQuestions('hard', Math.floor(count * 0.2));
    return [...easy, ...medium, ...hard].sort(() => 0.5 - Math.random()).slice(0, count);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BIBLE_QUESTIONS, getRandomQuestions, getMixedQuestions };
}
