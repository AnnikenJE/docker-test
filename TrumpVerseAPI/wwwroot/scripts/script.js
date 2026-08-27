import uploadImageModule from "./modules/uploadImageModule.js";
import trumpMerchModule from "./modules/trumpMerchModule.js";
import schemaModule from "./modules/schemaModule.js";

const trumpMerch = trumpMerchModule.getAll();
const uploadImage = uploadImageModule.getAll();
const schema = schemaModule.getAll();

const showTrumpMerchInfo = document.querySelector("#showTrumpMerchInfo");
const showUploadImageInfo = document.querySelector("#showUploadImageInfo");
const showSchemaInfo = document.querySelector("#showSchemaInfo");

const infoHTML = (info) => {
  const html = `
    <article class="info__article">
        <h4 class="highlighted-txt">${info.title}</h4>
        <p>${info.description}</p>
        <p>Endpoint: <code class="url__txt">${info.endpoint}</code></p>
        <p>Returns: ${info.returns}</p>
    </article>`;

  return html;
};

const showTrumpMerch = () => {
  trumpMerch.forEach(
    (merchInfo) => (showTrumpMerchInfo.innerHTML += infoHTML(merchInfo))
  );
};

const showUploadImage = () => {
  uploadImage.forEach(
    (uploadImageInfo) =>
      (showUploadImageInfo.innerHTML += infoHTML(uploadImageInfo))
  );
};

const showSchema = () => {
  schema.forEach(
    (schemaInfo) =>
      (showSchemaInfo.innerHTML += `
    <li class="schema-list__element">
      <span class="highlighted-txt">${schemaInfo.title}:</span> 
      ${schemaInfo.type} - ${schemaInfo.description}
    </li>
    `)
  );
};

(() => {
  showTrumpMerch();
  showUploadImage();
  showSchema();
})();
