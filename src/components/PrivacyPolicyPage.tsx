import React, { useState } from 'react';
import { 
  Home, ChevronRight, ShieldCheck, Lock, Cookie, 
  FileText, Image, MessageSquare, Share2, Database, 
  UserCheck, Mail, ArrowRight, ExternalLink, KeyRound, 
  Trash2, Download
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
  onExploreProducts?: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onNavigateHome,
  onExploreProducts
}) => {
  const [activeSection, setActiveSection] = useState<string>('comments');

  const sections = [
    { id: 'comments', title: '1. Comments & Spam Detection' },
    { id: 'media', title: '2. Media & Image Uploads' },
    { id: 'cookies', title: '3. Cookie Policy' },
    { id: 'embedded', title: '4. Embedded Content' },
    { id: 'sharing', title: '5. Who We Share Data With' },
    { id: 'retention', title: '6. Data Retention Period' },
    { id: 'user-rights', title: '7. Your Data Rights' },
    { id: 'data-destination', title: '8. Where Data Is Sent' },
    { id: 'contact', title: '9. Contact & Inquiries' }
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 select-none flex flex-col">
      {/* 1. Hero Banner with Dark Aesthetic Theme */}
      <section className="relative overflow-hidden bg-zinc-950 text-white py-14 sm:py-20 px-4 text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 scale-105"
          style={{ backgroundImage: `url('/hero-banner.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-zinc-950" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-4">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-gray-300"
            >
              <Home size={14} className="text-[#e2b04c]" />
              <span>Home</span>
            </button>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-white font-bold">Privacy Policy</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Lock size={13} />
            <span>Privacy & Data Protection</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-white mb-3">
            PRIVACY POLICY
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
            Your privacy is paramount. Learn how PrintOkiyo collects, manages, and safeguards your personal data, media uploads, and browsing experience.
          </p>
        </div>
      </section>

      {/* 2. Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 text-left">

          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-150">
                <FileText size={16} className="text-[#041e42]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Policy Sections
                </h3>
              </div>
              <nav className="flex flex-col space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-[#041e42] text-white shadow-xs font-bold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-gray-500">Privacy Questions?</span>
                <a 
                  href="mailto:printokiyo@gmail.com" 
                  className="text-xs font-bold text-[#041e42] hover:underline flex items-center gap-1.5"
                >
                  <Mail size={13} />
                  <span>printokiyo@gmail.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Policy Articles Body */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">

            {/* Section 1: Comments */}
            <section id="comments" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  Comments
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p>
                  When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.
                </p>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-150 text-gray-700">
                  <p>
                    An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here:{' '}
                    <a 
                      href="https://automattic.com/privacy/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#041e42] font-bold underline inline-flex items-center gap-1 hover:text-[#002f6c]"
                    >
                      <span>https://automattic.com/privacy/</span>
                      <ExternalLink size={12} />
                    </a>.
                  </p>
                  <p className="mt-2 text-gray-600 font-medium">
                    After approval of your comment, your profile picture is visible to the public in the context of your comment.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Media */}
            <section id="media" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Image size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  Media
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-purple-950 font-medium">
                  If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
                </div>
                <p className="text-gray-600">
                  For custom photo uploads (such as customized polaroid prints or bespoke wall sets), your photos are processed privately and securely stored strictly for production, color calibration, and order fulfillment purposes.
                </p>
              </div>
            </section>

            {/* Section 3: Cookies */}
            <section id="cookies" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Cookie size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  Cookies
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/70">
                  <h3 className="font-bold text-gray-900 mb-1">Comment Cookies</h3>
                  <p>
                    If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for <strong>one year</strong>.
                  </p>
                </div>

                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/70">
                  <h3 className="font-bold text-gray-900 mb-1">Login Verification Cookie</h3>
                  <p>
                    If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
                  </p>
                </div>

                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/70">
                  <h3 className="font-bold text-gray-900 mb-1">Session & Screen Options Cookies</h3>
                  <p>
                    When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for <strong>two days</strong>, and screen options cookies last for a <strong>year</strong>. If you select “Remember Me”, your login will persist for <strong>two weeks</strong>. If you log out of your account, the login cookies will be removed.
                  </p>
                </div>

                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/70">
                  <h3 className="font-bold text-gray-900 mb-1">Content Publication Cookie</h3>
                  <p>
                    If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after <strong>1 day</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Embedded content */}
            <section id="embedded" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <Share2 size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  Embedded content from other websites
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p>
                  Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
                </p>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-150 text-gray-600">
                  These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
                </div>
              </div>
            </section>

            {/* Section 5: Who we share your data with */}
            <section id="sharing" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                  <KeyRound size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  Who we share your data with
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-950 font-semibold">
                  If you request a password reset, your IP address will be included in the reset email.
                </div>
                <p className="text-gray-600">
                  We do not sell, rent, or trade your personal information. Relevant shipping data (such as address and phone number) is shared solely with verified courier partners (Delhivery, Bluedart, etc.) to complete delivery, and payment transactions are tokenized through RBI-compliant payment gateways.
                </p>
              </div>
            </section>

            {/* Section 6: How long we retain your data */}
            <section id="retention" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Database size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  How long we retain your data
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p>
                  If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                </p>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-150">
                  <p className="font-medium text-gray-800">
                    For users that register on our website (if any), we also store the personal information they provide in their user profile.
                  </p>
                  <p className="mt-1 text-gray-600">
                    All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: What rights you have over your data */}
            <section id="user-rights" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <UserCheck size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  What rights you have over your data
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p>
                  If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                    <div className="flex items-center gap-2 font-bold text-blue-950 mb-1">
                      <Download size={16} className="text-blue-600" />
                      <span>Data Export</span>
                    </div>
                    <p className="text-xs text-blue-900/80">
                      Request a full copy of your registered profile history, purchases, and comments.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
                    <div className="flex items-center gap-2 font-bold text-rose-950 mb-1">
                      <Trash2 size={16} className="text-rose-600" />
                      <span>Right to Erasure</span>
                    </div>
                    <p className="text-xs text-rose-900/80">
                      Request deletion of any personal data we hold about you.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic mt-2">
                  This does not include any data we are obliged to keep for administrative, legal, or security purposes.
                </p>
              </div>
            </section>

            {/* Section 8: Where we send your data */}
            <section id="data-destination" className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-gray-900">
                  Where we send your data
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-teal-950 text-xs sm:text-sm font-semibold">
                Visitor comments may be checked through an automated spam detection service.
              </div>
            </section>

            {/* Section 9: Contact */}
            <div id="contact" className="bg-[#041e42] text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider mb-2">
                  Have Privacy Concerns or Requests?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md">
                  Reach out to our Data Protection Officer for data export or account erasure requests.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <a
                  href="mailto:printokiyo@gmail.com?subject=Privacy%20Data%20Request%20-%20PrintOkiyo"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#041e42] font-black text-xs hover:bg-[#e2b04c] hover:text-black transition-all cursor-pointer shadow-xs"
                >
                  <Mail size={15} />
                  <span>Email: printokiyo@gmail.com</span>
                </a>

                {onExploreProducts && (
                  <button
                    type="button"
                    onClick={onExploreProducts}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                  >
                    <span>Back to Shop</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};
