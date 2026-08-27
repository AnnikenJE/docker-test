const schemaModule = (() => {
  const schema = [
    {
      title: "ID",
      type: "int",
      description: "The merch ID.",
    },
    {
      title: "Name",
      type: "string",
      description: "The merch title.",
    },
    {
      title: "Price",
      type: "double",
      description: "The price of the merch in american dollar.",
    },
    {
      title: "Category",
      type: "string",
      description: "Specifies the merchandise category.",
    },
    {
      title: "Description",
      type: "string",
      description: "A short description of the merch.",
    },
    {
      title: "Image",
      type: "string",
      description: "Image of the merch.",
    },
  ];

  const getAll = () => {
    return structuredClone(schema);
  };

  return {
    getAll,
  };
})();

export default schemaModule;
