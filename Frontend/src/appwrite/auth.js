import conf from "../conf/conf.js";
import {Client, Account, ID} from 'appwrite'

export class AuthService {
    client = new Client()
    account;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
    }

    async createAccount({email, password, name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            // Call login method if the user has been created.
            if (userAccount){
                return this.login({email, password});
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error", error);
            return false
        }
    }

    async login ({email, password}){
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.log("Appwrite service :: login :: error", error);
            return false
        }
    }

    async getCurrentUser (){
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return false
        }

        return null;
    }

    async logout (){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
            return false
        }
    }
}

const authService = new AuthService()

export default authService