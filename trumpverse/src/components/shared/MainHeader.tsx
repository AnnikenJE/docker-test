import MainNavigation from "./MainNavigation";
import "./MainHeader.css";

const MainHeader = () => {
  return (
    <header className="container-fluid text-center">
      <div className="row">
        <div className="p-4 col-12">
          <a href="http://localhost:5173/ " className="text-decoration-none">
            <h1 className="text-center heading__txt d-inline ">
              DONALD TRUMP MERCH
            </h1>
          </a>
          <h2 className="text-center text-muted sub-heading__txt">
            The greatest merch of all time, the greatest, greatest ever.
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="gx-0">
          <MainNavigation />
        </div>
      </div>
    </header>
  );
};
export default MainHeader;
