
import { useState } from 'react';
import ContactModal from './ContactModal';
import LegalModal from './LegalModal';

interface FooterProps {
  onOpenSubmission: () => void;
}

const LEGAL_CONTENT = {
  privacy: `隐私政策

生效日期：2026年1月1日

1. 信息收集
我们收集的信息包括但不限于：
- 您提供的个人信息（如姓名、电子邮件地址、电话号码）。
- 您在使用我们服务时产生的日志信息。
- 通过Cookie和其他追踪技术收集的信息。

2. 信息使用
我们将收集的信息用于：
- 提供、维护和改进我们的服务。
- 处理您的投稿和签约申请。
- 向您发送通知和营销信息（您可以随时退订）。

3. 信息共享
除法律规定或为了提供服务必须外，我们不会向第三方出售或共享您的个人信息。

4. 数据安全
我们采取合理的安全措施来保护您的个人信息，防止未经授权的访问、使用或泄露。

5. 您的权利
您有权访问、更正或删除您的个人信息。如需行使这些权利，请通过 daliankey.photo@foxmail.com 联系我们。`,

  terms: `使用条款

欢迎访问 NATURE WAVE 网站。

1. 接受条款
访问或使用本网站，即表示您同意受本使用条款的约束。如果您不同意这些条款，请勿使用本网站。

2. 知识产权
本网站上的所有内容（包括但不限于文本、图像、视频、音频、设计）均归 NATURE WAVE 或其内容提供者所有，受版权法和其他知识产权法的保护。未经授权，不得复制、分发或用于商业用途。

3. 用户行为
您同意不利用本网站进行任何非法或禁止的活动，包括但不限于：
- 发送垃圾邮件或恶意软件。
- 侵犯他人的知识产权或隐私权。
- 干扰网站的正常运行。

4. 免责声明
本网站按“原样”提供，不作任何明示或暗示的保证。我们不对内容的准确性、完整性或可靠性负责。

5. 条款修改
我们保留随时修改这些条款的权利。修改后的条款一经发布即生效。`,

  cookie: `Cookie 政策

1. 什么是 Cookie？
Cookie 是您访问网站时存储在您设备上的小型文本文件。它们用于记住您的偏好并改善您的浏览体验。

2. 我们如何使用 Cookie？
我们使用 Cookie 来：
- 了解您如何使用我们的网站。
- 记住您的登录状态和偏好设置。
- 提供个性化的内容和广告。

3. Cookie 类型
- 必需 Cookie：网站运行所必需的。
- 性能 Cookie：收集有关网站使用情况的匿名数据。
- 功能 Cookie：记住您的选择（如语言、地区）。

4. 管理 Cookie
您可以通过浏览器设置来管理或禁用 Cookie。请注意，禁用 Cookie 可能会影响网站的某些功能。`
};

export default function Footer({ onOpenSubmission }: FooterProps) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalTitle, setContactModalTitle] = useState('');
  
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTitle, setLegalModalTitle] = useState('');
  const [legalModalContent, setLegalModalContent] = useState('');

  const openContactModal = (title: string) => {
    setContactModalTitle(title);
    setContactModalOpen(true);
  };

  const openLegalModal = (title: string, content: string) => {
    setLegalModalTitle(title);
    setLegalModalContent(content);
    setLegalModalOpen(true);
  };

  return (
    <>
      <footer className="bg-neutral-950 text-gray-400 py-12 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-4xl mx-auto text-center">
            <div>
              <h4 className="text-white font-semibold mb-3">展览信息</h4>
              <ul className="space-y-2 flex flex-col items-center">
                <li className="text-gray-500">大连引庭艺术园区</li>
                <li className="text-gray-500">无需购票，免费入场</li>
                <li>
                  <a 
                    href="https://www.amap.com/search?query=大连引庭艺术园区" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline flex items-center gap-1 justify-center"
                  >
                    交通指南
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </li>
                <li className="text-gray-500">邮箱：daliankey.photo@foxmail.com</li>
                <li className="text-gray-500">电话：15640825505</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">参与</h4>
              <ul className="space-y-2 flex flex-col items-center">
                <li>
                  <button 
                    onClick={onOpenSubmission} 
                    className="hover:underline"
                  >
                    作品投稿
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openContactModal('志愿者招募')} 
                    className="hover:underline"
                  >
                    志愿者招募
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openContactModal('赞助合作')} 
                    className="hover:underline"
                  >
                    赞助合作
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">法律条款</h4>
              <ul className="space-y-2 flex flex-col items-center">
                <li>
                  <button 
                    onClick={() => openLegalModal('隐私政策', LEGAL_CONTENT.privacy)}
                    className="hover:underline"
                  >
                    隐私政策
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openLegalModal('使用条款', LEGAL_CONTENT.terms)}
                    className="hover:underline"
                  >
                    使用条款
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openLegalModal('Cookie 政策', LEGAL_CONTENT.cookie)}
                    className="hover:underline"
                  >
                    Cookie 政策
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-4 text-center">
            <p>Copyright © 2026 NATURE WAVE. 保留所有权利。</p>
            <p className="hidden md:block text-white/20">|</p>
            <p>Designed with passion.</p>
          </div>
        </div>
      </footer>
      <ContactModal 
        isOpen={contactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
        title={contactModalTitle} 
      />
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        title={legalModalTitle}
        content={legalModalContent}
      />
    </>
  );
}
