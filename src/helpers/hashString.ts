import crypto from "crypto";

const hashString = (str: string) =>
  crypto.createHash("md5").update(str).digest("hex");

export default hashString;
