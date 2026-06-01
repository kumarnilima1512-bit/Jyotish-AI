export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  srcDir: 'app',
  //serverDir: 'app/server',

  tailwindcss: {
    configPath: 'tailwind.config.ts',
    exposeConfig: true
  },
 
  runtimeConfig: {
    geminiApiKey:           process.env.GEMINI_API_KEY         || '',
    notionToken:            process.env.NOTION_TOKEN              || '',
    notionNumberMeaningsDb: process.env.NOTION_NUMBER_MEANINGS_DB || '',
    notionNumerologyDb:     process.env.NOTION_NUMEROLOGY_DB      || '',
    notionTarotDb:          process.env.NOTION_TAROT_DB           || '',
    public: {
      //openaiApiKey: process.env.OPENAI_API_KEY || '',
    }
  },
  app: {
    head: {
      title: 'JYOTISH : Vedic Birth Chart',
      link: [
        {
        rel: 'icon',
        type: 'image/png',
        href: '/images/JYOTISH-logo.png'
        },
         // iPhone / iPad home screen icon
        // {
        //   rel: 'apple-touch-icon',
        //   href: '/images/JYOTISH-logo.png'
        // },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap'
        }
      ]
    }
  }
})
