const trumpMerchModule = (() => {
  const trumpMerch = [
    {
      title: "GET - Get all the merch.",
      description: "Use the endpoint to access all the merch in the database.",
      endpoint: "/TrumpMerch",
      returns: "An array of TrumpMerch objects.",
    },
    {
      title: "GET - Get merch by id.",
      description: `Use the endpoint with the id as a parameter to get the specific merch by id. Example: <code class="url__txt">/TrumpMerch/3</code>`,
      endpoint: "/TrumpMerch/{id}",
      returns: "A TrumpMerch object.",
    },
    {
      title: "GET - Search for merch by name.",
      description: `Use the endpoint with the name as parameter to search for merch by name (supports partial hits). Example: <code class="url__txt">/TrumpMerch/GetByName/MAGA%20Cap</code>`,
      endpoint: "/TrumpMerch/GetByName/{name}",
      returns: "An array of TrumpMerch objects.",
    },
    {
      title: "POST - Post merch.",
      description: "Use the endpoint to post new merch into the database.",
      endpoint: "/TrumpMerch",
      returns: "The TrumpMerch object that was just created.",
    },
    {
      title: "PUT - Edit merch.",
      description:
        "Use the endpoint edit merch that already exist in the database.",
      endpoint: "/TrumpMerch",
      returns: "The TrumpMerch object that was just edited.",
    },
    {
      title: "DELETE - Delete merch by id.",
      description:
        "Use the endpoint to permanently delete merch that exists in the database by id. Use carefully.",
      endpoint: "/TrumpMerch/{id}",
      returns: "No content.",
    },
  ];

  const getAll = () => {
    return structuredClone(trumpMerch);
  };

  return {
    getAll,
  };
})();

export default trumpMerchModule;
