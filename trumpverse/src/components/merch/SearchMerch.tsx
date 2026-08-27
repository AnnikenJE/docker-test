import { ChangeEvent, useContext, useState } from "react";
import { MerchContext } from "../../contexts/MerchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import IMerchContext from "../../interfaces/IMerchContext";
import IMerch from "../../interfaces/IMerch";
import MerchItem from "./MerchItem";
import "./SearchMerch.css";

const SearchMerch = () => {
  const { getMerchByName } = useContext(MerchContext) as IMerchContext;

  const [nameInput, setNameInput] = useState<string>("");
  const [searchedName, setSearchedName] = useState<string>("");
  const [merch, setMerch] = useState<IMerch[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };

  const getMerchName = async () => {
    try {
      const merchName = await getMerchByName(nameInput);
      if (merchName) {
        setMerch(merchName);
        setSearchedName(nameInput);
      } else {
        setMerch([]);
        setSearchedName("");
      }
    } catch (e) {
      console.error("Could not search for merch by name in SearchMerch.");
    }
  };

  const showSearchedNameJSX = () => {
    if (searchedName) {
      return (
        <p className="text-center alert alert-info w-50 " role="alert">
          Search result for: {searchedName}
        </p>
      );
    } else {
      return (
        <p className="text-center alert alert-warning w-50" role="alert">
          Please enter your search in the field.
        </p>
      );
    }
  };

  const showSearchResultJSX = () => {
    let JSX;
    if (merch.length > 0) {
      JSX = merch.map((merch) => {
        return (
          <div
            className="p-0 col-sm-12 col-md-6 col-lg-4 col-xl-3 merch-list-item__wrapper"
            key={`merch-${merch.id}`}
          >
            <MerchItem
              id={merch.id}
              name={merch.name}
              price={merch.price}
              category={merch.category}
              description={merch.description}
              image={merch.image}
            />
          </div>
        );
      });
    } else {
      JSX = <p className="text-center m-4">No merch found.</p>;
    }
    return JSX;
  };

  return (
    <section className="container border shadow">
      <h3 className="search-page__txt  text-center pt-3">Search for merch</h3>
      <article className="d-flex justify-content-center m-3">
        <div className="w-25">
          <input
            type="text"
            value={nameInput}
            onChange={handleChange}
            placeholder="Merch name"
            className="form-control "
          />
        </div>
        <button onClick={getMerchName} className="btn btn-primary">
          Search <FontAwesomeIcon icon={faSearch} />
        </button>
      </article>
      <article className=" d-flex justify-content-center ">
        {showSearchedNameJSX()}
      </article>

      <section className="merch__section row m-5 rounded p-0">
        {showSearchResultJSX()}
      </section>
    </section>
  );
};

export default SearchMerch;
