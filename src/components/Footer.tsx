import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white py-24 px-6">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-[31px] md:text-[51px] font-black mb-8 leading-tight">
              지금 바로 당신의<br />브랜드를 상담하세요.
            </h2>
            <div className="space-y-4 text-sm md:text-base">
              <p>
                <span className="opacity-40 mr-4">Tel.</span>
                <a href="tel:010-9357-8259" className="hover:underline">010-9357-8259</a>
              </p>
              <p>
                <span className="opacity-40 mr-4">Email.</span>
                <a href="mailto:formwork02@gmail.com" className="hover:underline">formwork02@gmail.com</a>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col justify-end md:items-end">
            <p className="text-sm md:text-base font-normal opacity-60 max-w-md md:text-right">
              "우리는 화려한 껍데기가 아닌, 브랜드가 서 있을 수 있는 단단한 거푸집(formwork)을 만듭니다."
            </p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-2xl font-black tracking-tighter">formwork</span>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-xs opacity-40 uppercase">
              © 2026 formwork. ALL RIGHTS RESERVED.
            </p>
            <Link to="/admin" className="text-[10px] opacity-10 hover:opacity-100 transition-opacity uppercase">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
