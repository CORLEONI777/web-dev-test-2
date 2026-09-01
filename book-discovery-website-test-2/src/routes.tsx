import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import DiscoverPage from "./pages/DiscoverPage";
import BookPage from "./pages/BookPage";
import GenrePage from "./pages/GenrePage";
import AuthorPage from "./pages/AuthorPage";
import CollectionPage from "./pages/CollectionPage";
import FreeBooksPage from "./pages/FreeBooksPage";
import TrackerPage from "./pages/TrackerPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "search", Component: SearchPage },
      { path: "discover", Component: DiscoverPage },
      { path: "books/genre/:genre", Component: GenrePage },
      { path: "books/:slug", Component: BookPage },
      { path: "authors/:slug", Component: AuthorPage },
      { path: "best/:slug", Component: CollectionPage },
      { path: "free-books", Component: FreeBooksPage },
      { path: "free-audiobooks", Component: FreeBooksPage },
      { path: "tracker", Component: TrackerPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
