
interface IRequestBody {
  message?: string;
  documentId?: string;
  userType?: string;
  feedback?: 'like' | 'dislike';
}


declare namespace Express {
  
  export interface Request {
    body: IRequestBody;
    
    
    file?: Multer.File;
  }
}