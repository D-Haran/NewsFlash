/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_KEY: "AIzaSyAkAE1mco-3NI1z9V6p34Rhx2vVl4Eew7A",
    NEXT_PUBLIC_AUTH_DOMAIN: "newsflash-15006.firebaseapp.com",
    NEXT_PUBLIC_PROJECT_ID: "newsflash-15006",
    NEXT_PUBLIC_STORAGE_BUCKET: "newsflash-15006.appspot.com",
    NEXT_PUBLIC_MESSAGING_SENDER_ID: "642363322842",
    NEXT_PUBLIC_APP_ID: "1:642363322842:web:948153531159e8d95e90e3",
    NEXT_PUBLIC_MEASUREMENT_ID: "G-3REZTC0F5G"
  }
}

module.exports = nextConfig
