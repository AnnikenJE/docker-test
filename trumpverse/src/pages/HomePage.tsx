import MerchList from "../components/merch/MerchList";
import DonaldTrumpImage from "../assets/images/DonaldTrumpImage.png";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="container border shadow">
      <section>
        <h3 className="home-page__txt text-center pt-3">
          A collection of Donald Trump's official merch
        </h3>
        <p className="home-page__txt text-center ">Made in USA.</p>
        <img
          className="donald-trump__image rounded "
          src={DonaldTrumpImage}
          alt="Image of Donald Trump raising his fist after getting shot in the ear."
        />
      </section>
      <MerchList />
    </div>
  );
};

export default HomePage;
