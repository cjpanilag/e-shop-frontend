export default {
  methods: {
    serialize: (form, image) => {
      let formData = new FormData();
      for (const [key, value] of Object.entries(form)) {
        formData.append(key, value);
      }
      if (image != undefined || image != null) {
        formData.append("image", image);
      }
      return formData;
    },
  },
};
