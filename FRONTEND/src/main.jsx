import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routers/frontendRoutes.jsx'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // only one retry allowed
      staleTime: 1000 * 60 * 5, // wont refetch for 5 minutes
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)