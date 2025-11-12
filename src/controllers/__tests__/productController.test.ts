
import request from "supertest";
import app from "../../app";
import Product from "../../models/Product";
import redisClient from "../../utils/redis";
import mongoose from "mongoose";

const createSampleProduct = (name: string, price: number) => {
  return Product.create({
    name,
    price,
    description: `Description for ${name}`,
    category: "Electronics",
    user: new mongoose.Types.ObjectId(),
    updatedBy: new mongoose.Types.ObjectId(),
    stock: 100,
  });
};

describe("Product Controller - GET /api/v1/products", () => {
  it("should return a list of products with correct pagination", async () => {
    (redisClient.get as jest.Mock).mockResolvedValue(null);

    await createSampleProduct("Laptop", 1200);
    await createSampleProduct("Mouse", 75);

    const response = await request(app).get("/api/v1/products");

    expect(response.status).toBe(200);

    expect(response.body.TotalSize).toBe(2);
    expect(response.body.PageSize).toBe(2);
    expect(response.body.PageNumber).toBe(1);

    expect(response.body.Object).toHaveLength(2);
    expect(response.body.Object[0].name).toBe("Mouse");
    expect(response.body.Object[1].name).toBe("Laptop");

    expect(redisClient.get).toHaveBeenCalledWith(
      expect.stringContaining("products:"),
    );
  });

  it("should return products from cache if available", async () => {
    const cachedDbData = {
      products: [{ name: "Cached Laptop", price: 1500, category: "Electronics" }],
      page: 1,
      count: 1,
      totalProducts: 1,
    };

    (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedDbData));

    const response = await request(app).get("/api/v1/products");

    expect(response.status).toBe(200);

    expect(response.body.Message).toContain("(from cache)");
    expect(response.body.Object[0].name).toBe("Cached Laptop");
  });
});
