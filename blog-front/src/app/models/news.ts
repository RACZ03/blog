export class News{
    constructor(
        public _id: number,
        public user_id: number,
        public title: string,
        public content: string,
        public image: string,
        public remember_token: boolean,
        public created_at: string,
        public updated_at: string,
    ){

    }
}