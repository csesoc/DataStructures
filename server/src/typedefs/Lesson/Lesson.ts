import mongoose from 'mongoose';

/**
 * Structs.sh lesson model
 */
export interface Lesson extends mongoose.Document {
    _id: string;
    rawMarkdown: string;
    creatorId: string;
    quizs: string[];
}
