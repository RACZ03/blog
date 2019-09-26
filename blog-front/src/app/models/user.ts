export class User{
    constructor(
        public _id: number,
        public name: String,
        public surname: String,
        public email: String,
        public password: String,
        public image: String,
        public role: String,
        public remember_token: Boolean,
        public created_at: String,
        public updated_at: String,
    ){

    }
}