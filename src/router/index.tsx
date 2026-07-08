import { Route, Routes } from 'react-router-dom'
import { ShortenerPage } from '../pages/home'
import { ShortLinkLoader } from '../pages/redirect'
import { NotFound } from '../pages/error/notFound'

type AppRouterProps = {
  apiBaseUrl: string
}

export function AppRouter({ apiBaseUrl }: AppRouterProps) {
  return (
    <Routes>
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/" element={<ShortenerPage apiBaseUrl={apiBaseUrl} />} />
      <Route path="/shortlink" element={<ShortenerPage apiBaseUrl={apiBaseUrl} />} />
      <Route path="/:short_code" element={<ShortLinkLoader apiBaseUrl={apiBaseUrl} />} />
    </Routes>
  )
}
