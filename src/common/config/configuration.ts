const configuration = () => ({
  app: {
    port: process.env.PORT || 3000,
    client_url: process.env.CLIENT_URL || 'http://localhost:3000',
  },
  email: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    server: process.env.MAIL_SERVER,
    password: process.env.MAIL_PASSWORD,
    sender: process.env.MAIL_SENDER,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
});

export = configuration;
