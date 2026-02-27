const Footer = () => (
  <footer className="bg-[#232946]/80 backdrop-blur-2xl border-t border-[#3be8b0]/10 h-10 flex items-center justify-center w-full fixed left-0 bottom-0 z-40">
    <div className="w-full flex items-center justify-center gap-6 text-white text-sm whitespace-nowrap px-4">
      <span>© {new Date().getFullYear()} Vaibhav Sharma. Built with Efforts (^_^), Love ❤, and lots of ☕</span>
    </div>
  </footer>
);

export default Footer;
