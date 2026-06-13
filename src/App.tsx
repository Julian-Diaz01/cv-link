import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import NotFoundPage from './pages/NotFoundPage.tsx'

const HomePage = React.lazy(() => import('./pages/HomePage.tsx'))
const CVPage = React.lazy(() => import('./pages/CvPage.tsx'))

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="text-lg">Loading...</div>
              </div>
            }
          >
            <HomePage />
          </Suspense>
        }
      />
      <Route path="/projects" element={<Navigate to="/#projects" replace />} />
      <Route
        path="/cv"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="text-lg">Loading CV...</div>
              </div>
            }
          >
            <CVPage />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </>,
  ),
)

function App() {
  const app = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app)
  console.log(analytics)
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
