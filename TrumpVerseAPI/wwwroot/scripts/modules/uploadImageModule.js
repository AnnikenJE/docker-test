const uploadImageModule = (() => {
  const uploadImage = [
    {
      title: "POST - Post image.",
      description: "Use the endpoint to post a image into the database.",
      endpoint: "/api/UploadImage",
      returns: "No content.",
    },
    {
      title: "PUT - Edit image.",
      description:
        "Use this endpoint to edit a image that is already in the database.",
      endpoint: "/api/UploadImage",
      returns: "No content.",
    },
  ];

  const getAll = () => {
    return structuredClone(uploadImage);
  };

  return {
    getAll,
  };
})();

export default uploadImageModule;
