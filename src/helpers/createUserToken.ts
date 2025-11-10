export interface UserToken {
    username: string;
    _id: string;
    role: string;
  }
  const createUserToken = (user: UserToken) => {
    return { username: user.username, userId: user._id, role: user.role };
  };
  
  export default createUserToken;
  