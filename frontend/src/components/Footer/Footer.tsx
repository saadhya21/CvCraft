const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Templates', 'Integrations'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Support: ['Help Center', 'Documentation', 'API Status', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
}

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream/70">
      <div className="container-tight px-4 sm:px-6 pt-20 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cream/10 flex items-center justify-center">
                <span className="text-cream font-display text-sm font-bold">C</span>
              </div>
              <span className="font-display text-xl text-cream font-semibold">CvCraft</span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs text-cream/50">
              AI-powered resume builder helping professionals craft resumes that open doors.
            </p>
            <div className="flex gap-4 mt-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 min-w-[44px] min-h-[44px] rounded-lg bg-cream/5 hover:bg-cream/10 flex items-center justify-center text-cream/40 hover:text-cream/70 transition-all duration-300"
                  aria-label={social}
                >
                  <span className="text-xs font-medium">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-cream mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-cream/50 hover:text-cream/80 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">
            &copy; {new Date().getFullYear()} CvCraft. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-xs text-cream/30 hover:text-cream/50 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
