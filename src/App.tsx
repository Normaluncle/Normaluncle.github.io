import { Link, Route, Routes } from 'react-router-dom'
import Shell from './ui/Shell'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Work from './pages/Work'
import Case from './pages/Case'
import Contact from './pages/Contact'
import News from './pages/News'
import Article from './pages/Article'
import Art from './pages/Art'
import System from './pages/System'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Home />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<Case />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<Article />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/art" element={<Art />} />
        <Route path="/systems/:slug" element={<System />} />
        <Route path="*" element={<main className="page wrap"><h1>这个页面还不存在</h1><p>可以返回首页，继续查看项目与笔记。</p><Link className="pill" to="/">返回首页</Link></main>} />
      </Route>
    </Routes>
  )
}
