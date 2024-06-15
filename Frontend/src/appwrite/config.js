import conf from "../conf/conf.js"
import { Client, ID, Databases , Storage, Query} from 'appwrite'

export class AppwriteService {
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async addTransaction({title, description, amount, category, date, userID}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                {
                    title,
                    description,
                    amount,
                    category,
                    date,
                    userID
                }
            )
        } catch (error) {
            console.log("Appwrite config :: addTransaction :: error", error);
            return false
        }
    }

    async updateTransaction(documentId, {title, description, amount, category, date}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId,
                {
                    title,
                    description,
                    amount,
                    category,
                    date
                }
            )
        } catch (error) {
            console.log("Appwrite config :: updateTransaction :: error", error);
            return false
        }
    }

    async deleteTransaction(documentId){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            )
            return true
        } catch (error) {
            console.log("Appwrite config :: deleteTransaction :: error", error);
            return false
        }
    }

    async getTransaction(documentId){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            )
        } catch (error) {
            console.log("Appwrite config :: getTransaction :: error", error);
            return false
        }
    }

}

const appwriteService = new AppwriteService()
export default appwriteService