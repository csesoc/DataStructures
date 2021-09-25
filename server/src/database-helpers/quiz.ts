import { Quiz } from '../typedefs/quiz/Quiz';
import { QuizModel } from '../schemas/quiz/quiz';

/**
 * Database controller for the 'quizes' collection
 */
export class QuizMongoService {
    /**
     * Create a new quiz
     */
    public async createQuiz(question_type: string, question: string, answer: string): Promise<Quiz> {
        try {
            const createQuizResponse = (await QuizModel.create({
                question_type: question_type,
                question: question,
                answer: answer,
            })) as Quiz;
            return createQuizResponse;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    /**
     * Gets a quiz by ID
     */
    public async getQuizById(id: string): Promise<Quiz> {
        try {
            const quizResponse = (await QuizModel.findById(id)) as Quiz;
            return quizResponse;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
