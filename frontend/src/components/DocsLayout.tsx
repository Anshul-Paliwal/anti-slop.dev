import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DocsSidebar, DocsMobileNavigation } from "./DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0a] selection:bg-terminal-green/20 selection:text-terminal-green">
      {/* Subtle Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', 
        backgroundSize: '24px 24px' 
      }}></div>
      
      <div className="z-10 relative flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 relative pt-24 pb-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24">
            
            {/* Mobile Navigation */}
            <div className="w-full md:hidden mt-8">
              <DocsMobileNavigation />
            </div>

            {/* Desktop Sidebar Navigation */}
            <div className="hidden md:block w-56 shrink-0 mt-8 sticky top-32 h-[calc(100vh-128px)] overflow-y-auto overflow-x-hidden pt-4 no-scrollbar">
               <DocsSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl mt-8">
              {children}
            </div>

          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
