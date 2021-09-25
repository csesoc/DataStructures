import { Router } from 'express';
import { QuizMongoService } from '../database-helpers/quiz';
import { LessonMongoService } from '../database-helpers/lesson';
import consola from 'consola';

const quizRouter = Router();
const quizService = new QuizMongoService();
const lessonService = new LessonMongoService();

interface GetQuizInput {
    lessonId: string,
}

interface CreateQuizInput {
    lessonId: string,
    questionType: string,
    question: string,
    answer: string,
}

/*
 * Fetches a list of all the quizzes for a lesson

 * Params
    - lessonId
 * Response
    - List of quizzes for a lesson
 * Excaptions
    - lessonId doesn't correspond to an existing lesson
 */
quizRouter.get('/api/lessons/quiz', async (request, response) => {
    try {
        const { lessonId } = request.body as GetQuizInput;
        console.log(`Get quiz questions for lesson : ${lessonId}`);
        console.log(request.body);

        // Retrieve lesson/check lesson exists
        try {
            await lessonService.getLessonById(lessonId);
        } catch {
            consola.error(`lesson does not exist`);
            response.status(401).json({
                status: 401,
                statusText: 'Lesson does not exist',
            });
        }

        // Get list of quiz ids (from lesson)
        const lesson = await lessonService.getLessonById(lessonId);

        // Get quizzes
        let questions = [];
        for (var el in lesson.quizs) {
            const collectedQuiz = await quizService.getQuizById(el);
            questions.push(collectedQuiz);
        }
        
        consola.success(`Successfully got quiz for lesson: ${lessonId}`);
        response.status(200).json({
            status: 200,
            statusText: 'Successfully got quiz for lesson',
            data: questions,
        });
        
    } catch (err) {
        // Failure to get quiz questions
        consola.error(`Failed to get quiz`);
        response.status(401).json({
            status: 401,
            statusText: 'Invalid input',
        });
    }
});

/*
 * Create a new quiz and adds it to a particular lesson

 * Params
    - lessonId (str)
    - questionType (str)
    - question (str)
    - answer (str)
 * Response
    - lesson
 * Excaptions
    - lessonId doesn't correspond to an existing lesson
    - questionType must be one of the strings: 'mc' (multiple choice) or 'qa' (question-answer format)
 */
quizRouter.post('/api/lessons/quiz', async (request, response) => {
    try {
        const { lessonId, questionType, question, answer } = request.body as CreateQuizInput;
        console.log(`Question to create : ${question} of type : ${questionType} with answer : ${answer}`);
        console.log(request.body);

        // Retrieve lesson/check lesson exists
        try {
            await lessonService.getLessonById(lessonId);
        } catch {
            consola.error(`lesson does not exist`);
            response.status(401).json({
                status: 401,
                statusText: 'Lesson does not exist',
            });
        }

        // Check if valid questionType
        if (!["mc", "qa"].includes(questionType)) {
            consola.error(`Failed to create quiz`);
            response.status(401).json({
                status: 401,
                statusText: 'Invalid question type: must be one of the strings: \'mc\' (multiple choice) or \'qa\' (question-answer format)',
            });
            return;
        }

        // Create a quiz question in database
        const createdQuiz = await quizService.createQuiz(questionType, question, answer);
        console.log(`Created quiz with id ${createdQuiz._id}`);


        // Add quiz question to database based on id
        //......................................................................................................
        const lesson = await lessonService.getLessonById(lessonId);
        let quizzes = lesson.quizs
        quizzes.push(createdQuiz._id);

        const newLesson = await lessonService.updateLessonById(lessonId, quizzes);
        
        
        consola.success(`Successfully created quiz: ${question}`);
        response.status(200).json({
            status: 200,
            statusText: 'Successfully created quiz',
            data: newLesson,
        });
        
    } catch (err) {
        // Failure to create quiz
        consola.error(`Failed to create quiz`);
        response.status(401).json({
            status: 401,
            statusText: 'Invalid input',
        });
    }
});

export default quizRouter;
