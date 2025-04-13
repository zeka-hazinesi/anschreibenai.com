This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Here are the steps to get started with this project:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/zeka-hazinesi/anschreibenai.com
   cd anschreibenai.com
   ```

2. **Get your API key** from [Google AI Studio](https://aistudio.google.com/) and create a `.env.local` file in the root of the project. You can use the `.env.example` file provided as a template.

   If you need assistance obtaining your Google Generative AI API key, this video provides a step-by-step guide:  
   📺 [How to Retrieve Your Google API Key using Generate AI](https://www.youtube.com/watch?v=bCxQGbU-150)

   Then, open the `.env.local` file and add your API key:

   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
   ```

   Replace `your-api-key-here` with your actual API key.

3. **Install the dependencies** by running:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open the app** in your browser:

   [http://localhost:3888](http://localhost:3888)
