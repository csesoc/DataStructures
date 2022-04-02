import { TopicModel } from '../schemas/topic/topic';
import { Topic } from '../typedefs/topic/Topic';

export class TopicMongoService {
    public async createTopic(
        title: string,
        description: string,
        courses: string[],
        image: string,
        videos: string[],
        sourceCodeIds: string[]
    ): Promise<Topic> {
        try {
            const newTopic = (await TopicModel.create({
                title: title,
                description: description,
                courses: courses,
                image: image,
                videos: videos,
                sourceCodeIds: sourceCodeIds,
            })) as Topic;
            return newTopic;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async getAllTopics(): Promise<Topic[]> {
        try {
            const topics = (await TopicModel.find()) as Topic[];
            return topics;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async getTopicById(topicId: string): Promise<Topic> {
        try {
            const topic = (await TopicModel.findById(topicId)) as Topic;
            return topic;
        } catch (err) {
            const reg = /Cast to ObjectId failed/;
            if (reg.exec(err)) {
                throw new Error('Lesson requested does not exist.');
            }
            throw new Error(err.message);
        }
    }

    public async getTopicByTitle(title: string): Promise<Topic> {
        try {
            const topic = (await TopicModel.findOne({ title: new RegExp(title, "i") })) as Topic;
            return topic;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async updateTopicById(
        topicId: string,
        title: string,
        description: string,
        courses: string[],
        image: string,
        videos: string[],
        sourceCodeIds: string[]
    ): Promise<Topic> {
        try {
            const returnData = (await TopicModel.findByIdAndUpdate(
                topicId,
                {
                    title: title,
                    description: description,
                    courses: courses,
                    image: image,
                    videos: videos,
                    sourceCodeIds: sourceCodeIds,
                },
                { new: true, useFindAndModify: false }
            )) as Topic;
            return returnData;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
