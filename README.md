 Offline Autonomous Safety System

SHEGUARD-X is a progressive web application (PWA) designed to provide instant safety monitoring, live location tracking, distress signal broadcasts via SMS/WhatsApp, and redundant ambient evidence recording.

⚡ Features

* Live GPS Tracking: Real-time accurate geolocation tracking with multi-stage fallback (Hardware GPS & Network/Cellular triangulation).
* Emergency Alert System: One-tap trigger to construct pre-formatted emergency messages containing current coordinates and Google Maps links.
* Instant Dispatch: Quick sharing via SMS protocols and WhatsApp API.
* Dual-Storage Evidence Capture: Ambient audio recording via the Web MediaRecorder API that automatically triggers a local download on the user's device for immediate proof and asynchronously uploads the recording to cloud storage.
* Cloud Backup Integration: Secure audio storage bucket setup using Supabase for centralized remote evidence storage.
* Multi-Network Fallback Support: Simulated modes for 4G, SMS-only fallback, and offline BLE mesh networks.

 🚀 Live Demo

Check out the live deployment here: [she-guard-x.vercel.app](https://she-guard-x.vercel.app)

 🛠️ Built With

* Frontend: HTML5, CSS3 (Custom design tokens & responsive UI), Vanilla JavaScript
* APIs: Geolocation API, Web MediaRecorder API
* Backend & Cloud Storage: Supabase (Storage & Auth)
* Deployment & Hosting: Vercel (CI/CD via GitHub)
