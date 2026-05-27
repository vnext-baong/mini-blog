const configuration = () => ({
  app: {
    port: process.env.PORT || 3000,
    client_url: process.env.CLIENT_URL || 'http://localhost:3000',
  },
  sendgrid: {
    api_key: process.env.SENDGRID_API_KEY,
    sender: process.env.SENDGRID_SENDER,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
});

export = configuration;
