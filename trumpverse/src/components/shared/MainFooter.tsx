import "./MainFooter.css";

const MainFooter = () => {
  return (
    <footer className="footer container-fluid text-center ">
      <div className="row">
        <div className="footer__txt p-3 col-12">
          <p>2024 - The greatest merch of them all.</p>
          <p>
            Get access to the API:
            <a className="text-decoration-none" href="http://localhost:5290/">
              TrumpVerse API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
