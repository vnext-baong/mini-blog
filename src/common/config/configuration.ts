const configuration = () => ({
  app: {
    port: process.env.PORT || 3000,
    client_url: process.env.CLIENT_URL || 'http://localhost:3000',
    server_url: process.env.SERVER_URL || 'http://localhost:3000',
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
  oauth: {
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    google_client_id: process.env.GOOGLE_CLIENT_ID || '',
    google_url_token: process.env.GOOGLE_URL_TOKEN || '',
    google_url_access_token: process.env.GOOGLE_URL_ACCESS_TOKEN || '',
  },
});

export = configuration;
