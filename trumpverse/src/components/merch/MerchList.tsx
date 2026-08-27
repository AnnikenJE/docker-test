import { useContext, useEffect } from "react";
import { MerchContext } from "../../contexts/MerchContext";
import IMerchContext from "../../interfaces/IMerchContext";
import MerchItem from "./MerchItem";
import "./MerchList.css";

const MerchList = () => {
  const { merch, getMerchFromService } = useContext(
    MerchContext
  ) as IMerchContext;

  useEffect(() => {
    getMerchFromService();
  }, []);

  const showAllMerchJSX = () => {
    const JSX = merch.map((merch) => {
      return (
        <div
          className="p-0 col-sm-12 col-md-6 col-lg-4 col-xl-3 merch-list-item__wrapper"
          key={"merch-" + merch.id}
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
    return JSX;
  };

  return (
    <section className="merch__section row m-5 rounded p-0 border shadow">
      {showAllMerchJSX()}
    </section>
  );
};

export default MerchList;
