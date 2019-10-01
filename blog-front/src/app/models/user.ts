export class User{
    constructor(
        public _id: number,
        public name: string,
        public surname: string,
        public email: string,
        public password: string,
        public image: string,
        public role: string,
        public remember_token: boolean,
        public created_at: string,
        public updated_at: string,
    ){

    }
}