import { render, screen, waitFor, act } from "@testing-library/react";
import { BigListPage } from "./BigListPage";
import { MemoryRouter, useLoaderData } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import React from "react";
import { Post } from "shared";

/**
 * Strategy: Integration Testing (Jest + MSW): Testing the Consumer (BigListPage).
 * Goal: Verify the page fetches data, handles loading, and passes items to the list.
 * Strategy: Mock the virtualized component (BigList) with a simple map function.
 */

// Mock BigList (the "virtualized component" from the perspective of BigListPage)
jest.mock("./BigList", () => ({
  BigList: ({ itemsPromise }: { itemsPromise: Promise<Post[]> }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useState, useEffect } = require("react");
    const [items, setItems] = useState<Post[] | null>(null);

    useEffect(() => {
      let active = true;
      itemsPromise.then((data) => {
        if (active) {
          setItems(data);
        }
      });
      return () => {
        active = false;
      };
    }, [itemsPromise]);

    if (!items) {
      return <div data-testid="mock-loading">Loading items in mock...</div>;
    }

    return (
      <div data-testid="mock-list">
        {items.map((item: Post) => (
          <div key={item.id} data-testid="list-item">
            {item.title}
          </div>
        ))}
      </div>
    );
  },
}));

// Mock react-router-dom loader hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLoaderData: jest.fn(),
}));

const mockPosts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  body: `Body ${i + 1}`,
  userId: 1,
  likes: 10,
}));

const server = setupServer(
  http.get("/api/posts", () => {
    return HttpResponse.json(mockPosts);
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());

describe("BigListPage Integration (Consumer Testing)", () => {
  test("MSW returns 100 items and the page passes them to the mocked list", async () => {
    // 1. Setup: MSW is configured to return 100 items for /api/posts
    const itemsPromise = fetch("/api/posts").then(res => res.json());
    (useLoaderData as jest.Mock).mockReturnValue({ itemsPromise });

    // 2. Act: Render the page
    render(
      <MemoryRouter>
        <BigListPage />
      </MemoryRouter>
    );

    // 3. Assert: The page initially handles the loading state (via our mock's loading state)
    expect(screen.getByTestId("mock-loading")).toBeInTheDocument();

    // 4. Assert: The page fetches data and passes the 100 items into the mocked list
    await waitFor(() => {
      expect(screen.getByTestId("mock-list")).toBeInTheDocument();
      const items = screen.getAllByTestId("list-item");
      expect(items).toHaveLength(100);
      expect(items[0]).toHaveTextContent("Post 1");
      expect(items[99]).toHaveTextContent("Post 100");
    });
  });

  test("handles loading state correctly with a pending promise", async () => {
    let resolvePromise: (value: Post[]) => void;
    const itemsPromise = new Promise<Post[]>((resolve) => {
      resolvePromise = resolve;
    });
    
    (useLoaderData as jest.Mock).mockReturnValue({ itemsPromise });

    render(
      <MemoryRouter>
        <BigListPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("mock-loading")).toBeInTheDocument();

    // Resolve the promise
    await act(async () => {
      resolvePromise!(mockPosts);
    });

    // Verify loading state is gone and items are rendered
    await waitFor(() => {
      expect(screen.queryByTestId("mock-loading")).not.toBeInTheDocument();
      expect(screen.getByTestId("mock-list")).toBeInTheDocument();
    });
  });
});
