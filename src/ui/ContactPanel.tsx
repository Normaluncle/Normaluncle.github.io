import { contact } from '../content'

export default function ContactPanel({ light = false }: { light?: boolean }) {
  return <div className={`glass contact-panel reveal${light ? ' light' : ''}`}>
    <p className="kicker">(开始沟通)</p>
    <h2>聊聊你的下一步。</h2>
    <p className="contact-intro">岗位机会、产品想法，或一个想解决的业务问题，都可以从一次具体的交流开始。</p>
    <div className="contact-details">
      <div><span>邮箱</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
      <div><span>国内邮箱</span><a href={`mailto:${contact.domesticEmail}`}>{contact.domesticEmail}</a></div>
      <div><span>电话</span><a href={`tel:${contact.phone}`}>{contact.phone}</a></div>
      <div><span>所在地</span><p>{contact.location}</p></div>
    </div>
    <a className="wechat-contact" href={contact.qr} target="_blank" rel="noreferrer" aria-label="打开完整微信二维码">
      <img src={contact.qr} alt="王泽斌的微信联系二维码" />
      <span>微信联系<small>扫描二维码，或点开原图保存。</small></span>
    </a>
    <p className="legal">来信时可以附上项目背景、希望解决的问题和大致时间。</p>
  </div>
}
