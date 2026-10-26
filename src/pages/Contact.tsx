import ContactPanel from '../ui/ContactPanel'
export default function Contact() {
  return <main className="page contact-page">
    <div className="wrap page-hero">
      <div><p className="kicker">(联系)</p><h1>从一次交流开始</h1></div>
      <p className="side">关注 AI 应用落地与产品机会，也欢迎聊聊需要把设计、业务与实现连接起来的项目。</p>
    </div>
    <section className="contact-page-body wrap"><ContactPanel light /></section>
  </main>
}
