class CustomErrorApi extends Error {
    constructor(message: string) {
      super(message);
    }
  }
  
  export default CustomErrorApi;
  