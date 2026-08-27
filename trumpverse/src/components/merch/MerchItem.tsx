import { FC } from "react";
import IMerch from "../../interfaces/IMerch";
import MerchService from "../../services/MerchService";
import "./MerchItem.css";

const MerchItem: FC<IMerch> = ({
  id,
  name,
  price,
  category,
  description,
  image,
}) => {
  return (
    <article className="card merch__article">
      <div className="merch-image__wrapper card-img-top">
        <img
          className="m-3 p-3 rounded d-block"
          src={MerchService.getImageEndpoint() + image}
          alt={"Image of " + name + "."}
        />
      </div>

      <div className="card-body d-flex row align-content-end">
        <h4 className="merch-name card-title text-center pt-3">{name}</h4>
        <p className="text-secondary text-center">
          Category: {category} - ID: {id}
        </p>
        <p className="card-text">{description}</p>
        <h5 className="card-text fw-bold">{price}$</h5>
      </div>
    </article>
  );
};

export default MerchItem;
