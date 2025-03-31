const request = require("supertest");

const { app, server } = require("../index");

afterAll((done) => {
  server.close(done); // Ensures Jest waits for the server to close
});

describe("Webhook Reflection API", () => {
  test("should echo back a GET request with query params", async () => {
    const response = await request(app)
      .get("/test")
      .query({ foo: "bar", num: 42 });

    expect(response.status).toBe(200);
    expect(response.body.method).toBe("GET");
    expect(response.body.query).toEqual({ foo: "bar", num: "42" }); // Query params are strings
  });

  test("should echo back a POST request with JSON body", async () => {
    const payload = { name: "Webhook", type: "test" };

    const response = await request(app)
      .post("/webhook")
      .send(payload) // Send JSON body
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.method).toBe("POST");
    expect(response.body.body).toEqual(payload);
  });

  test("should echo back a PUT request with form-urlencoded data", async () => {
    const response = await request(app)
      .put("/update")
      .send("key=value&anotherKey=123") // Send form data
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect(response.status).toBe(200);
    expect(response.body.method).toBe("PUT");
    expect(response.body.body).toEqual({ key: "value", anotherKey: "123" });
  });

  test("should echo back request headers", async () => {
    const response = await request(app)
      .post("/headers")
      .set("X-Custom-Header", "HelloJest");

    expect(response.status).toBe(200);
    expect(response.body.headers["x-custom-header"]).toBe("HelloJest");
  });

  test("should support DELETE requests", async () => {
    const response = await request(app).delete("/delete");

    expect(response.status).toBe(200);
    expect(response.body.method).toBe("DELETE");
  });

  test("should support OPTIONS requests", async () => {
    const response = await request(app).options("/options");
 
    expect(response.status).toBe(200);
    expect(response.body.method).toBe("OPTIONS");
  });

  test("should support HEAD requests", async () => {
    const response = await request(app).head("/head");

    expect(response.status).toBe(200);

    const body = JSON.parse(response.headers['x-request-body']);
    expect(body.method).toBe("HEAD");
  });
});
