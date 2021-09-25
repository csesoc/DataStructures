import mongoose from 'mongoose';

const quizMongoSchema = new mongoose.Schema({
    question_type: String,
    question: String,
    answer: String,
});

export const QuizModel = mongoose.model('quiz', quizMongoSchema);
