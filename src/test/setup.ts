
import mongoose from "mongoose";

// Mock external services that should not run during tests
jest.mock("../utils/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
  flushAll: jest.fn(),
  isOpen: true, // Mock the client as being open to prevent connection attempts
}));

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: "http://mock-url.com/image.jpg",
        public_id: "mock_public_id",
      }),
      destroy: jest.fn().mockResolvedValue({}),
    },
  },
}));

// This function runs once before all tests
beforeAll(async () => {
  // Set a default test database URI if one isn't provided via environment variables
  const mongoUri =
    process.env.TEST_MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "TEST_MONGO_URI is not defined. Please set it in your test environment.",
    );
  }

  await mongoose.connect(mongoUri);
});

// This function runs once after all tests
afterAll(async () => {
  await mongoose.disconnect();
});

// This function runs before each test
beforeEach(async () => {
  // A guard clause to ensure the connection and db object exist
  if (mongoose.connection && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});
