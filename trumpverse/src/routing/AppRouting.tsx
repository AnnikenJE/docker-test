import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage, EditPage, CreatePage, SearchPage } from "../pages";
import MainHeader from "../components/shared/MainHeader";
import MainFooter from "../components/shared/MainFooter";

const AppRouting = () => {
  return (
    <BrowserRouter>
      <MainHeader />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/search" element={<SearchPage />}></Route>
        <Route path="/create" element={<CreatePage />}></Route>
        <Route path="/edit" element={<EditPage />}></Route>
      </Routes>
      <MainFooter />
    </BrowserRouter>
  );
};

export default AppRouting;
